interface VotesBarProps {
  fighter1: string;
  fighter2: string;
  votes: Array<{ participantId: string; voteCount: number }>;
}

export function VotesBar({ fighter1, fighter2, votes }: VotesBarProps) {
  const v1 = votes.find((v) => v.participantId === fighter1)?.voteCount ?? 0;
  const v2 = votes.find((v) => v.participantId === fighter2)?.voteCount ?? 0;
  const total = v1 + v2;
  const percent1 = total > 0 ? (v1 / total) * 100 : 0;
  const percent2 = total > 0 ? (v2 / total) * 100 : 0;
  return (
    <div className="w-full h-6 bg-white/10 rounded flex overflow-hidden border border-white/10 relative">
      <div
        className="h-full bg-blue-400/80 flex items-center justify-center text-xs font-bold text-white transition-all duration-500"
        style={{ width: `${percent1}%` }}
      >
        {v1 > 0 && (
          <span className="px-2">
            {v1} <span className="opacity-80">({percent1.toFixed(0)}%)</span>
          </span>
        )}
      </div>
      <div
        className="h-full bg-purple-400/80 flex items-center justify-center text-xs font-bold text-white transition-all duration-500"
        style={{ width: `${percent2}%` }}
      >
        {v2 > 0 && (
          <span className="px-2">
            {v2} <span className="opacity-80">({percent2.toFixed(0)}%)</span>
          </span>
        )}
      </div>
      {total === 0 && (
        <span className="absolute left-1/2 -translate-x-1/2 text-xs text-gray-300 font-semibold">
          Sin votos
        </span>
      )}
    </div>
  );
}
