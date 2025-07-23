import { laVeladaCombats } from '../constants/combats';
import type { Combat } from '../constants/combats';

interface CombatsDisplayProps {
  className?: string;
}

export function CombatsDisplay({ className = '' }: CombatsDisplayProps) {
  const getParticipantName = (participantId: string): string => {
    return participantId.charAt(0).toUpperCase() + participantId.slice(1);
  };

  const getStatusBadge = (winner: Combat['winner']) => {
    const baseClasses = 'px-2 py-1 rounded-full text-xs font-medium';

    if (winner === undefined) {
      return `${baseClasses} bg-blue-100 text-blue-800`;
    }
    return `${baseClasses} bg-green-100 text-green-800`;
  };

  const getStatusText = (winner: Combat['winner']) => {
    return winner === undefined ? 'Scheduled' : 'Finished';
  };

  const formatResult = (combat: Combat) => {
    const { winner } = combat;
    if (!winner) return null;

    return (
      <div className="mt-2 text-sm text-gray-600">
        <div className="font-medium text-green-600">
          Winner: {getParticipantName(winner)}
        </div>
      </div>
    );
  };

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          La Velada del Año - Combats
        </h2>
        <p className="text-gray-600">
          {laVeladaCombats.length} exciting matchups await!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {laVeladaCombats.map((combat) => (
          <div
            key={combat.id}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            {/* Combat Header */}
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-800">
                Combat #{combat.id}
              </h3>
              <span className={getStatusBadge(combat.winner)}>
                {getStatusText(combat.winner)}
              </span>
            </div>

            {/* Fighters */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="text-center">
                    <div className="bg-blue-50 rounded-lg p-3 mb-2">
                      <div className="w-12 h-12 bg-blue-200 rounded-full mx-auto mb-2 flex items-center justify-center">
                        <span className="text-blue-800 font-bold text-lg">
                          {combat.fighter1.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="font-medium text-gray-800">
                        {getParticipantName(combat.fighter1)}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="px-4 py-2 text-gray-500 font-bold text-xl">
                  VS
                </div>

                <div className="flex-1">
                  <div className="text-center">
                    <div className="bg-red-50 rounded-lg p-3 mb-2">
                      <div className="w-12 h-12 bg-red-200 rounded-full mx-auto mb-2 flex items-center justify-center">
                        <span className="text-red-800 font-bold text-lg">
                          {combat.fighter2.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="font-medium text-gray-800">
                        {getParticipantName(combat.fighter2)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Result */}
              {formatResult(combat)}
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-6 text-center">
        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
          <div className="bg-blue-50 rounded-lg p-3">
            <div className="text-2xl font-bold text-blue-600">
              {laVeladaCombats.filter((c) => c.winner === undefined).length}
            </div>
            <div className="text-sm text-blue-800">Scheduled</div>
          </div>
          <div className="bg-green-50 rounded-lg p-3">
            <div className="text-2xl font-bold text-green-600">
              {laVeladaCombats.filter((c) => c.winner !== undefined).length}
            </div>
            <div className="text-sm text-green-800">Finished</div>
          </div>
        </div>
      </div>
    </div>
  );
}
