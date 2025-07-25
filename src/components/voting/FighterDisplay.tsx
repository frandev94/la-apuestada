import type { FighterDisplayProps } from './types';

// SRP: Component responsible only for fighter display
export function FighterDisplay({ fighterData }: FighterDisplayProps) {
  const { fighter } = fighterData;

  return (
    <div className="w-full h-full">
      {fighter.avatar && (
        <img
          src={fighter.avatar}
          alt={fighter.name}
          className=" h-max rounded-b-full mx-auto mb-3 object-cover border-2 border-white/20"
        />
      )}
      <h4 className="text-lg font-bold text-white mb-2 text-nowrap">
        {fighter.name}
      </h4>
    </div>
  );
}
