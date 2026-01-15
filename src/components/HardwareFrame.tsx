import React from 'react';
import { ButtonId, ButtonConfig } from '../types';

interface HardwareFrameProps {
  children: React.ReactNode;
  buttonConfig: ButtonConfig;
}

// Pure visual button block on the edge (no text)
const EdgeButton: React.FC<{
  config?: { label?: string; action?: () => void; disabled?: boolean; color?: string };
}> = ({ config }) => {
  const handleClick = () => {
    if (config?.action && !config.disabled) {
      config.action();
    }
  };

  const isActive = !!config?.label;

  return (
    <button
      onClick={handleClick}
      disabled={!config?.label || config.disabled}
      className={`
        w-8 h-8 rounded-sm border-2 transition-all shadow-sm flex-shrink-0
        ${isActive
          ? 'bg-slate-400 border-slate-500 hover:bg-slate-500 cursor-pointer active:scale-95'
          : 'bg-slate-300 border-slate-400 opacity-60 cursor-default'}
      `}
    />
  );
};

// Label displayed inside the content area
const InnerLabel: React.FC<{
  label?: string;
  color?: string;
  isActive?: boolean;
}> = ({ label, color, isActive }) => {
  const getColorClass = () => {
    if (isActive) return 'text-yellow-300';
    switch (color) {
      case 'primary': return 'text-cyan-400';
      case 'danger': return 'text-red-400';
      case 'success': return 'text-emerald-400';
      default: return 'text-cyan-300';
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center">
      {label && (
        <span className={`font-mono text-xs font-bold ${getColorClass()} whitespace-nowrap`}>
          {isActive ? `[${label}]` : label}
        </span>
      )}
    </div>
  );
};

export const HardwareFrame: React.FC<HardwareFrameProps> = ({ children, buttonConfig }) => {
  const topButtons = [ButtonId.T1, ButtonId.T2, ButtonId.T3, ButtonId.T4, ButtonId.T5, ButtonId.T6];
  const bottomButtons = [ButtonId.B1, ButtonId.B2, ButtonId.B3, ButtonId.B4, ButtonId.B5, ButtonId.B6];
  const leftButtons = [ButtonId.L1, ButtonId.L2, ButtonId.L3, ButtonId.L4];
  const rightButtons = [ButtonId.R1, ButtonId.R2, ButtonId.R3, ButtonId.R4];

  return (
    <div className="w-full h-screen bg-slate-300 flex items-center justify-center p-2">
      {/* Main Container */}
      <div className="relative w-full max-w-7xl h-full max-h-[900px] flex flex-col">

        {/* Top Buttons Row - evenly distributed */}
        <div className="flex w-full px-10 py-1">
          {topButtons.map(id => (
            <div key={id} className="flex-1 flex justify-center">
              <EdgeButton config={buttonConfig[id]} />
            </div>
          ))}
        </div>

        {/* Middle Section: Left Buttons + Screen + Right Buttons */}
        <div className="flex-1 flex overflow-hidden">

          {/* Left Buttons Column - evenly distributed */}
          <div className="flex flex-col py-10 px-1">
            {leftButtons.map(id => (
              <div key={id} className="flex-1 flex items-center justify-center">
                <EdgeButton config={buttonConfig[id]} />
              </div>
            ))}
          </div>

          {/* Main Screen Area */}
          <div className="flex-1 bg-slate-900 rounded-md border-4 border-slate-600 shadow-2xl overflow-hidden flex flex-col mx-1">

            {/* Top Labels Row (inside screen) - evenly distributed */}
            <div className="flex w-full h-8 border-b border-slate-700/50">
              {topButtons.map(id => (
                <InnerLabel key={id} label={buttonConfig[id]?.label} color={buttonConfig[id]?.color} isActive={buttonConfig[id]?.isActive} />
              ))}
            </div>

            {/* Content Area with Side Labels */}
            <div className="flex-1 flex overflow-hidden">

              {/* Left Labels Column (inside screen) - evenly distributed */}
              <div className="flex flex-col w-16 border-r border-slate-700/50">
                {leftButtons.map(id => (
                  <InnerLabel key={id} label={buttonConfig[id]?.label} color={buttonConfig[id]?.color} isActive={buttonConfig[id]?.isActive} />
                ))}
              </div>

              {/* Main Content */}
              <div className="flex-1 p-4 overflow-auto">
                {children}
              </div>

              {/* Right Labels Column (inside screen) - evenly distributed */}
              <div className="flex flex-col w-16 border-l border-slate-700/50">
                {rightButtons.map(id => (
                  <InnerLabel key={id} label={buttonConfig[id]?.label} color={buttonConfig[id]?.color} isActive={buttonConfig[id]?.isActive} />
                ))}
              </div>
            </div>

            {/* Bottom Labels Row (inside screen) - evenly distributed */}
            <div className="flex w-full h-8 border-t border-slate-700/50">
              {bottomButtons.map(id => (
                <InnerLabel key={id} label={buttonConfig[id]?.label} color={buttonConfig[id]?.color} isActive={buttonConfig[id]?.isActive} />
              ))}
            </div>
          </div>

          {/* Right Buttons Column - evenly distributed */}
          <div className="flex flex-col py-10 px-1">
            {rightButtons.map(id => (
              <div key={id} className="flex-1 flex items-center justify-center">
                <EdgeButton config={buttonConfig[id]} />
              </div>
            ))}
          </div>

        </div>

        {/* Bottom Buttons Row - evenly distributed */}
        <div className="flex w-full px-10 py-1">
          {bottomButtons.map(id => (
            <div key={id} className="flex-1 flex justify-center">
              <EdgeButton config={buttonConfig[id]} />
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
