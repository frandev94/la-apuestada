import type { ErrorDisplayProps } from './types';

// SRP: Error display component
export function ErrorDisplay({ error }: ErrorDisplayProps) {
  if (!error) return null;

  return (
    <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
      Error: {error}
    </div>
  );
}
