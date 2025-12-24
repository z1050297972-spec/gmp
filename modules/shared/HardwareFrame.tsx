import React from 'react';
import { ButtonId, ButtonConfig, OperationMode } from '../../types';
import { MousePointer2, Gamepad2 } from 'lucide-react';

interface HardwareFrameProps {
  children: React.ReactNode;
  buttonConfig: ButtonConfig;
  title?: string;
  mode: OperationMode;
  setMode: (mode: OperationMode) => void;
}

const HardwareButton: React.FC<{
  id: ButtonId;
  config?: { label?: string; action?: () => void; disabled?: boolean; color?: string };
  side: 'left' | 'right';
}> = ({ id, config, side }) => {
  const handleClick = () => {
    if (config?.action && !config.disabled) {
      config.action();
    }
  };

  const getButtonColor = () => {
    if (!config?.label) return 'bg-slate-200 border-slate-300 text-slate-400'; // Inactive
    switch (config.color) {
      case 'primary': return 'bg-cyan-100 border-cyan-500 text-cyan-700 hover:bg-cyan-200';
      case 'danger': return 'bg-red-100 border-red-500 text-red-700 hover:bg-red-200';
      case 'success': return 'bg-emerald-100 border-emerald-500 text-emerald-700 hover:bg-emerald-200';
      default: return 'bg-white border-slate-400 text-slate-700 hover:bg-slate-50';
    }
  };

  return (
    <div className={`flex items-center gap-2 my-2 ${side === 'right' ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Physical Button Simulation */}
      <button
        onClick={handleClick}
        disabled={!config?.label || config.disabled}
        className={`
          w-16 h-14 rounded-md border-b-4 active:border-b-0 active:translate-y-1 transition-all
          flex items-center justify-center font-bold text-xs shadow-md
          ${getButtonColor()}
          ${!config?.label ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
      >
        {id}
      </button>

      {/* Screen Label Indicator */}
      <div className={`
        flex-1 h-12 flex items-center px-3
        ${side === 'left' ? 'justify-start border-l-4' : 'justify-end border-r-4'}
        ${config?.label ? 'border-cyan-500 bg-cyan-50' : 'border-transparent'}
        transition-all duration-300
      `}>
        {config?.label && (
          <span className="text-cyan-700 font-mono text-sm tracking-wider font-bold uppercase truncate">
            {config.label}
          </span>
        )}
      </div>
    </div>
  );
};

export const HardwareFrame: React.FC<HardwareFrameProps> = ({ children, buttonConfig, title, mode, setMode }) => {
  const isTouch = mode === 'touch';

  return (
    <div className="w-full h-screen bg-slate-200 flex flex-col items-center justify-center p-4">
      {/* Tablet Device Frame */}
      <div className={`relative w-full max-w-7xl h-full max-h-[800px] bg-slate-100 rounded-3xl border-8 border-slate-300 shadow-2xl flex flex-col overflow-hidden ring-1 ring-white transition-all duration-500`}>
        
        {/* Status Bar */}
        <div className="bg-white h-12 flex items-center justify-between px-6 border-b border-slate-200 text-xs text-slate-500 select-none shadow-sm z-20">
          <div className="flex items-center gap-4">
            <span className="font-bold text-slate-700 text-lg">GMP系统</span>
            <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              <div className="w-2 h-2 rounded-full bg-current animate-pulse" />
              在线
            </div>
          </div>
          
          <div className="font-mono flex items-center gap-6 font-bold text-slate-700">
             <span>{title || '系统就绪'}</span>
             
             {/* Mode Switcher */}
             <button 
               onClick={() => setMode(isTouch ? 'button' : 'touch')}
               className={`
                 flex items-center gap-2 px-3 py-1 rounded-lg border-2 transition-all
                 ${isTouch ? 'bg-indigo-50 border-indigo-500 text-indigo-700' : 'bg-slate-100 border-slate-300 text-slate-600 hover:bg-slate-200'}
               `}
             >
               {isTouch ? <MousePointer2 size={16} /> : <Gamepad2 size={16} />}
               <span>{isTouch ? '触控模式' : '按键模式'}</span>
             </button>

             <span>12:45 PM</span>
          </div>
        </div>

        {/* Main Interface Area */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* Left Buttons Area - Hidden in Touch Mode */}
          <div className={`
             bg-slate-100 flex flex-col justify-center px-2 py-8 border-r border-slate-200 shadow-[inset_-4px_0_10px_rgba(0,0,0,0.02)] z-10
             transition-all duration-500 ease-in-out overflow-hidden
             ${isTouch ? 'w-0 opacity-0 px-0 border-none' : 'w-48 opacity-100'}
          `}>
            <div className="w-44"> {/* Fixed width container to prevent squishing during transition */}
              <HardwareButton id={ButtonId.L1} config={buttonConfig.L1} side="left" />
              <HardwareButton id={ButtonId.L2} config={buttonConfig.L2} side="left" />
              <HardwareButton id={ButtonId.L3} config={buttonConfig.L3} side="left" />
              <HardwareButton id={ButtonId.L4} config={buttonConfig.L4} side="left" />
            </div>
          </div>

          {/* Screen Content */}
          <div className="flex-1 bg-slate-50 relative overflow-hidden flex flex-col transition-all duration-500">
             {/* Content */}
             <div className="flex-1 relative z-0 p-6 overflow-auto">
               {children}
             </div>
          </div>

          {/* Right Buttons Area - Hidden in Touch Mode */}
          <div className={`
             bg-slate-100 flex flex-col justify-center px-2 py-8 border-l border-slate-200 shadow-[inset_4px_0_10px_rgba(0,0,0,0.02)] z-10
             transition-all duration-500 ease-in-out overflow-hidden
             ${isTouch ? 'w-0 opacity-0 px-0 border-none' : 'w-48 opacity-100'}
          `}>
            <div className="w-44">
              <HardwareButton id={ButtonId.R1} config={buttonConfig.R1} side="right" />
              <HardwareButton id={ButtonId.R2} config={buttonConfig.R2} side="right" />
              <HardwareButton id={ButtonId.R3} config={buttonConfig.R3} side="right" />
              <HardwareButton id={ButtonId.R4} config={buttonConfig.R4} side="right" />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};