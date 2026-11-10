export interface DataPoint {
  step: number;
  loss: number;
  lr: number;
  grad_norm: number;
}

export interface TrainingRun {
  id: string;
  name: string;
  status: 'completed' | 'failed' | 'running';
  createdAt: string;
  config: {
    batchSize: number;
    epochs: number;
    optimizer: string;
  };
  metrics: DataPoint[];
}

function generateRunMetrics(pointsCount: number, hasSpike: boolean = false): DataPoint[] {
  const points: DataPoint[] = [];
  let currentLoss = 2.5;
  
  for (let i = 0; i < pointsCount; i++) {
    const noise = (Math.random() - 0.5) * 0.1;
    currentLoss = Math.max(0.01, currentLoss * 0.995 + noise);

    let loss = currentLoss;
    let lr = 0.001 * (1 - i / pointsCount);
    let grad_norm = 1.5 + Math.random() * 0.5;

    // Anomaly run
    if (hasSpike && i === Math.floor(pointsCount / 2)) {
      loss = 999.99;
      grad_norm = 50.0;
    }

    if (!hasSpike && i === 42) {
      loss = NaN;
    }
    if (!hasSpike && i === 100) {
      loss = Infinity;
    }

    points.push({
      step: i,
      loss,
      lr,
      grad_norm,
    });
  }

  if (pointsCount < 1000 && points.length > 10) {
    const temp = points[5];
    points[5] = points[8];
    points[8] = temp;
    
    points.splice(12, 0, { ...points[11] });
  }

  return points;
}

export function generateAllRuns(): TrainingRun[] {
  const runs: TrainingRun[] = [];
  
  for (let i = 1; i <= 20; i++) {
    const isMillion = i === 1;
    const count = isMillion ? 1_000_000 : 500;
    
    runs.push({
      id: `run-${i}`,
      name: isMillion ? `ResNet-50 Mega Run (1M pts)` : `Experiment model v1.${i}`,
      status: isMillion ? 'completed' : i % 3 === 0 ? 'failed' : 'completed',
      createdAt: new Date(Date.now() - i * 3600000 * 4).toISOString(),
      config: {
        batchSize: 64,
        epochs: 10,
        optimizer: 'AdamW',
      },
      metrics: generateRunMetrics(count, isMillion),
    });
  }

  return runs;
}