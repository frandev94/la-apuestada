import type { ErrorDisplayProps } from './types';

// SRP: Error display component
export function ErrorDisplay({ error }: ErrorDisplayProps) {
  if (!error) return null;

  return (
    <div className="mb-4 p-2 bg-red-500/20 backdrop-blur-sm border border-red-400/30 text-red-200 rounded">
      Error: {error}
    </div>
  );
}
