import React from 'react';
import type { TrainingRun } from '../utils/generateData';
import { Activity, AlertTriangle, CheckCircle2, Database } from 'lucide-react';

interface Props {
  runs: TrainingRun[];
}

export const SummaryCards: React.FC<Props> = ({ runs }) => {
  const totalRuns = runs.length;
  const completedRuns = runs.filter((r) => r.status === 'completed').length;
  const failedRuns = runs.filter((r) => r.status === 'failed').length;
  const totalPoints = runs.reduce((acc, r) => acc + r.metrics.length, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-slate-800 border border-slate-700 p-4 rounded-xl flex items-center gap-4">
        <div className="p-3 bg-blue-500/10 text-blue-400 rounded-lg">
          <Database className="w-6 h-6" />
        </div>
        <div>
          <p className="text-sm text-slate-400">All runs</p>
          <p className="text-2xl font-bold text-white">{totalRuns}</p>
        </div>
      </div>

      <div className="bg-slate-800 border border-slate-700 p-4 rounded-xl flex items-center gap-4">
        <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-lg">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <div>
          <p className="text-sm text-slate-400">Success (Completed)</p>
          <p className="text-2xl font-bold text-white">{completedRuns}</p>
        </div>
      </div>

      <div className="bg-slate-800 border border-slate-700 p-4 rounded-xl flex items-center gap-4">
        <div className="p-3 bg-rose-500/10 text-rose-400 rounded-lg">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div>
          <p className="text-sm text-slate-400">Errors (Failed)</p>
          <p className="text-2xl font-bold text-white">{failedRuns}</p>
        </div>
      </div>

      <div className="bg-slate-800 border border-slate-700 p-4 rounded-xl flex items-center gap-4">
        <div className="p-3 bg-purple-500/10 text-purple-400 rounded-lg">
          <Activity className="w-6 h-6" />
        </div>
        <div>
          <p className="text-sm text-slate-400">All data points</p>
          <p className="text-2xl font-bold text-white">
            {totalPoints >= 1_000_000 ? `${(totalPoints / 1_000_000).toFixed(1)}M` : totalPoints.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};