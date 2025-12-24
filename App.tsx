import React, { useState } from 'react';
import { HardwareFrame } from './modules/shared/HardwareFrame';
import { MainMenu } from './modules/menu/MainMenu';
import { Consumables } from './modules/consumables/Consumables';
import { Refueling } from './modules/refueling/Refueling';
import { AppView, ButtonConfig, ConsumableItem, RefuelingChannel, OperationMode } from './types';
import { INITIAL_CHANNELS, INITIAL_CONSUMABLES } from './constants';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.MENU);
  const [buttonConfig, setButtonConfig] = useState<ButtonConfig>({});
  const [mode, setMode] = useState<OperationMode>('button');
  
  // App Data State
  const [consumables] = useState<ConsumableItem[]>(INITIAL_CONSUMABLES);
  const [channels, setChannels] = useState<RefuelingChannel[]>(INITIAL_CHANNELS);

  // Render the appropriate view based on state
  const renderView = () => {
    switch (currentView) {
      case AppView.MENU:
        return (
          <MainMenu 
            setButtonConfig={setButtonConfig} 
            onNavigate={setCurrentView} 
            mode={mode}
          />
        );
      case AppView.CONSUMABLES:
        return (
          <Consumables 
            setButtonConfig={setButtonConfig} 
            onNavigate={setCurrentView}
            data={consumables}
            mode={mode}
          />
        );
      case AppView.REFUELING:
        return (
          <Refueling 
            setButtonConfig={setButtonConfig} 
            onNavigate={setCurrentView}
            channels={channels}
            setChannels={setChannels}
            mode={mode}
          />
        );
      default:
        return <div className="text-red-500">Error: Unknown View</div>;
    }
  };

  const getPageTitle = () => {
    switch(currentView) {
      case AppView.MENU: return '主菜单';
      case AppView.CONSUMABLES: return '消耗品监控';
      case AppView.REFUELING: return '方案设置';
      default: return '系统';
    }
  };

  return (
    <HardwareFrame 
      buttonConfig={buttonConfig} 
      title={getPageTitle()}
      mode={mode}
      setMode={setMode}
    >
      {renderView()}
    </HardwareFrame>
  );
};

export default App;