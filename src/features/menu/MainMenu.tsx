import React, { useEffect } from 'react';
import { AppView, ButtonConfig, ButtonId } from '../../types';
import { Database, Settings } from 'lucide-react';

interface MainMenuProps {
  setButtonConfig: (config: ButtonConfig) => void;
  onNavigate: (view: AppView) => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({ setButtonConfig, onNavigate }) => {
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const options = [
    {
      view: AppView.CONSUMABLES,
      label: '消耗品余量',
      desc: '查看系统当前剩余物资信息',
      icon: <Database className="w-10 h-10 mb-3" />
    },
    {
      view: AppView.REFUELING,
      label: '燃油控制',
      desc: '设定目标油量与作业参数',
      icon: <Settings className="w-10 h-10 mb-3" />
    }
  ];

  useEffect(() => {
    const currentOption = options[selectedIndex];
    setButtonConfig({
      [ButtonId.L1]: { label: '↑', action: () => setSelectedIndex(prev => Math.max(0, prev - 1)) },
      [ButtonId.L2]: { label: '↓', action: () => setSelectedIndex(prev => Math.min(options.length - 1, prev + 1)) },
      [ButtonId.R1]: {
        label: '确定',
        color: 'success',
        action: () => {
          if (currentOption) {
            onNavigate(currentOption.view);
          }
        }
      }
    });
  }, [selectedIndex, onNavigate, setButtonConfig, options]);

  return (
    <div className="h-full flex items-center justify-center">
      <div className="flex gap-6 w-full justify-center">
        {options.map((opt, idx) => (
          <div
            key={idx}
            className={`
              w-64 h-72 rounded-lg border-2 flex flex-col items-center justify-center p-6 text-center transition-all duration-300 shadow-lg
              ${selectedIndex === idx
                ? 'bg-cyan-900/50 border-cyan-500 shadow-cyan-500/20 scale-105'
                : 'bg-slate-800/50 border-slate-600'}
              ${selectedIndex !== idx ? 'opacity-70' : ''}
            `}
          >
            <div className={`${selectedIndex === idx ? 'text-cyan-400' : 'text-slate-500'}`}>
              {opt.icon}
            </div>
            <h2 className={`text-xl font-bold mb-2 ${selectedIndex === idx ? 'text-white' : 'text-slate-400'}`}>
              {opt.label}
            </h2>
            <p className="text-slate-500 text-xs leading-relaxed">
              {opt.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};