import { Plus, Mic, Upload } from 'lucide-react';

interface QuickActionsProps {
  onAddTransaction: () => void;
  onVoiceRecord: () => void;
  onSmartImport: () => void;
}

export default function QuickActions({ onAddTransaction, onVoiceRecord, onSmartImport }: QuickActionsProps) {
  const actions = [
    { 
      icon: <Plus className="w-6 h-6" />, 
      label: '快速记账', 
      onClick: onAddTransaction,
      color: 'from-cute-pink to-cute-orange' 
    },
    { 
      icon: <Mic className="w-6 h-6" />, 
      label: '语音录入', 
      onClick: onVoiceRecord,
      color: 'from-cute-green to-emerald-400' 
    },
    { 
      icon: <Upload className="w-6 h-6" />, 
      label: '智能导入', 
      onClick: onSmartImport,
      color: 'from-cute-purple to-violet-400' 
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-4 w-full">
      {actions.map((action) => (
        <button
          key={action.label}
          onClick={action.onClick}
          className={`cute-icon-btn bg-gradient-to-br ${action.color} text-white shadow-lg hover:shadow-xl flex flex-col items-center gap-1 h-auto py-5 transition-transform active:scale-95`}
        >
          {action.icon}
          <span className="text-xs">{action.label}</span>
        </button>
      ))}
    </div>
  );
}
