import { useState, useEffect } from 'react';
import { generateAllRuns, type TrainingRun } from './utils/generateData';
import { SummaryCards } from './components/SummaryCards';
import { RunList } from './components/RunList';
import { Activity, RefreshCw } from 'lucide-react';
import { MetricChart } from './components/MetricChart';

export default function App() {
  const [runs, setRuns] = useState<TrainingRun[]>([]);
  const [selectedRunId, setSelectedRunId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [activeRunData, setActiveRunData] = useState<TrainingRun | null>(null);
  const [isRunLoading, setIsRunLoading] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      const initialRuns = generateAllRuns();
      setRuns(initialRuns);
     
      if (initialRuns.length > 0) {
        setSelectedRunId(initialRuns[0].id);
      }
     
      setIsLoading(false);
    }, 200);
  }, []);

  useEffect(() => {
    if (!selectedRunId || runs.length === 0) return;

    let isCancelled = false;
    setIsRunLoading(true);

    setTimeout(() => {
      if (isCancelled) return;

      const run = runs.find((r) => r.id === selectedRunId) || null;
      setActiveRunData(run);
      setIsRunLoading(false);
    }, 150);

    return () => {
      isCancelled = true;
    };
  }, [selectedRunId, runs]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6">
      <header className="flex items-center justify-between pb-6 border-b border-slate-800 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-600 rounded-xl text-white">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Soup Training Monitor</h1>
            <p className="text-xs text-slate-400">Truthful ML Experiment Analytics</p>
          </div>
        </div>

        <button
          onClick={() => {
            setIsLoading(true);
            setTimeout(() => {
              const newRuns = generateAllRuns();
              setRuns(newRuns);
              if (newRuns.length > 0) {
                setSelectedRunId(newRuns[0].id);
              }
              setIsLoading(false);
            }, 200);
          }}
          className="flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-sm transition-colors cursor-pointer"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          Recreate data
        </button>
      </header>

      {isLoading ? (
        <div className="flex items-center justify-center py-20 text-slate-400">
          <RefreshCw className="w-8 h-8 animate-spin mr-3 text-blue-500" />
          <span>Generating 20 experiments with 1,000,000 points...</span>
        </div>
      ) : (
        <>
          <SummaryCards runs={runs} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <RunList runs={runs} selectedRunId={selectedRunId} onSelectRun={setSelectedRunId} />
            </div>

            <div className="lg:col-span-2 space-y-6">
              {isRunLoading ? (
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-12 text-slate-400 text-center flex items-center justify-center">
                  <RefreshCw className="w-6 h-6 animate-spin mr-2 text-blue-500" />
                  <span>Loading run metrics...</span>
                </div>
              ) : activeRunData ? (
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
                  <div className="flex items-center justify-between border-b border-slate-700 pb-4 mb-6">
                    <div>
                      <h2 className="text-xl font-bold text-white">{activeRunData.name}</h2>
                      <p className="text-xs text-slate-400 mt-1">
                        ID: {activeRunData.id} | Created: {new Date(activeRunData.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      activeRunData.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                    }`}>
                      {activeRunData.status}
                    </span>
                  </div>

                  <div className="space-y-6">
                    <MetricChart 
                      data={activeRunData.metrics} 
                      metricKey="loss" 
                      title="Loss (Потери)" 
                      color="#3b82f6" 
                    />
                    <MetricChart 
                      data={activeRunData.metrics} 
                      metricKey="lr" 
                      title="Learning Rate (Скорость обучения)" 
                      color="#10b981" 
                    />
                    <MetricChart 
                      data={activeRunData.metrics} 
                      metricKey="grad_norm" 
                      title="Gradient Norm (Норма градиента)" 
                      color="#f59e0b" 
                    />
                  </div>
                </div>
              ) : (
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-12 text-slate-500 text-center">
                  Select a run from the list
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}