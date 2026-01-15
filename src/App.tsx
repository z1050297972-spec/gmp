import React, { useState } from 'react';
import { HardwareFrame } from './components/HardwareFrame';
import { MainMenu } from './features/menu/MainMenu';
import { Consumables } from './features/consumables/Consumables';
import { Refueling } from './features/refueling/Refueling';
import { AppView, ButtonConfig, ConsumableItem, RefuelingChannel } from './types';
import { INITIAL_CHANNELS, INITIAL_CONSUMABLES } from './data/initialData';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.MENU);
  const [buttonConfig, setButtonConfig] = useState<ButtonConfig>({});

  // App Data State - Reserved for future use
  const [_consumables] = useState<ConsumableItem[]>(INITIAL_CONSUMABLES);
  const [_channels, _setChannels] = useState<RefuelingChannel[]>(INITIAL_CHANNELS);

  // Render the appropriate view based on state
  const renderView = () => {
    switch (currentView) {
      case AppView.MENU:
        return (
          <MainMenu
            setButtonConfig={setButtonConfig}
            onNavigate={setCurrentView}
          />
        );
      case AppView.CONSUMABLES:
        return (
          <Consumables
            setButtonConfig={setButtonConfig}
            onNavigate={setCurrentView}
          />
        );
      case AppView.REFUELING:
        return (
          <Refueling
            setButtonConfig={setButtonConfig}
            onNavigate={setCurrentView}
          />
        );
      default:
        return <div className="text-red-500">Error: Unknown View</div>;
    }
  };

  return (
    <HardwareFrame
      buttonConfig={buttonConfig}
    >
      {renderView()}
    </HardwareFrame>
  );
};

export default App;
