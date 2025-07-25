import type { EventParticipantsName } from '../../constants/participants';

interface AdminWinnerSelectorProps {
  combatId: number;
  fighter1: EventParticipantsName;
  fighter2: EventParticipantsName;
  onSetWinner: (combatId: number, winner: EventParticipantsName) => void;
  getParticipantName: (id: string) => string;
}

export const AdminWinnerSelector = ({
  combatId,
  fighter1,
  fighter2,
  onSetWinner,
  getParticipantName,
}: AdminWinnerSelectorProps) => (
  <div className="mt-2 text-sm text-gray-300 flex flex-col gap-2">
    <span className="font-medium text-yellow-300">Marcar ganador:</span>
    <div className="flex gap-2">
      <button
        type="button"
        className="px-3 py-1 rounded bg-blue-600/80 text-white hover:bg-blue-700/90 transition"
        onClick={() => onSetWinner(combatId, fighter1)}
      >
        {getParticipantName(fighter1)}
      </button>
      <button
        type="button"
        className="px-3 py-1 rounded bg-purple-600/80 text-white hover:bg-purple-700/90 transition"
        onClick={() => onSetWinner(combatId, fighter2)}
      >
        {getParticipantName(fighter2)}
      </button>
    </div>
  </div>
);
