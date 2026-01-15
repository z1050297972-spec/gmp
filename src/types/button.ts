/**
 * Button related types
 */

// Button Identifiers - 20 buttons total
// Top: T1-T6, Bottom: B1-B6, Left: L1-L4, Right: R1-R4
export enum ButtonId {
  // Top row (6 buttons)
  T1 = 'T1',
  T2 = 'T2',
  T3 = 'T3',
  T4 = 'T4',
  T5 = 'T5',
  T6 = 'T6',
  // Bottom row (6 buttons)
  B1 = 'B1',
  B2 = 'B2',
  B3 = 'B3',
  B4 = 'B4',
  B5 = 'B5',
  B6 = 'B6',
  // Left column (4 buttons)
  L1 = 'L1',
  L2 = 'L2',
  L3 = 'L3',
  L4 = 'L4',
  // Right column (4 buttons)
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
