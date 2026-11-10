import React, { useState } from 'react';
import type { TrainingRun } from '../utils/generateData';
import { Search, ArrowUpDown, ChevronRight, AlertCircle, ChevronDown } from 'lucide-react';

interface Props {
  runs: TrainingRun[];
  selectedRunId: string | null;
  onSelectRun: (id: string) => void;
}

export const RunList: React.FC<Props> = ({ runs, selectedRunId, onSelectRun }) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'failed'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'points' | 'date'>('points');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const filteredRuns = runs
    .filter((run) => {
      const matchesSearch = run.name.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'all' || run.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      let comp = 0;
      if (sortBy === 'name') comp = a.name.localeCompare(b.name);
      if (sortBy === 'points') comp = a.metrics.length - b.metrics.length;
      if (sortBy === 'date') comp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      return sortOrder === 'asc' ? comp : -comp;
    });

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 flex flex-col h-full">
      <h2 className="text-lg font-semibold text-white mb-4">Список запусков</h2>

      <div className="space-y-3 mb-4">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Поиск по названию..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex gap-2">
            <div className="relative">
            <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 pr-8 text-xs text-white focus:outline-none focus:border-blue-500 appearance-none cursor-pointer"
            >
                <option value="all">Все статусы</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="flex items-center gap-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-300 hover:text-white"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            {sortBy} ({sortOrder})
          </button>
        </div>
      </div>

      <div className="overflow-y-auto space-y-2 pr-1 flex-1 max-h-[500px]">
        {filteredRuns.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-sm">
            Запуски не найдены
          </div>
        ) : (
          filteredRuns.map((run) => {
            const isSelected = run.id === selectedRunId;
            const hasAnomalies = run.metrics.some((m) => Number.isNaN(m.loss) || !Number.isFinite(m.loss));

            return (
              <button
                key={run.id}
                onClick={() => onSelectRun(run.id)}
                className={`w-full text-left p-3 rounded-lg border transition-all flex items-center justify-between ${
                  isSelected
                    ? 'bg-blue-600/20 border-blue-500 text-white'
                    : 'bg-slate-900/50 border-slate-700/50 text-slate-300 hover:bg-slate-700/50'
                }`}
                tabIndex={0}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm text-white">{run.name}</span>
                    {hasAnomalies && (
                      <span className="text-amber-400 title='Содержит NaN/Infinity'">
                        <AlertCircle className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span className={run.status === 'completed' ? 'text-emerald-400' : 'text-rose-400'}>
                      ● {run.status}
                    </span>
                    <span>{run.metrics.length.toLocaleString()} точек</span>
                  </div>
                </div>
                <ChevronRight className={`w-4 h-4 ${isSelected ? 'text-blue-400' : 'text-slate-600'}`} />
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};