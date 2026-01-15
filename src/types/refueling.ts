/**
 * Refueling related types
 */

export interface RefuelingChannel {
  id: number;
  name: string;
  isEnabled: boolean;
  pressure: number; // bar or psi
  duration: number; // seconds
}
