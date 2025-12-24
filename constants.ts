import { ConsumableItem, RefuelingChannel } from "./types";

export const INITIAL_CONSUMABLES: ConsumableItem[] = [
  { id: 'c1', name: '液压油 A', remaining: 85, max: 100, unit: 'L', warningLevel: 20 },
  { id: 'c2', name: '润滑脂 B', remaining: 12, max: 50, unit: 'kg', warningLevel: 15 },
  { id: 'c3', name: '冷却液', remaining: 92, max: 100, unit: 'L', warningLevel: 10 },
  { id: 'c4', name: '添加剂 X', remaining: 45, max: 200, unit: 'mL', warningLevel: 30 },
  { id: 'c5', name: '清洁剂', remaining: 60, max: 100, unit: 'L', warningLevel: 10 },
];

export const INITIAL_CHANNELS: RefuelingChannel[] = [
  { id: 1, name: '通道 01', isEnabled: true, pressure: 120, duration: 45 },
  { id: 2, name: '通道 02', isEnabled: true, pressure: 110, duration: 30 },
  { id: 3, name: '通道 03', isEnabled: false, pressure: 0, duration: 0 },
  { id: 4, name: '通道 04', isEnabled: true, pressure: 125, duration: 60 },
];
