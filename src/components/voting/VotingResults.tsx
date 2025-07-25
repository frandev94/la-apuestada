import { useEffect, useState } from 'react';
import {
  type VoteResults,
  getTotalVotes,
  getVoteResults,
} from '../../lib/voting';

export function VotingResults() {
  const [results, setResults] = useState<VoteResults[]>([]);
  const [totalVotes, setTotalVotes] = useState(0);

  useEffect(() => {
    updateResults();
  }, []);

  const updateResults = async () => {
    setResults(await getVoteResults());
    setTotalVotes(await getTotalVotes());
  };

  const getParticipantName = (participantId: string): string => {
    // Capitalize first letter for display
    return participantId.charAt(0).toUpperCase() + participantId.slice(1);
  };

  const getPercentage = (voteCount: number): number => {
    if (totalVotes === 0) return 0;
    return Math.round((voteCount / totalVotes) * 100);
  };

  if (totalVotes === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Resultados de la votación
        </h2>
        <div className="text-center text-gray-500">
          <p className="text-lg">Aún no hay votos</p>
          <p className="text-sm mt-2">
            ¡Sé el primero en votar por tu participante favorito!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={'bg-white rounded-lg shadow-md p-6'}>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Resultados de la votación
        </h2>
        <p className="text-gray-600">
          Votos totales: <span className="font-semibold">{totalVotes}</span>
        </p>
      </div>

      <div className="space-y-4">
        {results.map((result, index) => (
          <div
            key={result.participantId}
            data-testid={`participant-result-${result.participantId}`}
            className={`p-4 rounded-lg border ${
              index === 0 && result.voteCount > 0
                ? 'border-yellow-400 bg-yellow-50'
                : 'border-gray-200 bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                {index === 0 && result.voteCount > 0 && (
                  <span className="text-yellow-500 mr-2 text-xl">👑</span>
                )}
                <h3 className="text-lg font-semibold text-gray-800">
                  {getParticipantName(result.participantId)}
                </h3>
              </div>
              <div className="text-right">
                <span className="text-xl font-bold text-blue-600">
                  {result.voteCount}
                </span>
                <span className="text-gray-600 ml-1">
                  {result.voteCount === 1 ? 'voto' : 'votos'}
                </span>
              </div>
            </div>{' '}
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`voting-progress-bar h-2 rounded-full transition-all duration-500 ${
                  index === 0 && result.voteCount > 0
                    ? 'bg-yellow-400'
                    : 'bg-blue-600'
                }`}
                data-percentage={getPercentage(result.voteCount)}
              />
            </div>
            <div className="mt-1 text-right">
              <span className="text-sm text-gray-500">
                {getPercentage(result.voteCount)}%
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 text-center text-sm text-gray-500">
        <p>Resultados actualizados en tiempo real</p>
      </div>
    </div>
  );
}
