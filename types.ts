export enum AppView {
  MENU = 'MENU',
  CONSUMABLES = 'CONSUMABLES',
  REFUELING = 'REFUELING',
}

export type OperationMode = 'button' | 'touch';

export interface ConsumableItem {
  id: string;
  name: string;
  remaining: number; // percentage or absolute unit
  max: number;
  unit: string;
  warningLevel: number;
}

export interface RefuelingChannel {
  id: number;
  name: string;
  isEnabled: boolean;
  pressure: number; // bar or psi
  duration: number; // seconds
}

// Button Identifiers
export enum ButtonId {
  L1 = 'L1',
  L2 = 'L2',
  L3 = 'L3',
  L4 = 'L4',
  R1 = 'R1',
  R2 = 'R2',
  R3 = 'R3',
  R4 = 'R4',
}

export interface ButtonState {
  label?: string;
  action?: () => void;
  disabled?: boolean;
  isActive?: boolean; // For visual feedback
  color?: 'default' | 'primary' | 'danger' | 'success';
}

export type ButtonConfig = Partial<Record<ButtonId, ButtonState>>;