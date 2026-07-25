import { config2025 } from './2025';
import { config2026 } from './2026';

export const ACTIVE_YEAR = 2026;

const configs = {
  2025: config2025,
  2026: config2026,
} as const;

export const activeConfig = configs[ACTIVE_YEAR as keyof typeof configs];

export type CombatConfig = {
  pelea: number;
  fighter_1: string;
  fighter_2: string;
};

export type YearConfig = typeof activeConfig;
