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
          className="h-max rounded-b-full mx-auto mb-3 object-cover"
        />
      )}
      <h4 className="text-lg font-bold text-gray-800 mb-2">{fighter.name}</h4>
    </>
  );
}
