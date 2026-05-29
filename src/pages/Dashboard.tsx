import { useState, useRef, useEffect } from 'react';
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
  const [isRecording, setIsRecording] = useState(false);
  const [voiceText, setVoiceText] = useState('');
  const recognitionRef = useRef<any>(null);
  const transactions = useAppStore((state) => state.transactions);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'zh-CN';

        recognitionRef.current.onresult = (event: any) => {
          let transcript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
          }
          setVoiceText(transcript);
        };

        recognitionRef.current.onend = () => {
          setIsRecording(false);
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error('语音识别错误:', event.error);
          setIsRecording(false);
        };
      }
    }
  }, []);

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
    if (!recognitionRef.current) {
      alert('抱歉，您的浏览器不支持语音识别功能，建议使用 Chrome 浏览器');
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
    } else {
      setVoiceText('');
      setIsRecording(true);
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.error(e);
        setIsRecording(false);
      }
    }
  };

  const parseVoiceText = (text: string) => {
    const amountMatch = text.match(/(\d+(?:\.\d+)?)/);
    let amount = amountMatch ? parseFloat(amountMatch[1]) : 0;

    let category = '餐饮';
    let type: 'income' | 'expense' = 'expense';

    if (text.includes('赚') || text.includes('收入') || text.includes('工资') || text.includes('进账')) {
      type = 'income';
    }

    if (text.includes('吃') || text.includes('饭') || text.includes('餐')) category = '餐饮';
    else if (text.includes('交通') || text.includes('车') || text.includes('地铁') || text.includes('打车')) category = '交通';
    else if (text.includes('购物') || text.includes('买') || text.includes('淘宝') || text.includes('网购')) category = '购物';
    else if (text.includes('娱乐') || text.includes('玩') || text.includes('电影')) category = '娱乐';
    else if (text.includes('医疗') || text.includes('药') || text.includes('看病')) category = '医疗';
    else if (text.includes('教育') || text.includes('书') || text.includes('学习')) category = '教育';
    else if (text.includes('房租') || text.includes('住') || text.includes('房子')) category = '居住';
    else if (text.includes('其他') || text.includes('别的')) category = '其他';

    return {
      amount,
      category,
      type,
      description: text
    };
  };

  const handleSmartImport = () => {
    navigate('/import');
  };

  useEffect(() => {
    if (voiceText && !isRecording) {
      const parsed = parseVoiceText(voiceText);
      if (parsed) {
        setEditTransaction(null);
        setIsFormOpen(true);
        setTimeout(() => {
          const event = new CustomEvent('voice-transaction', { detail: parsed });
          window.dispatchEvent(event);
        }, 100);
      }
      setVoiceText('');
    }
  }, [voiceText, isRecording]);

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
