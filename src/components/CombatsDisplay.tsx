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
      return `${baseClasses} bg-blue-500/20 text-blue-200 border border-blue-400/30`;
    }
    return `${baseClasses} bg-green-500/20 text-green-200 border border-green-400/30`;
  };

  const getStatusText = (winner: Combat['winner']) => {
    return winner === undefined ? 'Scheduled' : 'Finished';
  };

  const formatResult = (combat: Combat) => {
    const { winner } = combat;
    if (!winner) return null;

    return (
      <div className="mt-2 text-sm text-gray-300">
        <div className="font-medium text-green-300">
          Winner: {getParticipantName(winner)}
        </div>
      </div>
    );
  };

  return (
    <div
      className={`bg-white/5 backdrop-blur-md rounded-lg shadow-2xl border border-white/10 p-6 ${className}`}
    >
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">
          La Velada del Año - Combats
        </h2>
        <p className="text-gray-200">
          {laVeladaCombats.length} exciting matchups await!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {laVeladaCombats.map((combat) => (
          <div
            key={combat.id}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 hover:bg-white/10 hover:shadow-lg transition-all duration-200"
          >
            {/* Combat Header */}
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-white">
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
                    <div className="bg-blue-500/20 backdrop-blur-sm rounded-lg p-3 mb-2 border border-blue-400/30">
                      <div className="w-12 h-12 bg-blue-400/30 rounded-full mx-auto mb-2 flex items-center justify-center border border-blue-300/40">
                        <span className="text-blue-200 font-bold text-lg">
                          {combat.fighter1.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="font-medium text-white">
                        {getParticipantName(combat.fighter1)}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="px-4 py-2 text-gray-300 font-bold text-xl">
                  VS
                </div>

                <div className="flex-1">
                  <div className="text-center">
                    <div className="bg-purple-500/20 backdrop-blur-sm rounded-lg p-3 mb-2 border border-purple-400/30">
                      <div className="w-12 h-12 bg-purple-400/30 rounded-full mx-auto mb-2 flex items-center justify-center border border-purple-300/40">
                        <span className="text-purple-200 font-bold text-lg">
                          {combat.fighter2.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="font-medium text-white">
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
          <div className="bg-blue-500/20 backdrop-blur-sm rounded-lg p-3 border border-blue-400/30">
            <div className="text-2xl font-bold text-blue-200">
              {laVeladaCombats.filter((c) => c.winner === undefined).length}
            </div>
            <div className="text-sm text-blue-300">Scheduled</div>
          </div>
          <div className="bg-green-500/20 backdrop-blur-sm rounded-lg p-3 border border-green-400/30">
            <div className="text-2xl font-bold text-green-200">
              {laVeladaCombats.filter((c) => c.winner !== undefined).length}
            </div>
            <div className="text-sm text-green-300">Finished</div>
          </div>
        </div>
      </div>
    </div>
  );
}
