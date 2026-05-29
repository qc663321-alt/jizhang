import { useState, useRef } from 'react';
import { Check, Upload, Image } from 'lucide-react';
import CuteCard from '@/components/common/CuteCard';
import CuteButton from '@/components/common/CuteButton';
import { PLATFORMS } from '@/data/defaults';
import { parseCSV, autoCategorize, generateId } from '@/utils/helpers';
import useAppStore from '@/stores/useAppStore';
import type { PlatformType, ParsedTransaction } from '@/types';

export default function SmartImport() {
  const addTransaction = useAppStore((state) => state.addTransaction);
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformType>('alipay');
  const [parsedTransactions, setParsedTransactions] = useState<ParsedTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [importComplete, setImportComplete] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const parsedData = parseCSV(content, selectedPlatform);
      
      const transactions: ParsedTransaction[] = parsedData.map(item => ({
        id: generateId(),
        amount: item.amount,
        description: item.description,
        date: item.date,
        platform: selectedPlatform,
        rawData: content,
        autoCategoryId: autoCategorize(item.description) || undefined,
        confirmed: false,
      }));
      
      setParsedTransactions(transactions);
      setIsLoading(false);
    };
    
    reader.readAsText(file, 'GBK');
  };

  const handleConfirmAll = () => {
    setParsedTransactions(prev => prev.map(t => ({ ...t, confirmed: true })));
  };

  const handleToggleConfirm = (id: string) => {
    setParsedTransactions(prev => prev.map(t => 
      t.id === id ? { ...t, confirmed: !t.confirmed } : t
    ));
  };

  const handleImport = () => {
    const confirmed = parsedTransactions.filter(t => t.confirmed);
    
    confirmed.forEach(t => {
      addTransaction({
        type: 'expense',
        amount: t.amount,
        categoryId: t.autoCategoryId || 'cat-8',
        description: t.description,
        date: t.date,
        source: t.platform,
      });
    });
    
    setImportComplete(true);
  };

  const selectedPlatformInfo = PLATFORMS.find(p => p.id === selectedPlatform);

  if (importComplete) {
    return (
      <div className="min-h-screen pb-20">
        <header className="bg-gradient-to-r from-cute-green to-emerald-400 text-white px-6 py-8 rounded-b-cute-xl shadow-cute-lg">
          <h1 className="text-2xl font-bold">🎉 导入成功</h1>
          <p className="text-white/80 text-sm mt-1">已成功导入 {parsedTransactions.filter(t => t.confirmed).length} 条记录</p>
        </header>
        
        <main className="px-4 py-6">
          <CuteCard className="text-center py-12">
            <div className="text-6xl mb-4">✨</div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">太棒了！</h2>
            <p className="text-gray-500">账单导入成功，快去查看吧~</p>
          </CuteCard>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      <header className="bg-gradient-to-r from-cute-green to-cute-purple text-white px-6 py-8 rounded-b-cute-xl shadow-cute-lg">
        <h1 className="text-2xl font-bold">📥 智能导入</h1>
        <p className="text-white/80 text-sm mt-1">一键导入支付宝、微信等平台账单</p>
      </header>

      <main className="px-4 py-6 space-y-6">
        <CuteCard>
          <h3 className="font-bold text-gray-800 mb-4">🎯 选择平台</h3>
          <div className="grid grid-cols-4 gap-2">
            {PLATFORMS.map((platform) => (
              <button
                key={platform.id}
                onClick={() => setSelectedPlatform(platform.id as PlatformType)}
                className={`flex flex-col items-center gap-1 p-3 rounded-cute-lg transition-all ${
                  selectedPlatform === platform.id
                    ? 'bg-cute-pink text-white shadow-cute'
                    : 'bg-gray-50 hover:bg-cute-pink/10'
                }`}
              >
                <span className="text-2xl">{platform.icon}</span>
                <span className="text-xs">{platform.name}</span>
              </button>
            ))}
          </div>
        </CuteCard>

        <CuteCard>
          <h3 className="font-bold text-gray-800 mb-4">📁 上传账单文件</h3>
          <p className="text-sm text-gray-500 mb-4">
            请在{selectedPlatformInfo?.name}中导出CSV格式的账单文件后上传
          </p>
          
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileSelect}
            className="hidden"
          />
          
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center gap-2 p-6 bg-cute-pink/10 rounded-cute-lg hover:bg-cute-pink/20 transition-colors"
            >
              <Upload className="w-8 h-8 text-cute-pink" />
              <span className="text-sm text-gray-700">上传CSV文件</span>
            </button>
            <button
              className="flex flex-col items-center gap-2 p-6 bg-cute-green/10 rounded-cute-lg hover:bg-cute-green/20 transition-colors"
            >
              <Image className="w-8 h-8 text-cute-green" />
              <span className="text-sm text-gray-700">截图识别</span>
            </button>
          </div>
        </CuteCard>

        {isLoading && (
          <CuteCard className="text-center py-8">
            <div className="text-4xl mb-2 animate-spin">⏳</div>
            <p className="text-gray-500">正在解析账单...</p>
          </CuteCard>
        )}

        {parsedTransactions.length > 0 && !isLoading && (
          <>
            <CuteCard>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-800">📋 识别结果</h3>
                <button
                  onClick={handleConfirmAll}
                  className="text-sm text-cute-pink hover:underline"
                >
                  {parsedTransactions.every(t => t.confirmed) ? '取消全选' : '全选'}
                </button>
              </div>
              
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {parsedTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className={`flex items-center justify-between p-3 rounded-cute transition-colors ${
                      transaction.confirmed ? 'bg-cute-green/10' : 'bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleToggleConfirm(transaction.id)}
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                          transaction.confirmed 
                            ? 'bg-cute-green border-cute-green' 
                            : 'border-gray-300'
                        }`}
                      >
                        {transaction.confirmed && <Check className="w-4 h-4 text-white" />}
                      </button>
                      <div>
                        <p className="font-medium text-gray-800">{transaction.description}</p>
                        <p className="text-xs text-gray-400">{transaction.date}</p>
                      </div>
                    </div>
                    <span className="font-bold text-red-500">-¥{transaction.amount.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </CuteCard>

            <CuteButton onClick={handleImport} className="w-full">
              📥 导入 {parsedTransactions.filter(t => t.confirmed).length} 条记录
            </CuteButton>
          </>
        )}
      </main>
    </div>
  );
}
