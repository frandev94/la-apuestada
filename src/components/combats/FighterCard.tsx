import type { EventParticipantsName } from '../../constants/participants';
import { generateFighterAvatarUrl } from '../../constants/participants';

interface FighterCardProps {
  participantId: EventParticipantsName;
  color: 'blue' | 'purple';
  getParticipantName: (id: string) => string;
  isWinner?: boolean;
  isUserVote?: boolean;
}

export function FighterCard({
  participantId,
  color,
  getParticipantName,
  isWinner = false,
  isUserVote = false,
}: FighterCardProps) {
  const colorClasses =
    color === 'blue'
      ? 'bg-blue-500/20 border-blue-400/30 border-2'
      : 'bg-purple-500/20 border-purple-400/30 border-2';

  const winnerRing = isWinner ? 'ring-4 ring-green-400' : '';
  const userVoteRing = isUserVote ? 'ring-4 ring-blue-400' : '';
  // Si es ganador y voto, combinamos ambos estilos
  const ringClass =
    isWinner && isUserVote
      ? 'ring-4 ring-green-400 ring-offset-2 ring-offset-blue-400'
      : isWinner
        ? winnerRing
        : isUserVote
          ? userVoteRing
          : '';

  return (
    <div
      className={`${colorClasses} backdrop-blur-sm rounded-lg p-3 mb-2 text-center flex flex-col items-center h-full min-h-[220px] justify-between`}
    >
      <div className="my-2">
        <img
          src={generateFighterAvatarUrl(participantId)}
          alt={getParticipantName(participantId)}
          className={`w-24 h-24 rounded-full mx-auto mb-2 object-cover ${ringClass}`}
          loading="lazy"
        />
        <div className="font-medium text-white">
          {getParticipantName(participantId)}
        </div>
      </div>
      <div className="flex flex-col gap-1 mt-2">
        {isWinner && (
          <div className="text-green-300 text-xs font-bold">Ganador</div>
        )}
        {isUserVote && (
          <div className="text-blue-300 text-xs font-bold">Tu voto</div>
        )}
      </div>
    </div>
  );
}
