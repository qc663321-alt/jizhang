import { Trash2, Edit2 } from 'lucide-react';
import CuteCard from '../common/CuteCard';
import { formatCurrency, formatDate, getCategoryById } from '@/utils/helpers';
import useAppStore from '@/stores/useAppStore';

interface RecentTransactionsProps {
  onEditTransaction: (id: string) => void;
}

export default function RecentTransactions({ onEditTransaction }: RecentTransactionsProps) {
  const transactions = useAppStore((state) => state.transactions);
  const deleteTransaction = useAppStore((state) => state.deleteTransaction);
  const settings = useAppStore((state) => state.settings);

  const sortedTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10);

  const handleDelete = (id: string) => {
    if (confirm('确定要删除这条记录吗？')) {
      deleteTransaction(id);
    }
  };

  if (sortedTransactions.length === 0) {
    return (
      <CuteCard>
        <div className="text-center py-8">
          <p className="text-4xl mb-2">📝</p>
          <p className="text-gray-500">还没有任何记录</p>
          <p className="text-gray-400 text-sm mt-1">点击上方按钮开始记账吧~</p>
        </div>
      </CuteCard>
    );
  }

  return (
    <CuteCard>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-800">📋 最近记录</h3>
        <span className="text-xs text-gray-400">{transactions.length}条记录</span>
      </div>
      
      <div className="space-y-3">
        {sortedTransactions.map((transaction) => {
          const category = getCategoryById(transaction.categoryId);
          const isIncome = transaction.type === 'income';
          
          return (
            <div 
              key={transaction.id} 
              className="flex items-center justify-between p-3 bg-gray-50 rounded-cute hover:bg-cute-pink/5 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{category?.icon || '💡'}</span>
                <div>
                  <p className="font-medium text-gray-800">{transaction.description}</p>
                  <p className="text-xs text-gray-400">{formatDate(transaction.date)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`font-bold ${isIncome ? 'text-green-500' : 'text-red-500'}`}>
                  {isIncome ? '+' : '-'}{formatCurrency(transaction.amount, settings.currency)}
                </span>
                <div className="flex items-center gap-1">
                  <button 
                    onClick={() => onEditTransaction(transaction.id)}
                    className="p-1 text-gray-400 hover:text-cute-pink transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(transaction.id)}
                    className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </CuteCard>
  );
}
