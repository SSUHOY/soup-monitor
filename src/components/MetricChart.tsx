import React, { useEffect, useRef } from 'react';
import uPlot from 'uplot';
import 'uplot/dist/uPlot.min.css';
import { type DataPoint } from '../utils/generateData';

interface Props {
  data: DataPoint[];
  metricKey: 'loss' | 'lr' | 'grad_norm';
  title: string;
  color: string;
}

export const MetricChart: React.FC<Props> = ({ data, metricKey, title, color }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const plotRef = useRef<uPlot | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    if (plotRef.current) {
      plotRef.current.destroy();
      plotRef.current = null;
    }

    const xVals: number[] = [];
    const yVals: number[] = [];

    for (let i = 0; i < data.length; i++) {
      xVals.push(data[i].step);
      const val = data[i][metricKey];
      // Если NaN или Infinity, передаем null, чтобы uPlot корректно это отобразил (или пропустил)
      if (typeof val === 'number' && Number.isFinite(val)) {
        yVals.push(val);
      } else {
        yVals.push(NaN as any);
      }
    }

    const chartData: uPlot.AlignedData = [xVals, yVals];

    const opts: uPlot.Options = {
      title,
      width: containerRef.current.clientWidth || 600,
      height: 220,
      axes: [
        {
          stroke: '#64748b',
          grid: { stroke: '#334155', width: 1 },
          ticks: { stroke: '#334155' },
          values: (u, splits) => splits.map(v => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v),
        },
        {
          stroke: '#64748b',
          grid: { stroke: '#334155', width: 1 },
          ticks: { stroke: '#334155' },
          values: (u, splits) => splits.map(v => {
            if (v === 0) return '0';
            if (Math.abs(v) < 0.01) return v.toExponential(1);
            if (Math.abs(v) < 10) return v.toFixed(2);
            return v.toFixed(0);
            }),
        },
      ],
      series: [
        {
          label: 'Step',
          value: (u, v) => (v != null ? `${v.toLocaleString()}` : '-'),
        },
        {
          label: title,
          stroke: color,
          width: 2,
          points: { show: data.length < 2000 },
          value: (u, v) => (v != null && !Number.isNaN(v) ? (v < 0.01 ? v.toExponential(2) : v.toFixed(4)) : 'NaN'),
        },
      ],
      cursor: {
        drag: { setScale: true },
      },
    };

    plotRef.current = new uPlot(opts, chartData, containerRef.current);

    const handleResize = () => {
      if (containerRef.current && plotRef.current) {
        plotRef.current.setSize({
          width: containerRef.current.clientWidth || 600,
          height: 220,
        });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (plotRef.current) {
        plotRef.current.destroy();
      }
    };
  }, [data, metricKey, title, color]);

  return (
    <div className="bg-slate-900/80 border border-slate-700/60 rounded-xl p-4">
      <div ref={containerRef} className="w-full overflow-hidden" />
    </div>
  );
};