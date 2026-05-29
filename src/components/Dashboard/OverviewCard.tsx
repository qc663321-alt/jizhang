import CuteCard from '../common/CuteCard';
import { formatCurrency, calculateTotals } from '@/utils/helpers';
import useAppStore from '@/stores/useAppStore';

export default function OverviewCard() {
  const transactions = useAppStore((state) => state.transactions);
  const settings = useAppStore((state) => state.settings);
  const today = new Date().toISOString().split('T')[0];
  
  const todayTransactions = transactions.filter(t => t.date === today);
  const { income, expense } = calculateTotals(todayTransactions);
  const totalBalance = income - expense;
  
  const totalMonthly = calculateTotals(
    transactions.filter(t => {
      const tDate = new Date(t.date);
      const now = new Date();
      return tDate.getMonth() === now.getMonth() && tDate.getFullYear() === now.getFullYear();
    })
  );

  const stats = [
    { label: '今日收入', value: income, color: 'text-green-500', bg: 'bg-green-50' },
    { label: '今日支出', value: expense, color: 'text-red-500', bg: 'bg-red-50' },
    { label: '本月结余', value: totalMonthly.income - totalMonthly.expense, color: 'text-blue-500', bg: 'bg-blue-50' },
  ];

  return (
    <div className="space-y-4">
      <CuteCard gradient className="relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-cute-pink/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-gray-500 text-sm">💰 今日余额</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">
                {formatCurrency(totalBalance, settings.currency)}
              </p>
            </div>
            <div className="text-5xl animate-float">✨</div>
          </div>
        </div>
      </CuteCard>

      <div className="grid grid-cols-3 gap-3">
        {stats.map((stat) => (
          <CuteCard key={stat.label} className="text-center">
            <p className="text-gray-500 text-xs mb-1">{stat.label}</p>
            <p className={`font-bold ${stat.color}`}>
              {stat.value >= 0 ? '+' : ''}{formatCurrency(stat.value, settings.currency)}
            </p>
          </CuteCard>
        ))}
      </div>
    </div>
  );
}
