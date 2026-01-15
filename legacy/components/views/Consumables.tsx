import React, { useEffect } from 'react';
import { AppView, ButtonConfig, ButtonId, ConsumableItem, OperationMode } from '../../types';
import { AlertTriangle, Droplets, ArrowLeft } from 'lucide-react';

interface ConsumablesProps {
  setButtonConfig: (config: ButtonConfig) => void;
  onNavigate: (view: AppView) => void;
  data: ConsumableItem[];
  mode: OperationMode;
}

export const Consumables: React.FC<ConsumablesProps> = ({ setButtonConfig, onNavigate, data, mode }) => {
  const isTouch = mode === 'touch';

  useEffect(() => {
    setButtonConfig({
      [ButtonId.L4]: { 
        label: '返回', 
        color: 'danger', 
        action: () => onNavigate(AppView.MENU) 
      },
    });
  }, [onNavigate, setButtonConfig]);

  const getStatusColor = (current: number, max: number, warning: number) => {
    const percentage = (current / max) * 100;
    if (current <= warning) return 'bg-red-500 shadow-red-200';
    if (percentage < 40) return 'bg-yellow-400';
    return 'bg-emerald-500';
  };

  const getTextColor = (current: number, warning: number) => {
    if (current <= warning) return 'text-red-600 font-bold';
    return 'text-slate-500';
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-8 pb-4 border-b-2 border-slate-200">
        <div className="flex items-center gap-4">
          <Droplets className="text-cyan-600 w-8 h-8" />
          <h2 className="text-2xl font-bold text-slate-800">消耗品余量监控</h2>
        </div>
        
        {/* On-screen Back Button for Touch Mode */}
        {isTouch && (
          <button 
            onClick={() => onNavigate(AppView.MENU)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg font-bold transition-colors"
          >
            <ArrowLeft size={20} />
            返回菜单
          </button>
        )}
      </div>

      <div className={`grid gap-6 overflow-y-auto pr-2 pb-4 ${isTouch ? 'grid-cols-3' : 'grid-cols-2'}`}>
        {data.map((item) => {
          const percentage = Math.min(100, Math.max(0, (item.remaining / item.max) * 100));
          const isWarning = item.remaining <= item.warningLevel;

          return (
            <div 
              key={item.id} 
              className={`
                bg-white p-6 rounded-xl border-2 relative overflow-hidden group shadow-sm transition-all
                ${isWarning ? 'border-red-200 bg-red-50' : 'border-slate-200'}
              `}
            >
              {/* Warning Flash */}
              {isWarning && (
                <div className="absolute top-2 right-2 animate-pulse text-red-500">
                  <AlertTriangle size={24} />
                </div>
              )}

              <div className="flex justify-between items-end mb-4">
                <span className="text-lg font-bold text-slate-700">{item.name}</span>
                <div className="text-right">
                  <span className={`text-3xl font-mono font-bold ${isWarning ? 'text-red-600' : 'text-cyan-600'}`}>
                    {item.remaining}
                  </span>
                  <span className="text-sm text-slate-500 ml-1">{item.unit}</span>
                </div>
              </div>

              {/* Progress Bar Container */}
              <div className="h-5 w-full bg-slate-100 rounded-full overflow-hidden relative border border-slate-200">
                 {/* Grid lines for industrial look */}
                 <div className="absolute inset-0 flex justify-between px-2 z-10 opacity-20">
                    {[...Array(9)].map((_, i) => <div key={i} className="w-[1px] h-full bg-slate-900"></div>)}
                 </div>
                 
                 {/* Fill */}
                <div 
                  className={`h-full transition-all duration-1000 ease-out ${getStatusColor(item.remaining, item.max, item.warningLevel)}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
              
              <div className="flex justify-between mt-2 text-xs font-mono text-slate-400">
                <span>0 {item.unit}</span>
                <span className={getTextColor(item.remaining, item.warningLevel)}>
                   {isWarning ? '警告: 余量不足' : '正常'}
                </span>
                <span>{item.max} {item.unit}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};