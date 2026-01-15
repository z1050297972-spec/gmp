import React, { useEffect } from 'react';
import { AppView, ButtonConfig, ButtonId } from '../../types';

interface ConsumablesProps {
  setButtonConfig: (config: ButtonConfig) => void;
  onNavigate: (view: AppView) => void;
}

// 数据项组件：标签 + 值 + 单位
const DataItem: React.FC<{
  label: string;
  value: string | number;
  unit?: string;
  warning?: boolean;
}> = ({ label, value, unit, warning }) => (
  <div className="flex items-center justify-between py-1">
    <span className={`font-mono text-sm ${warning ? 'text-red-400' : 'text-cyan-300'}`}>{label}:</span>
    <div className="flex items-center gap-1">
      <span className={`font-mono text-sm font-bold ${warning ? 'text-red-400' : 'text-yellow-300'}`}>
        {value}
      </span>
      {unit && <span className={`font-mono text-xs ${warning ? 'text-red-400' : 'text-cyan-400'}`}>{unit}</span>}
    </div>
  </div>
);

// 数据区块组件
const DataBlock: React.FC<{
  children: React.ReactNode;
  className?: string;
  bordered?: boolean;
}> = ({ children, className = '', bordered = false }) => (
  <div className={`
    bg-slate-800/50 rounded-md p-3
    ${bordered ? 'border border-cyan-500/50' : ''}
    ${className}
  `}>
    {children}
  </div>
);

export const Consumables: React.FC<ConsumablesProps> = ({ setButtonConfig, onNavigate }) => {
  useEffect(() => {
    setButtonConfig({
      // 上方按钮 T1-T4
      [ButtonId.T1]: { label: '发动机滑油' },
      [ButtonId.T2]: { label: 'APU滑油' },
      [ButtonId.T3]: { label: '液压油加注' },
      [ButtonId.T4]: { label: '蓄压器压力' },
      // 下方按钮
      [ButtonId.B5]: { label: '< 返回', color: 'danger', action: () => onNavigate(AppView.MENU) },
      [ButtonId.B6]: { label: '<< 主界面', action: () => onNavigate(AppView.MENU) },
    });
  }, [onNavigate, setButtonConfig]);

  return (
    <div className="h-full flex flex-col text-cyan-300">
      {/* 标题 */}
      <div className="text-center py-2 mb-4">
        <h1 className="text-cyan-400 font-bold text-lg">当前显示为全机消耗品余量</h1>
      </div>

      {/* 主数据区块 - 带边框的表格式 */}
      <DataBlock bordered className="mb-4">
        <div className="grid grid-cols-2 gap-x-8 gap-y-1">
          {/* 左列 */}
          <div>
            <DataItem label="全机油量" value="00.0" unit="t" />
            <DataItem label="蓄电池容量" value="XXX" unit="M" />
            <DataItem label="战术数据卡可用容量" value="XXX" unit="M" />
            <DataItem label="维护数据卡可用容量" value="XX" unit="M" />
          </div>
          {/* 右列 */}
          <div>
            <DataItem label="备用氧压力" value="00.0" unit="kPa" />
            <DataItem label="补氧子系统压力" value="00.0" unit="kPa" />
            <DataItem label="灭火瓶压力" value="00.0" unit="kPa" />
            <DataItem label="灭火瓶温度" value="00.0" unit="kPa" />
          </div>
        </div>
      </DataBlock>

      {/* 第二行 - 两个小区块 */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <DataBlock>
          <DataItem label="发电机滑油量" value="00.0" unit="t" />
          <DataItem label="发动机滑油量" value="00.0" unit="t" />
        </DataBlock>
        <DataBlock>
          <DataItem label="滑冷液余量" value="00.0" unit="kPa" warning />
          <DataItem label="液压油箱液位" value="00.0" unit="kPa" />
        </DataBlock>
      </div>

      {/* 第三行 - 两个小区块 */}
      <div className="grid grid-cols-2 gap-4">
        <DataBlock>
          <DataItem label="APU滑油量" value="00.0" unit="t" />
        </DataBlock>
        <DataBlock>
          <DataItem label="液压蓄压器液压力" value="00.0" unit="kPa" />
          <DataItem label="应急放氧气瓶压力" value="00.0" unit="kPa" />
        </DataBlock>
      </div>
    </div>
  );
};