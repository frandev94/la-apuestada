import type { FighterDisplayProps } from './types';

// SRP: Component responsible only for fighter display
export function FighterDisplay({ fighterData }: FighterDisplayProps) {
  const { fighter } = fighterData;

  return (
    <>
      {fighter.avatar && (
        <img
          src={fighter.avatar}
          alt={fighter.name}
          className="w-40 h-60 rounded-full mx-auto mb-3 object-cover"
        />
      )}
      <h4 className="text-lg font-bold text-gray-800 mb-2">{fighter.name}</h4>
    </>
  );
}
