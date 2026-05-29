import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import localForage from 'localforage';
import type { Transaction, Category, Budget, ReportCache, AppSettings, ReportData } from '@/types';
import { DEFAULT_CATEGORIES } from '@/data/defaults';

interface AppState {
  transactions: Transaction[];
  categories: Category[];
  budgets: Budget[];
  reportCache: ReportCache[];
  settings: AppSettings;

  addTransaction: (transaction: Omit<Transaction, 'id' | 'createdAt'>) => void;
  updateTransaction: (id: string, updates: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;

  addCategory: (category: Omit<Category, 'id' | 'isDefault'>) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;

  setBudget: (categoryId: string, amount: number, period: 'monthly' | 'weekly') => void;

  updateSettings: (updates: Partial<AppSettings>) => void;

  cacheReport: (period: 'week' | 'month' | 'year', data: ReportData) => void;
  getCachedReport: (period: 'week' | 'month' | 'year') => ReportData | null;
}

const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      transactions: [],
      categories: DEFAULT_CATEGORIES,
      budgets: [],
      reportCache: [],
      settings: {
        currency: 'CNY',
        theme: 'cute',
        autoCategorize: true,
        aiEnabled: true,
        voiceEnabled: true,
      },

      addTransaction: (transaction) => {
        const newTransaction: Transaction = {
          ...transaction,
          id: Date.now().toString(36) + Math.random().toString(36).substr(2),
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          transactions: [...state.transactions, newTransaction],
        }));
      },

      updateTransaction: (id, updates) => {
        set((state) => ({
          transactions: state.transactions.map((t) =>
            t.id === id ? { ...t, ...updates } : t
          ),
        }));
      },

      deleteTransaction: (id) => {
        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== id),
        }));
      },

      addCategory: (category) => {
        const newCategory: Category = {
          ...category,
          id: Date.now().toString(36) + Math.random().toString(36).substr(2),
          isDefault: false,
        };
        set((state) => ({
          categories: [...state.categories, newCategory],
        }));
      },

      updateCategory: (id, updates) => {
        set((state) => ({
          categories: state.categories.map((c) =>
            c.id === id ? { ...c, ...updates } : c
          ),
        }));
      },

      deleteCategory: (id) => {
        set((state) => ({
          categories: state.categories.filter((c) => c.id !== id),
        }));
      },

      setBudget: (categoryId, amount, period) => {
        set((state) => {
          const existingIndex = state.budgets.findIndex(
            (b) => b.categoryId === categoryId && b.period === period
          );
          if (existingIndex >= 0) {
            const newBudgets = [...state.budgets];
            newBudgets[existingIndex] = {
              ...newBudgets[existingIndex],
              amount,
            };
            return { budgets: newBudgets };
          } else {
            const newBudget: Budget = {
              id: Date.now().toString(36) + Math.random().toString(36).substr(2),
              categoryId,
              amount,
              period,
            };
            return { budgets: [...state.budgets, newBudget] };
          }
        });
      },

      updateSettings: (updates) => {
        set((state) => ({
          settings: { ...state.settings, ...updates },
        }));
      },

      cacheReport: (period, data) => {
        const now = new Date();
        const range = {
          week: { days: 7 },
          month: { days: 30 },
          year: { days: 365 },
        };
        const startDate = new Date(now);
        startDate.setDate(startDate.getDate() - range[period].days);

        set((state) => ({
          reportCache: [
            ...state.reportCache.filter((r) => r.period !== period),
            {
              period,
              startDate: startDate.toISOString().split('T')[0],
              endDate: now.toISOString().split('T')[0],
              data,
              generatedAt: now.toISOString(),
            },
          ].slice(-12),
        }));
      },

      getCachedReport: (period) => {
        const cache = get().reportCache.find((r) => r.period === period);
        if (!cache) return null;
        const cacheAge = Date.now() - new Date(cache.generatedAt).getTime();
        if (cacheAge > 24 * 60 * 60 * 1000) return null;
        return cache.data;
      },
    }),
    {
      name: 'cute-budget-app-v1',
      storage: createJSONStorage(() => localForage),
      partialize: (state) => ({
        transactions: state.transactions,
        categories: state.categories,
        budgets: state.budgets,
        reportCache: state.reportCache.slice(-12),
        settings: state.settings,
      }),
    }
  )
);

export default useAppStore;
