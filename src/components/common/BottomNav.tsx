import { Home, PieChart, Upload, Brain, Settings } from 'lucide-react';

interface BottomNavProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export default function BottomNav({ currentPage, onNavigate }: BottomNavProps) {
  const navItems = [
    { id: '/', icon: <Home className="w-6 h-6" />, label: '首页', emoji: '🏠' },
    { id: '/reports', icon: <PieChart className="w-6 h-6" />, label: '报告', emoji: '📊' },
    { id: '/import', icon: <Upload className="w-6 h-6" />, label: '导入', emoji: '📥' },
    { id: '/ai-analysis', icon: <Brain className="w-6 h-6" />, label: 'AI', emoji: '🤖' },
    { id: '/settings', icon: <Settings className="w-6 h-6" />, label: '设置', emoji: '⚙️' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-lg pb-safe z-40">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-cute-lg transition-all ${
                isActive 
                  ? 'text-cute-pink bg-cute-pink/10' 
                  : 'text-gray-500 hover:text-cute-pink hover:bg-gray-50'
              }`}
            >
              <span className="text-lg">{item.emoji}</span>
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
