import { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import CuteCard from '@/components/common/CuteCard';
import { formatCurrency, calculateTotals } from '@/utils/helpers';
import useAppStore from '@/stores/useAppStore';

type Period = 'week' | 'month' | 'year';

export default function Reports() {
  const transactions = useAppStore((state) => state.transactions);
  const settings = useAppStore((state) => state.settings);
  const [period, setPeriod] = useState<Period>('month');

  
  
  const filteredTransactions = useMemo(() => {
    const now = new Date();
    let startDate: Date;
    
    switch (period) {
      case 'week':
        startDate = new Date(now);
        startDate.setDate(startDate.getDate() - 7);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }
    
    return transactions.filter(t => {
      const tDate = new Date(t.date);
      return tDate >= startDate && tDate <= now;
    });
  }, [transactions, period]);

  const { income, expense, investment } = calculateTotals(filteredTransactions);

  const categoryBreakdown = useMemo(() => {
    const categoryMap = new Map<string, number>();
    
    filteredTransactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        const current = categoryMap.get(t.categoryId) || 0;
        categoryMap.set(t.categoryId, current + t.amount);
      });
    
    const total = Array.from(categoryMap.values()).reduce((a, b) => a + b, 0);
    
    return Array.from(categoryMap.entries())
      .map(([categoryId, amount]) => ({
        categoryId,
        amount,
        percentage: total > 0 ? (amount / total) * 100 : 0,
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [filteredTransactions]);

  const COLORS = ['#FFB6C1', '#FFDAB9', '#98FB98', '#87CEEB', '#E6E6FA', '#DDA0DD', '#F0E68C', '#D3D3D3'];

  const weeklyData = useMemo(() => {
    const days = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
    const result = days.map(day => ({ name: day, income: 0, expense: 0 }));
    
    const dayMap = { 1: 0, 2: 1, 3: 2, 4: 3, 5: 4, 6: 5, 0: 6 };
    
    filteredTransactions.forEach(t => {
      const day = new Date(t.date).getDay();
      const idx = dayMap[day as keyof typeof dayMap];
      if (t.type === 'income') {
        result[idx].income += t.amount;
      } else if (t.type === 'expense') {
        result[idx].expense += t.amount;
      }
    });
    
    return result;
  }, [filteredTransactions]);

  return (
    <div className="min-h-screen pb-20">
      <header className="bg-gradient-to-r from-cute-purple to-cute-pink text-white px-6 py-8 rounded-b-cute-xl shadow-cute-lg">
        <h1 className="text-2xl font-bold">📊 统计报告</h1>
        <p className="text-white/80 text-sm mt-1">了解你的财务状况</p>
      </header>

      <main className="px-4 py-6 space-y-6">
        <div className="flex gap-2">
          {(['week', 'month', 'year'] as Period[]).map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`flex-1 py-2 rounded-cute-lg font-medium transition-all ${
                period === p
                  ? 'bg-cute-pink text-white'
                  : 'bg-white text-gray-600 hover:bg-cute-pink/10'
              }`}
            >
              {p === 'week' ? '📆 本周' : p === 'month' ? '📅 本月' : '📈 本年'}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-3">
          <CuteCard className="text-center">
            <p className="text-gray-500 text-xs mb-1">💵 收入</p>
            <p className="font-bold text-green-500">{formatCurrency(income, settings.currency)}</p>
          </CuteCard>
          <CuteCard className="text-center">
            <p className="text-gray-500 text-xs mb-1">💸 支出</p>
            <p className="font-bold text-red-500">{formatCurrency(expense, settings.currency)}</p>
          </CuteCard>
          <CuteCard className="text-center">
            <p className="text-gray-500 text-xs mb-1">📈 投资</p>
            <p className="font-bold text-blue-500">{formatCurrency(investment, settings.currency)}</p>
          </CuteCard>
        </div>

        <CuteCard>
          <h3 className="font-bold text-gray-800 mb-4">🍰 支出分布</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={categoryBreakdown.map((item, idx) => ({
                  name: item.categoryId,
                  value: item.amount,
                  color: COLORS[idx % COLORS.length],
                }))}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {categoryBreakdown.map((_, idx) => (
                  <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => formatCurrency(value, settings.currency)} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-2 mt-4">
            {categoryBreakdown.map((item, idx) => (
              <div key={item.categoryId} className="flex items-center gap-1 text-xs">
                <span 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                />
                <span className="text-gray-600">{item.categoryId} {item.percentage.toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </CuteCard>

        <CuteCard>
          <h3 className="font-bold text-gray-800 mb-4">📈 收支趋势</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weeklyData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value: number) => formatCurrency(value, settings.currency)} />
              <Bar dataKey="income" fill="#90EE90" name="收入" />
              <Bar dataKey="expense" fill="#FFB6C1" name="支出" />
            </BarChart>
          </ResponsiveContainer>
        </CuteCard>
      </main>
    </div>
  );
}
