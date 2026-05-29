import { useState, useEffect, useCallback } from 'react';
import { X, Check } from 'lucide-react';
import CuteButton from '../common/CuteButton';
import CategorySelector from './CategorySelector';
import useAppStore from '@/stores/useAppStore';
import { getToday, autoCategorize, getCategoryById, getCategoriesByType } from '@/utils/helpers';
import type { Transaction, Category } from '@/types';

interface TransactionFormProps {
  isOpen: boolean;
  onClose: () => void;
  editTransaction?: Transaction | null;
}

export default function TransactionForm({ isOpen, onClose, editTransaction }: TransactionFormProps) {
  const addTransaction = useAppStore((state) => state.addTransaction);
  const updateTransaction = useAppStore((state) => state.updateTransaction);
  const settings = useAppStore((state) => state.settings);

  const [type, setType] = useState<'income' | 'expense' | 'investment'>('expense');
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(getToday());

  useEffect(() => {
    if (editTransaction) {
      setType(editTransaction.type);
      setAmount(editTransaction.amount.toString());
      setCategoryId(editTransaction.categoryId);
      setDescription(editTransaction.description);
      setDate(editTransaction.date);
    } else {
      setType('expense');
      setAmount('');
      setCategoryId('');
      setDescription('');
      setDate(getToday());
    }
  }, [isOpen, editTransaction]);

  useEffect(() => {
    if (settings.autoCategorize && description && !categoryId) {
      const autoCat = autoCategorize(description);
      if (autoCat) {
        const cat = getCategoryById(autoCat);
        if (cat && cat.type === type) {
          setCategoryId(autoCat);
        }
      }
    }
  }, [description, type, settings.autoCategorize]);

  const handleVoiceData = useCallback((event: any) => {
    const data = event.detail;
    if (data) {
      setType(data.type);
      setAmount(data.amount.toString());
      setDescription(data.description);
      
      const categories = getCategoriesByType(data.type);
      const matchingCategory = categories.find((cat: Category) => 
        cat.name.includes(data.category) || 
        data.category.includes(cat.name)
      ) || categories[0];
      
      if (matchingCategory) {
        setCategoryId(matchingCategory.id);
      }
    }
  }, []);

  useEffect(() => {
    window.addEventListener('voice-transaction', handleVoiceData);
    return () => {
      window.removeEventListener('voice-transaction', handleVoiceData);
    };
  }, [handleVoiceData]);

  const handleSubmit = () => {
    if (!amount || !categoryId) {
      alert('请填写金额并选择分类');
      return;
    }

    const transactionData = {
      type,
      amount: parseFloat(amount),
      categoryId,
      description: description || getCategoryById(categoryId)?.name || '',
      date,
    };

    if (editTransaction) {
      updateTransaction(editTransaction.id, transactionData);
    } else {
      addTransaction(transactionData);
    }

    onClose();
  };

  if (!isOpen) return null;

  const typeButtons = [
    { value: 'expense', label: '支出', emoji: '💸', color: 'bg-red-100 text-red-600' },
    { value: 'income', label: '收入', emoji: '💵', color: 'bg-green-100 text-green-600' },
    { value: 'investment', label: '投资', emoji: '📈', color: 'bg-blue-100 text-blue-600' },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50">
      <div className="bg-white w-full max-w-lg rounded-t-cute-xl max-h-[80vh] overflow-y-auto">
        <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-800">
            {editTransaction ? '✏️ 编辑记录' : '➕ 添加记录'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex gap-2">
            {typeButtons.map((btn) => (
              <button
                key={btn.value}
                onClick={() => {
                  setType(btn.value as 'income' | 'expense' | 'investment');
                  setCategoryId('');
                }}
                className={`flex-1 py-3 rounded-cute-lg font-medium transition-all ${
                  type === btn.value
                    ? `${btn.color} ring-2 ring-offset-2 ring-current`
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {btn.emoji} {btn.label}
              </button>
            ))}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600 mb-2 block">💰 金额</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">¥</span>
              <input
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="cute-input pl-10 text-2xl font-bold"
              />
            </div>
          </div>

          <CategorySelector
            type={type}
            selectedId={categoryId}
            onSelect={setCategoryId}
          />

          <div>
            <label className="text-sm font-medium text-gray-600 mb-2 block">📝 备注</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="添加备注（可选）"
              className="cute-input"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600 mb-2 block">📅 日期</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="cute-input"
            />
          </div>

          <CuteButton onClick={handleSubmit} className="w-full">
            <Check className="w-5 h-5 inline-block mr-2" />
            {editTransaction ? '保存修改' : '保存记录'}
          </CuteButton>
        </div>
      </div>
    </div>
  );
}
