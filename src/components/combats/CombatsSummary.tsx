interface CombatsSummaryProps {
  total: number;
  scheduled: number;
  finished: number;
}

export function CombatsSummary({ scheduled, finished }: CombatsSummaryProps) {
  return (
    <div className="mt-6 text-center">
      <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
        <div className="bg-blue-500/20 backdrop-blur-sm rounded-lg p-3 border border-blue-400/30">
          <div className="text-2xl font-bold text-blue-200">{scheduled}</div>
          <div className="text-sm text-blue-300">Programados</div>
        </div>
        <div className="bg-green-500/20 backdrop-blur-sm rounded-lg p-3 border border-green-400/30">
          <div className="text-2xl font-bold text-green-200">{finished}</div>
          <div className="text-sm text-green-300">Finalizados</div>
        </div>
      </div>
    </div>
  );
}
