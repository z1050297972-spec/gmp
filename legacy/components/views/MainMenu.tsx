import React, { useEffect } from 'react';
import { AppView, ButtonConfig, ButtonId, OperationMode } from '../../types';
import { Database, Settings, ArrowRight, Hand } from 'lucide-react';

interface MainMenuProps {
  setButtonConfig: (config: ButtonConfig) => void;
  onNavigate: (view: AppView) => void;
  mode: OperationMode;
}

export const MainMenu: React.FC<MainMenuProps> = ({ setButtonConfig, onNavigate, mode }) => {
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const isTouch = mode === 'touch';
  
  const options = [
    { 
      view: AppView.CONSUMABLES, 
      label: '消耗品余量', 
      desc: '查看系统当前剩余物资信息',
      icon: <Database className="w-12 h-12 mb-4" /> 
    },
    { 
      view: AppView.REFUELING, 
      label: '加油方案设置', 
      desc: '配置各通道液压及加油时长',
      icon: <Settings className="w-12 h-12 mb-4" /> 
    }
  ];

  useEffect(() => {
    setButtonConfig({
      [ButtonId.L1]: { label: '↑ 上选', action: () => setSelectedIndex(prev => Math.max(0, prev - 1)) },
      [ButtonId.L2]: { label: '↓ 下选', action: () => setSelectedIndex(prev => Math.min(options.length - 1, prev + 1)) },
      [ButtonId.R1]: { 
        label: '确定', 
        color: 'success', 
        action: () => onNavigate(options[selectedIndex].view) 
      }
    });
  }, [selectedIndex, onNavigate, setButtonConfig, options]);

  return (
    <div className="h-full flex flex-col items-center justify-center space-y-12">
      <h1 className="text-4xl font-bold text-slate-800 tracking-tight border-b-4 border-cyan-500 pb-4 px-12">
        主功能菜单
      </h1>
      
      <div className="flex gap-8 w-full justify-center">
        {options.map((opt, idx) => (
          <div 
            key={idx}
            onClick={() => isTouch && onNavigate(opt.view)}
            className={`
              w-80 h-96 rounded-xl border-2 flex flex-col items-center justify-center p-8 text-center transition-all duration-300 shadow-lg relative
              ${!isTouch && selectedIndex === idx 
                ? 'bg-cyan-50 border-cyan-500 shadow-cyan-200/50 scale-105' 
                : 'bg-white border-slate-200'}
              ${!isTouch && selectedIndex !== idx ? 'opacity-80' : ''}
              ${isTouch ? 'cursor-pointer hover:border-cyan-400 hover:shadow-xl hover:-translate-y-1 active:scale-95' : ''}
            `}
          >
            <div className={`${(!isTouch && selectedIndex === idx) || isTouch ? 'text-cyan-600' : 'text-slate-400'}`}>
              {opt.icon}
            </div>
            <h2 className={`text-2xl font-bold mb-4 ${(!isTouch && selectedIndex === idx) || isTouch ? 'text-slate-900' : 'text-slate-500'}`}>
              {opt.label}
            </h2>
            <p className="text-slate-500 text-sm leading-relaxed mb-8">
              {opt.desc}
            </p>
            
            {/* Button Mode Indicator */}
            {!isTouch && selectedIndex === idx && (
              <div className="mt-auto flex items-center gap-2 text-cyan-700 text-sm font-mono animate-pulse font-bold">
                <span>按 [R1] 进入</span>
                <ArrowRight size={16} />
              </div>
            )}

            {/* Touch Mode Indicator */}
            {isTouch && (
              <div className="absolute bottom-6 right-6 text-slate-300">
                <Hand size={24} />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="absolute bottom-8 text-slate-400 text-sm font-mono bg-white/50 px-4 py-2 rounded-full border border-slate-200">
        {isTouch ? '点击卡片直接进入功能模块' : '使用左侧按键进行导航，右侧按键确认'}
      </div>
    </div>
  );
};