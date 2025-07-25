import type { CombatHeaderProps } from './types';

// SRP: Combat header component
export function CombatHeader({ combatId }: CombatHeaderProps) {
  return (
    <div className="text-center mb-6">
      <h3 className="text-2xl font-bold text-white mb-2">
        Combate #{combatId}
      </h3>
      <p className="text-gray-200">¡Elige a tu luchador!</p>
    </div>
  );
}
