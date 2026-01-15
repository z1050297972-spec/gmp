/**
 * Consumable related types
 */

export interface ConsumableItem {
  id: string;
  name: string;
  remaining: number; // percentage or absolute unit
  max: number;
  unit: string;
  warningLevel: number;
}
