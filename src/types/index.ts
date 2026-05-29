export interface Transaction {
  id: string;
  type: 'income' | 'expense' | 'investment';
  amount: number;
  categoryId: string;
  description: string;
  date: string;
  source?: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense' | 'investment';
  icon: string;
  color: string;
  isDefault: boolean;
}

export interface Budget {
  id: string;
  categoryId: string;
  amount: number;
  period: 'monthly' | 'weekly';
}

export interface ReportCache {
  period: 'week' | 'month' | 'year';
  startDate: string;
  endDate: string;
  data: ReportData;
  generatedAt: string;
}

export interface ReportData {
  totalIncome: number;
  totalExpense: number;
  totalInvestment: number;
  categoryBreakdown: { category: string; amount: number; percentage: number }[];
  trendData: { date: string; income: number; expense: number }[];
}

export interface AIAnalysis {
  summary: string;
  insights: string[];
  suggestions: {
    type: 'saving' | 'investment' | 'spending';
    title: string;
    description: string;
    estimatedSavings?: number;
  }[];
  warnings: string[];
}

export interface AppSettings {
  currency: string;
  theme: 'light' | 'dark' | 'cute';
  autoCategorize: boolean;
  aiEnabled: boolean;
  voiceEnabled: boolean;
}

export type PlatformType = 'alipay' | 'wechat' | 'taobao' | 'jd' | 'pinduoduo' | 'meituan' | 'eleme';

export interface ParsedTransaction {
  id: string;
  amount: number;
  description: string;
  date: string;
  platform: PlatformType;
  rawData: string;
  autoCategoryId?: string;
  confirmed: boolean;
}

export interface ImportResult {
  success: boolean;
  message: string;
  parsedTransactions: ParsedTransaction[];
  skippedCount: number;
  duplicateCount: number;
}
