import type { Combat } from '../../constants/combats';
import type { EventParticipantsName } from '../../constants/participants';
import { AdminWinnerSelector } from './AdminWinnerSelector';
import { FighterCard } from './FighterCard';
import { VotesBar } from './VotesBar';

interface CombatCardProps {
  combat: Combat;
  adminMode: boolean;
  getParticipantName: (id: string) => string;
  getStatusBadge: (winner: Combat['winner']) => string;
  getStatusText: (winner: Combat['winner']) => string;
  handleSetWinner: (combatId: number, winner: EventParticipantsName) => void;
  deleteWinner: (combatId: number) => void;
  userVote: string | null;
  votes: Array<{ participantId: string; voteCount: number }>;
}

export function CombatCard({
  combat,
  adminMode,
  getParticipantName,
  getStatusBadge,
  getStatusText,
  handleSetWinner,
  deleteWinner,
  userVote,
  votes = [],
}: CombatCardProps) {
  const { id, fighter1, fighter2, winner } = combat;

  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 hover:bg-white/10 hover:shadow-lg transition-all duration-200">
      {/* Combat Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-white">Combate #{id}</h3>
        <span className={getStatusBadge(winner)}>{getStatusText(winner)}</span>
      </div>
      {/* Fighters */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <FighterCard
              participantId={fighter1}
              color="blue"
              getParticipantName={getParticipantName}
              isWinner={winner === fighter1}
              isUserVote={userVote === fighter1}
            />
          </div>
          <div className="px-4 py-2 text-gray-300 font-bold text-xl">VS</div>
          <div className="flex-1">
            <FighterCard
              participantId={fighter2}
              color="purple"
              getParticipantName={getParticipantName}
              isWinner={winner === fighter2}
              isUserVote={userVote === fighter2}
            />
          </div>
        </div>
        {/* Votes */}
        {winner && (
          <VotesBar fighter1={fighter1} fighter2={fighter2} votes={votes} />
        )}
        {/* Resultados y controles */}
        <div className="mt-2 flex flex-col gap-2">
          {!winner && adminMode && (
            <AdminWinnerSelector
              combatId={id}
              fighter1={fighter1}
              fighter2={fighter2}
              onSetWinner={handleSetWinner}
              getParticipantName={getParticipantName}
            />
          )}
          {winner && adminMode && (
            <button
              type="button"
              className="mt-1 px-2 py-1 rounded bg-red-600/80 text-white hover:bg-red-700/90 transition w-fit self-start"
              onClick={() => deleteWinner(id)}
            >
              Eliminar ganador
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
