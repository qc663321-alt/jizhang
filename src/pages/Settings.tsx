import { Settings as SettingsIcon, Moon, Palette, Bell, Shield, HelpCircle, Info } from 'lucide-react';
import CuteCard from '@/components/common/CuteCard';
import useAppStore from '@/stores/useAppStore';

export default function Settings() {
  const settings = useAppStore((state) => state.settings);
  const updateSettings = useAppStore((state) => state.updateSettings);
  const transactions = useAppStore((state) => state.transactions);

  const toggleTheme = () => {
    const themes: ('light' | 'dark' | 'cute')[] = ['light', 'dark', 'cute'];
    const currentIndex = themes.indexOf(settings.theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    updateSettings({ theme: themes[nextIndex] });
  };

  const toggleAutoCategorize = () => {
    updateSettings({ autoCategorize: !settings.autoCategorize });
  };

  const toggleAIEnabled = () => {
    updateSettings({ aiEnabled: !settings.aiEnabled });
  };

  const toggleVoiceEnabled = () => {
    updateSettings({ voiceEnabled: !settings.voiceEnabled });
  };

  const themeNames = {
    light: '☀️ 浅色模式',
    dark: '🌙 深色模式',
    cute: '💖 可爱模式',
  };

  const menuItems = [
    { 
      icon: <Palette className="w-5 h-5" />, 
      label: '主题模式', 
      value: themeNames[settings.theme],
      onClick: toggleTheme,
      hasToggle: false,
    },
    { 
      icon: <Bell className="w-5 h-5" />, 
      label: '自动分类', 
      value: settings.autoCategorize ? '开启' : '关闭',
      onClick: toggleAutoCategorize,
      hasToggle: true,
      toggleValue: settings.autoCategorize,
    },
    { 
      icon: <SettingsIcon className="w-5 h-5" />, 
      label: 'AI分析', 
      value: settings.aiEnabled ? '开启' : '关闭',
      onClick: toggleAIEnabled,
      hasToggle: true,
      toggleValue: settings.aiEnabled,
    },
    { 
      icon: <Moon className="w-5 h-5" />, 
      label: '语音录入', 
      value: settings.voiceEnabled ? '开启' : '关闭',
      onClick: toggleVoiceEnabled,
      hasToggle: true,
      toggleValue: settings.voiceEnabled,
    },
    { 
      icon: <Shield className="w-5 h-5" />, 
      label: '隐私设置', 
      value: '',
      onClick: () => alert('隐私设置'),
      hasToggle: false,
    },
    { 
      icon: <HelpCircle className="w-5 h-5" />, 
      label: '帮助中心', 
      value: '',
      onClick: () => alert('帮助中心'),
      hasToggle: false,
    },
    { 
      icon: <Info className="w-5 h-5" />, 
      label: '关于我们', 
      value: 'v1.0.0',
      onClick: () => alert('关于我们'),
      hasToggle: false,
    },
  ];

  return (
    <div className="min-h-screen pb-20">
      <header className="bg-gradient-to-r from-cute-purple to-cute-green text-white px-6 py-8 rounded-b-cute-xl shadow-cute-lg">
        <h1 className="text-2xl font-bold">⚙️ 设置</h1>
        <p className="text-white/80 text-sm mt-1">管理你的应用设置</p>
      </header>

      <main className="px-4 py-6 space-y-6">
        <CuteCard>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-cute-pink to-cute-orange rounded-cute-full flex items-center justify-center text-3xl">
              👤
            </div>
            <div>
              <h3 className="font-bold text-gray-800">可爱账本用户</h3>
              <p className="text-sm text-gray-500">{transactions.length} 条记录</p>
            </div>
          </div>
        </CuteCard>

        <CuteCard>
          <h3 className="font-bold text-gray-800 mb-4">🔧 通用设置</h3>
          <div className="space-y-4">
            {menuItems.map((item, idx) => (
              <button
                key={idx}
                onClick={item.onClick}
                className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-cute transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-cute-pink">{item.icon}</span>
                  <span className="text-gray-700">{item.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  {item.value && <span className="text-sm text-gray-500">{item.value}</span>}
                  {item.hasToggle && (
                    <div className={`w-10 h-6 rounded-full transition-colors ${
                      item.toggleValue ? 'bg-cute-pink' : 'bg-gray-300'
                    }`}>
                      <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                        item.toggleValue ? 'translate-x-4' : 'translate-x-0.5'
                      }`}></div>
                    </div>
                  )}
                  {!item.hasToggle && !item.value && (
                    <span className="text-gray-400">›</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </CuteCard>

        <CuteCard className="text-center">
          <p className="text-gray-500 text-sm">
            Made with 💖 by Cute Budget Team
          </p>
          <p className="text-gray-400 text-xs mt-1">Version 1.0.0</p>
        </CuteCard>
      </main>
    </div>
  );
}
