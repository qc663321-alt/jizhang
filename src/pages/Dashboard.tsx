import { useState } from 'react';
import OverviewCard from '@/components/Dashboard/OverviewCard';
import QuickActions from '@/components/Dashboard/QuickActions';
import RecentTransactions from '@/components/Dashboard/RecentTransactions';
import TransactionForm from '@/components/Record/TransactionForm';
import { useNavigate } from 'react-router-dom';
import useAppStore from '@/stores/useAppStore';
import type { Transaction } from '@/types';

export default function Dashboard() {
  const navigate = useNavigate();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editTransaction, setEditTransaction] = useState<Transaction | null>(null);
  const transactions = useAppStore((state) => state.transactions);

  const handleAddTransaction = () => {
    setEditTransaction(null);
    setIsFormOpen(true);
  };

  const handleEditTransaction = (id: string) => {
    const transaction = transactions.find(t => t.id === id);
    if (transaction) {
      setEditTransaction(transaction);
      setIsFormOpen(true);
    }
  };

  const handleVoiceRecord = () => {
    alert('🎤 语音录入功能即将上线！');
  };

  const handleSmartImport = () => {
    navigate('/import');
  };

  return (
    <div className="min-h-screen pb-20">
      <header className="bg-gradient-to-r from-cute-pink to-cute-orange text-white px-6 py-8 rounded-b-cute-xl shadow-cute-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">👋 你好呀</h1>
            <p className="text-white/80 text-sm mt-1">今天也要好好记账哦~</p>
          </div>
          <div className="text-4xl animate-float">💖</div>
        </div>
      </header>

      <main className="px-4 py-6 space-y-6 max-w-md mx-auto">
        <OverviewCard />
        <QuickActions 
          onAddTransaction={handleAddTransaction}
          onVoiceRecord={handleVoiceRecord}
          onSmartImport={handleSmartImport}
        />
        <RecentTransactions onEditTransaction={handleEditTransaction} />
      </main>

      <TransactionForm 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)}
        editTransaction={editTransaction}
      />
    </div>
  );
}
