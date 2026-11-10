import { type DataPoint } from './generateData';

export interface CleanedPoint {
  step: number;
  loss: number | null;
  lr: number | null;
  grad_norm: number | null;
}

export function cleanAndSortMetrics(rawMetrics: DataPoint[]): CleanedPoint[] {
  if (!rawMetrics || rawMetrics.length === 0) return [];

  const sorted = [...rawMetrics].sort((a, b) => a.step - b.step);
  const uniquePoints: CleanedPoint[] = [];
  const seenSteps = new Set<number>();

  for (const pt of sorted) {
    if (seenSteps.has(pt.step)) continue;
    seenSteps.add(pt.step);

    uniquePoints.push({
      step: pt.step,
      loss: Number.isFinite(pt.loss) ? pt.loss : null,
      lr: Number.isFinite(pt.lr) ? pt.lr : null,
      grad_norm: Number.isFinite(pt.grad_norm) ? pt.grad_norm : null,
    });
  }

  return uniquePoints;
}

export function downsampleMetrics(data: CleanedPoint[], targetPoints: number): CleanedPoint[] {
  if (data.length <= targetPoints || targetPoints <= 0) return data;

  const bucketSize = Math.floor(data.length / targetPoints);
  const sampled: CleanedPoint[] = [];

  sampled.push(data[0]);

  for (let i = 1; i < targetPoints - 1; i++) {
    const start = i * bucketSize;
    const end = Math.min((i + 1) * bucketSize, data.length);
    const bucket = data.slice(start, end);

    if (bucket.length === 0) continue;

    let maxPt = bucket[0];
    let minPt = bucket[0];

    for (const pt of bucket) {
      if (pt.loss !== null && (maxPt.loss === null || pt.loss > maxPt.loss)) {
        maxPt = pt;
      }
      if (pt.loss !== null && (minPt.loss === null || pt.loss < minPt.loss)) {
        minPt = pt;
      }
    }

    const chosen = (maxPt.loss ?? 0) > 50 ? maxPt : bucket[0];
    sampled.push(chosen);
  }

  sampled.push(data[data.length - 1]);

  return sampled;
}