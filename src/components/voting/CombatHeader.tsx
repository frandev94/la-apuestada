import type { CombatHeaderProps } from './types';

// SRP: Combat header component
export function CombatHeader({ combatId }: CombatHeaderProps) {
  return (
    <div className="text-center mb-6">
      <h3 className="text-2xl font-bold text-gray-800 mb-2">
        Combat #{combatId}
      </h3>
      <p className="text-gray-600">Choose your fighter!</p>
    </div>
  );
}
