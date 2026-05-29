import { useState, useMemo } from 'react';
import { Sparkles, Lightbulb, AlertTriangle, TrendingUp } from 'lucide-react';
import CuteCard from '@/components/common/CuteCard';
import CuteButton from '@/components/common/CuteButton';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { calculateTotals, formatCurrency } from '@/utils/helpers';
import useAppStore from '@/stores/useAppStore';
import type { AIAnalysis } from '@/types';

export default function AIAnalysis() {
  const transactions = useAppStore((state) => state.transactions);
  const settings = useAppStore((state) => state.settings);
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);

  const monthlyData = useMemo(() => {
    const now = new Date();
    const monthlyTransactions = transactions.filter(t => {
      const tDate = new Date(t.date);
      return tDate.getMonth() === now.getMonth() && tDate.getFullYear() === now.getFullYear();
    });
    return calculateTotals(monthlyTransactions);
  }, [transactions]);

  const generateMockAnalysis = (): AIAnalysis => {
    const suggestions: AIAnalysis['suggestions'] = [];
    
    if (monthlyData.expense > 3000) {
      suggestions.push({
        type: 'saving',
        title: '优化餐饮支出',
        description: '本月餐饮支出较高，建议尝试自己做饭，可以节省约20%的餐饮费用',
        estimatedSavings: 500,
      });
    }
    
    suggestions.push({
      type: 'investment',
      title: '开始小额投资',
      description: '您目前的投资比例较低，可以考虑每月拿出收入的10%进行稳健投资',
    });
    
    suggestions.push({
      type: 'spending',
      title: '减少冲动消费',
      description: '发现您在购物类别上有较多小额支出，建议设置消费冷静期',
    });

    return {
      summary: `本月收入 ${formatCurrency(monthlyData.income, settings.currency)}，支出 ${formatCurrency(monthlyData.expense, settings.currency)}，投资 ${formatCurrency(monthlyData.investment, settings.currency)}。整体财务状况良好！`,
      insights: [
        '您的主要支出集中在餐饮和购物类别',
        '周末消费明显高于工作日',
        '投资占比较低，可以适当增加',
      ],
      suggestions,
      warnings: monthlyData.expense > monthlyData.income ? ['⚠️ 本月支出超过收入，请注意控制！'] : [],
    };
  };

  const handleAnalyze = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setAnalysis(generateMockAnalysis());
    setIsLoading(false);
  };

  const suggestionIcons = {
    saving: '💰',
    investment: '📈',
    spending: '🛒',
  };

  const suggestionColors = {
    saving: 'bg-green-100 text-green-600',
    investment: 'bg-blue-100 text-blue-600',
    spending: 'bg-orange-100 text-orange-600',
  };

  return (
    <div className="min-h-screen pb-20">
      <header className="bg-gradient-to-r from-cute-orange to-cute-pink text-white px-6 py-8 rounded-b-cute-xl shadow-cute-lg">
        <h1 className="text-2xl font-bold">🤖 AI 分析</h1>
        <p className="text-white/80 text-sm mt-1">让AI帮你分析消费习惯</p>
      </header>

      <main className="px-4 py-6 space-y-6">
        <CuteCard className="text-center">
          <p className="text-gray-500 text-sm mb-2">本月财务概览</p>
          <div className="flex justify-center gap-6">
            <div>
              <p className="text-green-500 font-bold text-lg">+{formatCurrency(monthlyData.income, settings.currency)}</p>
              <p className="text-gray-400 text-xs">收入</p>
            </div>
            <div>
              <p className="text-red-500 font-bold text-lg">-{formatCurrency(monthlyData.expense, settings.currency)}</p>
              <p className="text-gray-400 text-xs">支出</p>
            </div>
            <div>
              <p className="text-blue-500 font-bold text-lg">+{formatCurrency(monthlyData.investment, settings.currency)}</p>
              <p className="text-gray-400 text-xs">投资</p>
            </div>
          </div>
        </CuteCard>

        <CuteButton onClick={handleAnalyze} disabled={isLoading} className="w-full">
          {isLoading ? (
            <span className="flex items-center gap-2">
              <LoadingSpinner size="sm" />
              分析中...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              开始AI分析
            </span>
          )}
        </CuteButton>

        {isLoading && (
          <CuteCard className="text-center py-8">
            <div className="text-6xl mb-4 animate-float">🤔</div>
            <p className="text-gray-500">AI正在分析您的消费数据...</p>
          </CuteCard>
        )}

        {analysis && (
          <>
            <CuteCard>
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb className="w-5 h-5 text-cute-orange" />
                <h3 className="font-bold text-gray-800">💡 分析总结</h3>
              </div>
              <p className="text-gray-600 leading-relaxed">{analysis.summary}</p>
            </CuteCard>

            <CuteCard>
              <h3 className="font-bold text-gray-800 mb-4">🔍 消费洞察</h3>
              <ul className="space-y-3">
                {analysis.insights.map((insight, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-cute-pink">✓</span>
                    <span className="text-gray-600">{insight}</span>
                  </li>
                ))}
              </ul>
            </CuteCard>

            {analysis.warnings.length > 0 && (
              <CuteCard className="bg-red-50 border border-red-200">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  <h3 className="font-bold text-red-600">⚠️ 注意事项</h3>
                </div>
                <ul className="space-y-2">
                  {analysis.warnings.map((warning, idx) => (
                    <li key={idx} className="text-red-600">{warning}</li>
                  ))}
                </ul>
              </CuteCard>
            )}

            <CuteCard>
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-cute-green" />
                <h3 className="font-bold text-gray-800">💪 优化建议</h3>
              </div>
              <div className="space-y-4">
                {analysis.suggestions.map((suggestion, idx) => (
                  <div key={idx} className="p-4 bg-gray-50 rounded-cute-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">{suggestionIcons[suggestion.type]}</span>
                      <span className={`text-sm font-medium px-2 py-1 rounded-full ${suggestionColors[suggestion.type]}`}>
                        {suggestion.type === 'saving' ? '省钱' : suggestion.type === 'investment' ? '投资' : '消费'}
                      </span>
                    </div>
                    <h4 className="font-bold text-gray-800 mb-1">{suggestion.title}</h4>
                    <p className="text-gray-600 text-sm">{suggestion.description}</p>
                    {suggestion.estimatedSavings && (
                      <p className="text-cute-green font-medium mt-2">
                        💵 预计可节省: {formatCurrency(suggestion.estimatedSavings, settings.currency)}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </CuteCard>
          </>
        )}
      </main>
    </div>
  );
}
