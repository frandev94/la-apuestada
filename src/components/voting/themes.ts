import type { ThemeConfig } from './types';

// Theme implementations (LSP: Substitutable implementations)
export const blueTheme: ThemeConfig = {
  voteCountColor: 'text-blue-200',
  buttonStyles:
    'bg-blue-600/80 text-white hover:bg-blue-700 focus:ring-blue-400 backdrop-blur-sm border border-blue-400/30',
  loadingStyles: 'bg-blue-500/60 text-white cursor-wait backdrop-blur-sm',
};

export const redTheme: ThemeConfig = {
  voteCountColor: 'text-purple-200',
  buttonStyles:
    'bg-purple-600/80 text-white hover:bg-purple-700 focus:ring-purple-400 backdrop-blur-sm border border-purple-400/30',
  loadingStyles: 'bg-purple-500/60 text-white cursor-wait backdrop-blur-sm',
};

// Additional theme examples for extensibility
export const greenTheme: ThemeConfig = {
  voteCountColor: 'text-green-200',
  buttonStyles:
    'bg-green-600/80 text-white hover:bg-green-700 focus:ring-green-400 backdrop-blur-sm border border-green-400/30',
  loadingStyles: 'bg-green-500/60 text-white cursor-wait backdrop-blur-sm',
};

export const purpleTheme: ThemeConfig = {
  voteCountColor: 'text-purple-200',
  buttonStyles:
    'bg-purple-600/80 text-white hover:bg-purple-700 focus:ring-purple-400 backdrop-blur-sm border border-purple-400/30',
  loadingStyles: 'bg-purple-500/60 text-white cursor-wait backdrop-blur-sm',
};
