import type { ThemeConfig } from './types';

// Theme implementations (LSP: Substitutable implementations)
export const blueTheme: ThemeConfig = {
  voteCountColor: 'text-blue-600',
  buttonStyles: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
  loadingStyles: 'bg-blue-400 text-white cursor-wait',
};

export const redTheme: ThemeConfig = {
  voteCountColor: 'text-red-600',
  buttonStyles: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  loadingStyles: 'bg-red-400 text-white cursor-wait',
};

// Additional theme examples for extensibility
export const greenTheme: ThemeConfig = {
  voteCountColor: 'text-green-600',
  buttonStyles:
    'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
  loadingStyles: 'bg-green-400 text-white cursor-wait',
};

export const purpleTheme: ThemeConfig = {
  voteCountColor: 'text-purple-600',
  buttonStyles:
    'bg-purple-600 text-white hover:bg-purple-700 focus:ring-purple-500',
  loadingStyles: 'bg-purple-400 text-white cursor-wait',
};
