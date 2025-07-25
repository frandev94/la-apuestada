import { actions } from 'astro:actions';
import type { CombatWinnerRecord } from '@/lib/db/winner-repository';
import { useState } from 'react';
import { laVeladaCombats } from '../../constants/combats';
import type { EventParticipantsName } from '../../constants/participants';
import { CombatCard } from './CombatCard';
import { CombatsSummary } from './CombatsSummary';

interface CombatsDisplayProps {
  className?: string;
  adminMode?: boolean;
  winners?: CombatWinnerRecord[];
  userVotes?: { combatId: number; participantId: string }[];
  votesPerCombat?: Array<{
    combatId: number;
    votes: Array<{ participantId: string; voteCount: number }>;
  }>;
}

export function CombatsDisplay({
  className = '',
  adminMode = false,
  winners = [],
  userVotes = [],
  votesPerCombat = [],
}: CombatsDisplayProps) {
  const initialCombats = laVeladaCombats.map((combat) => {
    const found = winners.find((winner) => winner.combatId === combat.id);
    return {
      ...combat,
      winner: found?.participantId as EventParticipantsName | undefined,
    };
  });
  const [combats, setCombats] = useState(initialCombats);

  const getParticipantName = (participantId: string): string => {
    return participantId.charAt(0).toUpperCase() + participantId.slice(1);
  };

  const getStatusBadge = (winner?: EventParticipantsName) => {
    const baseClasses = 'px-2 py-1 rounded-full text-xs font-medium';

    if (winner === undefined) {
      return `${baseClasses} bg-blue-500/20 text-blue-200 border border-blue-400/30`;
    }
    return `${baseClasses} bg-green-500/20 text-green-200 border border-green-400/30`;
  };

  const getStatusText = (winner?: EventParticipantsName) => {
    return winner === undefined ? 'Programado' : 'Finalizado';
  };

  // Persist winner using Astro Actions API
  const persistWinner = async (
    combatId: number,
    winner: EventParticipantsName,
  ) => {
    try {
      await actions.winnerActions.setWinner({
        combatId,
        participantId: winner,
      });
    } catch (e) {
      console.error('Error persisting winner:', e);
    }
  };

  const handleSetWinner = (combatId: number, winner: EventParticipantsName) => {
    setCombats((prev) =>
      prev.map((c) =>
        c.id === combatId
          ? { ...c, winner: winner as EventParticipantsName }
          : c,
      ),
    );
    persistWinner(combatId, winner);
  };

  // Delete winner using Astro Actions API
  const deleteWinner = async (combatId: number) => {
    try {
      await actions.winnerActions.deleteCombatWinner({ combatId });
      setCombats((prev) =>
        prev.map((c) => (c.id === combatId ? { ...c, winner: undefined } : c)),
      );
    } catch (e) {
      console.error('Error deleting winner:', e);
    }
  };

  const getUserVoteForCombat = (combatId: number) => {
    const vote = userVotes.find((v) => v.combatId === combatId);
    return vote ? vote.participantId : null;
  };

  return (
    <div
      className={`bg-white/5 backdrop-blur-md rounded-lg shadow-2xl border border-white/10 p-6 ${className}`}
    >
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">
          La Velada del Año - Combates
        </h2>
        <p className="text-gray-200">
          ¡{combats.length} enfrentamientos emocionantes te esperan!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {combats.map((combat) => (
          <CombatCard
            key={combat.id}
            combat={combat}
            adminMode={adminMode}
            getParticipantName={getParticipantName}
            getStatusBadge={getStatusBadge}
            getStatusText={getStatusText}
            handleSetWinner={handleSetWinner}
            deleteWinner={deleteWinner}
            userVote={getUserVoteForCombat(combat.id)}
            votes={
              votesPerCombat.find((v) => v.combatId === combat.id)?.votes || []
            }
          />
        ))}
      </div>

      <CombatsSummary
        total={combats.length}
        scheduled={combats.filter((c) => c.winner === undefined).length}
        finished={combats.filter((c) => c.winner !== undefined).length}
      />
    </div>
  );
}
