import type { Transaction, Category, PlatformType } from '@/types';
import { CATEGORY_RULES, DEFAULT_CATEGORIES } from '@/data/defaults';

export function formatCurrency(amount: number, currency: string = 'CNY'): string {
  const formatter = new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  });
  return formatter.format(amount);
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${month}月${day}日`;
}

export function formatDateFull(dateStr: string): string {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}年${month}月${day}日`;
}

export function getToday(): string {
  return new Date().toISOString().split('T')[0];
}

export function getWeekRange(): { start: string; end: string } {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  const start = new Date(now.setDate(diff));
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  return {
    start: start.toISOString().split('T')[0],
    end: end.toISOString().split('T')[0],
  };
}

export function getMonthRange(): { start: string; end: string } {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return {
    start: start.toISOString().split('T')[0],
    end: end.toISOString().split('T')[0],
  };
}

export function getYearRange(): { start: string; end: string } {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const end = new Date(now.getFullYear(), 11, 31);
  return {
    start: start.toISOString().split('T')[0],
    end: end.toISOString().split('T')[0],
  };
}

export function autoCategorize(description: string): string | undefined {
  const lowerDesc = description.toLowerCase();
  for (const rule of CATEGORY_RULES) {
    if (rule.keywords.some(keyword => lowerDesc.includes(keyword.toLowerCase()))) {
      return rule.categoryId;
    }
  }
  return undefined;
}

export function getCategoryById(categoryId: string): Category | undefined {
  return DEFAULT_CATEGORIES.find(cat => cat.id === categoryId);
}

export function getCategoriesByType(type: 'income' | 'expense' | 'investment'): Category[] {
  return DEFAULT_CATEGORIES.filter(cat => cat.type === type);
}

export function calculateTotals(transactions: Transaction[]): { income: number; expense: number; investment: number } {
  return transactions.reduce(
    (acc, transaction) => {
      if (transaction.type === 'income') {
        acc.income += transaction.amount;
      } else if (transaction.type === 'expense') {
        acc.expense += transaction.amount;
      } else if (transaction.type === 'investment') {
        acc.investment += transaction.amount;
      }
      return acc;
    },
    { income: 0, expense: 0, investment: 0 }
  );
}

export function groupTransactionsByDate(transactions: Transaction[]): Map<string, Transaction[]> {
  const groups = new Map<string, Transaction[]>();
  transactions.forEach(transaction => {
    if (!groups.has(transaction.date)) {
      groups.set(transaction.date, []);
    }
    groups.get(transaction.date)!.push(transaction);
  });
  return groups;
}

export function parseAlipayCSV(content: string): Array<{ date: string; amount: number; description: string }> {
  const lines = content.split('\n').filter(line => line.trim());
  const result: Array<{ date: string; amount: number; description: string }> = [];
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    const parts = line.split(',');
    if (parts.length >= 5) {
      const date = parts[0]?.trim();
      const description = parts[1]?.trim() || parts[2]?.trim() || '';
      const amountStr = parts[4]?.trim();
      const amount = parseFloat(amountStr) || 0;
      
      if (date && amount > 0) {
        result.push({ date, amount, description });
      }
    }
  }
  
  return result;
}

export function parseWechatCSV(content: string): Array<{ date: string; amount: number; description: string }> {
  const lines = content.split('\n').filter(line => line.trim());
  const result: Array<{ date: string; amount: number; description: string }> = [];
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    const parts = line.split(',');
    if (parts.length >= 8) {
      const date = parts[0]?.trim();
      const description = parts[6]?.trim() || '';
      const amountStr = parts[7]?.trim();
      const amount = parseFloat(amountStr) || 0;
      
      if (date && amount > 0) {
        result.push({ date, amount, description });
      }
    }
  }
  
  return result;
}

export function parseCSV(content: string, platform: PlatformType): Array<{ date: string; amount: number; description: string }> {
  switch (platform) {
    case 'alipay':
      return parseAlipayCSV(content);
    case 'wechat':
      return parseWechatCSV(content);
    case 'taobao':
    case 'jd':
    case 'meituan':
    case 'eleme':
      return parseAlipayCSV(content);
    default:
      return [];
  }
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}
