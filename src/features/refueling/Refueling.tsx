import React, { useState, useEffect } from 'react';
import { AppView, ButtonConfig, ButtonId } from '../../types';
import { FuelTankSystem } from '../../components/FuelTankSystem';
import { InfoPanel } from '../../components/InfoPanel';

interface RefuelingProps {
  setButtonConfig: (config: ButtonConfig) => void;
  onNavigate: (view: AppView) => void;
}

// 子页面类型
type SubPage = 'ground_refuel' | 'ground_drain' | 'pump_check' | 'valve_check';

// 获取油品名称
const getFuelTypeName = (type: 'rp3' | 'rp5') => {
  return type === 'rp3' ? 'Rp-3' : 'Rp-5';
};

// 获取加油方案名称
const getPlanName = (plan: 'basic' | 'mid1' | 'mid2' | 'full') => {
  switch (plan) {
    case 'basic': return '基本加';
    case 'mid1': return '中间1';
    case 'mid2': return '中间2';
    case 'full': return '满加';
  }
};

// 地面加油页面内容
const GroundRefuelContent: React.FC<{
  fuelType: 'rp3' | 'rp5';
  plan: 'basic' | 'mid1' | 'mid2' | 'full';
  isRefueling?: boolean;
}> = ({ fuelType, plan, isRefueling = false }) => {
  const fuelTypeName = getFuelTypeName(fuelType);
  const planName = getPlanName(plan);

  return (
    <div className="h-full flex flex-col">
      {/* 标题 */}
      <div className="text-center py-2">
        <h1 className="text-cyan-400 font-bold text-base">
          正在使用<span className="text-yellow-300">{fuelTypeName}</span>，执行<span className="text-yellow-300">{planName}</span>加油作业
          {isRefueling && <span className="text-emerald-400 ml-2 animate-pulse">（正在加油...）</span>}
        </h1>
      </div>

      {/* 主内容区 */}
      <div className="flex-1 flex">
        {/* 左侧 - 油箱超压提示 */}
        <div className="w-24 flex flex-col justify-start pt-8">
          <span className={`font-bold text-sm ${isRefueling ? 'text-red-500 animate-pulse' : 'text-cyan-300'}`}>
            {isRefueling ? '监控中' : '油箱超压'}
          </span>
        </div>

        {/* 中央 - 油箱示意图 */}
        <div className="flex-1 flex items-center justify-center">
          <FuelTankSystem color={isRefueling ? 'purple' : 'cyan'} />
        </div>

        {/* 右侧 - 数据面板 */}
        <div className="w-40 pt-8">
          <InfoPanel items={[
            { label: '全机油量', value: '16000', unit: 'kg' },
            {
              label: '密度',
              value: isRefueling ? '780' : '0.000',
              unit: isRefueling ? 'kg/m³' : 'kg/m',
              highlight: isRefueling
            },
            { label: '牌号', value: fuelTypeName, highlight: true },
            { label: '加油方案', value: planName, highlight: true },
          ]} />
        </div>
      </div>

      {/* 底部状态栏 */}
      <div className="h-10 flex items-center justify-center gap-8 border-t border-slate-700/50 bg-slate-800/30">
        <div className="flex items-center gap-2">
          <span className="text-cyan-300 font-mono text-xs">油箱压力:</span>
          <span className={`font-mono text-xs font-bold ${isRefueling ? 'text-emerald-400 text-lg' : 'text-yellow-300'}`}>
            {isRefueling ? '35.5' : '00.0'}
          </span>
          <span className="text-cyan-400 font-mono text-xs">kPa</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-cyan-300 font-mono text-xs">加油通气阀状态:</span>
          <span className={`font-mono text-xs font-bold ${isRefueling ? 'text-emerald-400 border border-emerald-400 px-1' : 'text-emerald-400'}`}>
            已打开
          </span>
        </div>
      </div>
    </div>
  );
};



// 地面放油页面内容
const GroundDrainContent: React.FC<{
  fuelType: 'rp3' | 'rp5';
  plan: 'basic' | 'mid1' | 'mid2' | 'full';
  isDraining?: boolean;
}> = ({ fuelType, plan, isDraining = false }) => {
  const fuelTypeName = getFuelTypeName(fuelType);
  const planName = getPlanName(plan);

  return (
    <div className="h-full flex flex-col">
      {/* 标题 */}
      <div className="text-center py-2 relative">
        <h1 className="text-cyan-400 font-bold text-base">
          正在使用<span className="text-yellow-300">{fuelTypeName}</span>，执行<span className="text-yellow-300">地面放油</span>作业
          {isDraining && <span className="text-emerald-400 ml-2 animate-pulse">（正在放油...）</span>}
        </h1>
      </div>

      {/* 主内容区 */}
      <div className="flex-1 flex">
        {/* 左侧 - 状态提示 */}
        <div className="w-24 flex flex-col justify-start pt-8 pl-4">
          <span className={`font-bold text-sm ${isDraining ? 'text-red-500 animate-pulse' : 'text-cyan-300'}`}>
            {isDraining ? '监控中' : '油箱超压'}
          </span>
        </div>

        {/* 中央 - 油箱示意图 */}
        <div className="flex-1 flex flex-col items-center justify-center relative">
          <FuelTankSystem color={isDraining ? 'purple' : 'cyan'} />
        </div>

        {/* 右侧 - 数据面板 */}
        <div className="w-48 pt-8 pr-2">
          <InfoPanel items={[
            ...[
              { label: '全机油量', value: '16000', unit: 'kg' },
              { label: '密度', value: isDraining ? '779' : '0.000', unit: isDraining ? 'kg/m³' : 'kg/m', highlight: isDraining },
              { label: '牌号', value: fuelTypeName, highlight: true },
              !isDraining ? { label: '加油方案', value: planName, highlight: true } : null,
            ].filter((item): item is NonNullable<typeof item> => item !== null)
          ]} />

        </div>
      </div>

      {/* 底部状态栏 */}
      <div className="h-16 flex items-center justify-center bg-slate-800/80 border-t border-slate-700 mx-4 mb-2 rounded shadow-inner">
        <div className="grid grid-cols-2 gap-x-12 gap-y-1">
          {/* 左列 */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="text-green-500 font-mono text-xs">左发入口油温:</span>
              <span className={`font-mono text-xs font-bold ${isDraining ? 'border border-cyan-400 px-2 text-cyan-400' : 'text-green-500'}`}>30</span>
              <span className="text-green-500 font-mono text-xs">℃</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-500 font-mono text-xs">左发入口油压:</span>
              <span className={`font-mono text-xs font-bold ${isDraining ? 'border border-cyan-400 px-2 text-cyan-400' : 'text-green-500'}`}>1200</span>
              <span className="text-green-500 font-mono text-xs">kPa</span>
            </div>
          </div>

          {/* 右列 */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="text-green-500 font-mono text-xs">右发入口油温:</span>
              <span className={`font-mono text-xs font-bold ${isDraining ? 'border border-cyan-400 px-2 text-cyan-400' : 'text-green-500'}`}>30</span>
              <span className="text-green-500 font-mono text-xs">℃</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-500 font-mono text-xs">右发入口油压:</span>
              <span className={`font-mono text-xs font-bold ${isDraining ? 'border border-cyan-400 px-2 text-cyan-400' : 'text-green-500'}`}>1200</span>
              <span className="text-green-500 font-mono text-xs">kPa</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const Refueling: React.FC<RefuelingProps> = ({ setButtonConfig, onNavigate }) => {
  const [currentSubPage, setCurrentSubPage] = useState<SubPage>('ground_refuel');
  const [selectedFuelType, setSelectedFuelType] = useState<'rp3' | 'rp5'>('rp3');
  const [selectedPlan, setSelectedPlan] = useState<'basic' | 'mid1' | 'mid2' | 'full'>('basic');
  const [isDrainActive, setIsDrainActive] = useState(false);
  const [isRefuelActive, setIsRefuelActive] = useState(false);
  const [showDiffGauge, setShowDiffGauge] = useState(false);

  useEffect(() => {
    const baseConfig: ButtonConfig = {
      // 上方按钮 T1-T4
      [ButtonId.T1]: {
        label: '地面加油',
        isActive: currentSubPage === 'ground_refuel',
        action: () => setCurrentSubPage('ground_refuel')
      },
      [ButtonId.T2]: {
        label: '地面放油',
        isActive: currentSubPage === 'ground_drain',
        action: () => setCurrentSubPage('ground_drain')
      },
      [ButtonId.T3]: {
        label: '泵检',
        isActive: currentSubPage === 'pump_check',
        action: () => setCurrentSubPage('pump_check')
      },
      [ButtonId.T4]: {
        label: '阀检',
        isActive: currentSubPage === 'valve_check',
        action: () => setCurrentSubPage('valve_check')
      },
      // 下方按钮 B5-B6
      [ButtonId.B5]: {
        label: '< 返回',
        color: 'danger',
        action: () => onNavigate(AppView.MENU)
      },
      [ButtonId.B6]: {
        label: '<< 主界面',
        action: () => onNavigate(AppView.MENU)
      },
    };

    const refuelConfig: ButtonConfig = {
      // 左侧按钮 L1-L4
      [ButtonId.L1]: {
        label: 'Rp-3',
        isActive: selectedFuelType === 'rp3',
        action: () => setSelectedFuelType('rp3')
      },
      [ButtonId.L2]: {
        label: 'Rp-5',
        isActive: selectedFuelType === 'rp5',
        action: () => setSelectedFuelType('rp5')
      },
      [ButtonId.L3]: {
        label: '开始加油',
        color: 'success',
        isActive: isRefuelActive,
        action: () => setIsRefuelActive(true)
      },
      [ButtonId.L4]: {
        label: '停止加油',
        color: 'danger',
        action: () => setIsRefuelActive(false)
      },
      // 右侧按钮 R3-R4
      [ButtonId.R3]: { label: '预检开始', color: 'success' },
      [ButtonId.R4]: { label: '预检停止', color: 'danger' },
      // 下方按钮 B1-B6
      ...(!isRefuelActive ? {
        [ButtonId.B1]: {
          label: '基本加',
          isActive: selectedPlan === 'basic',
          action: () => setSelectedPlan('basic')
        },
        [ButtonId.B2]: {
          label: '中间1',
          isActive: selectedPlan === 'mid1',
          action: () => setSelectedPlan('mid1')
        },
        [ButtonId.B3]: {
          label: '中间2',
          isActive: selectedPlan === 'mid2',
          action: () => setSelectedPlan('mid2')
        },
        [ButtonId.B4]: {
          label: '满加',
          isActive: selectedPlan === 'full',
          action: () => setSelectedPlan('full')
        },
      } : {}),
      // 加油状态下显示顶部额外按钮
      ...(isRefuelActive ? {
        [ButtonId.T5]: { label: '油量测量' },
        [ButtonId.T6]: { label: '状态参数' }
      } : {})
    };

    const drainConfig: ButtonConfig = {
      [ButtonId.L1]: {
        label: '压差详情',
        isActive: showDiffGauge,
        color: 'primary',
        action: () => setShowDiffGauge(prev => !prev)
      },
      [ButtonId.L3]: {
        label: '开始放油',
        color: 'success',
        isActive: isDrainActive,
        action: () => setIsDrainActive(true)
      },
      [ButtonId.R3]: {
        label: '停止放油',
        color: 'danger',
        action: () => setIsDrainActive(false)
      },
      // 放油状态下显示顶部额外按钮
      ...(isDrainActive ? {
        [ButtonId.T5]: { label: '油量测量' },
        [ButtonId.T6]: { label: '状态参数' }
      } : {})
    };

    const config = {
      ...baseConfig,
      ...(currentSubPage === 'ground_drain' ? drainConfig : refuelConfig)
    };

    setButtonConfig(config);
  }, [
    currentSubPage,
    selectedFuelType,
    selectedPlan,
    isDrainActive,
    isRefuelActive,
    showDiffGauge,
    onNavigate,
    setButtonConfig
  ]);

  // 渲染当前子页面内容
  const renderContent = () => {
    switch (currentSubPage) {
      case 'ground_refuel':
        return <GroundRefuelContent fuelType={selectedFuelType} plan={selectedPlan} isRefueling={isRefuelActive} />;
      case 'ground_drain':
        return <GroundDrainContent fuelType={selectedFuelType} plan={selectedPlan} isDraining={isDrainActive} />;
      case 'pump_check':
        return (
          <div className="h-full flex flex-col">
            <div className="text-center py-2 mb-4">
              <h1 className="text-cyan-400 font-bold text-lg">泵检</h1>
            </div>
            <div className="flex-1 flex items-center justify-center text-slate-500">
              <span className="text-cyan-300/50">泵检内容区域</span>
            </div>
          </div>
        );
      case 'valve_check':
        return (
          <div className="h-full flex flex-col">
            <div className="text-center py-2 mb-4">
              <h1 className="text-cyan-400 font-bold text-lg">阀检</h1>
            </div>
            <div className="flex-1 flex items-center justify-center text-slate-500">
              <span className="text-cyan-300/50">阀检内容区域</span>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-full text-cyan-300">
      {renderContent()}
    </div>
  );
};
