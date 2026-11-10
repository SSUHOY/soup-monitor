import { describe, it, expect } from 'vitest';
import { cleanAndSortMetrics, downsampleMetrics, type CleanedPoint } from '../dataProcessor';
import { type DataPoint } from '../generateData';

describe('Truthful Data Processor (Requirements Verification)', () => {
  
  it('should preserve the outlier spike at every downsampling / zoom level', () => {
    const totalPoints = 1_000_000;
    const spikeIndex = 500_000;
    const spikeValue = 999.99;

    const rawData: CleanedPoint[] = Array.from({ length: totalPoints }, (_, i) => ({
      step: i,
      loss: i === spikeIndex ? spikeValue : 0.05,
      lr: 0.001,
      grad_norm: 1.0,
    }));

    const sampled1000 = downsampleMetrics(rawData, 1000);
    const sampled100 = downsampleMetrics(rawData, 100);

    const hasSpikeIn1000 = sampled1000.some((p) => p.loss === spikeValue);
    const hasSpikeIn100 = sampled100.some((p) => p.loss === spikeValue);

    expect(hasSpikeIn1000).toBe(true);
    expect(hasSpikeIn100).toBe(true);
  });

  it('should convert NaN and Infinity to null instead of 0 or smoothing them', () => {
    const dirtyData: DataPoint[] = [
      { step: 0, loss: 1.5, lr: 0.001, grad_norm: 1.0 },
      { step: 1, loss: NaN, lr: 0.001, grad_norm: 1.0 },
      { step: 2, loss: Infinity, lr: 0.001, grad_norm: 1.0 },
      { step: 3, loss: 0.8, lr: 0.001, grad_norm: 1.0 },
    ];

    const cleaned = cleanAndSortMetrics(dirtyData);

    expect(cleaned[1].loss).toBeNull();
    expect(cleaned[1].loss).not.toBe(0);
    expect(cleaned[2].loss).toBeNull();
    expect(cleaned[3].loss).toBe(0.8);
  });

  it('should sort unsorted steps and remove duplicate steps', () => {
    const unsortedData: DataPoint[] = [
      { step: 10, loss: 1.0, lr: 0.001, grad_norm: 1.0 },
      { step: 2, loss: 2.0, lr: 0.001, grad_norm: 1.0 },
      { step: 2, loss: 9.0, lr: 0.001, grad_norm: 1.0 },
      { step: 5, loss: 1.5, lr: 0.001, grad_norm: 1.0 },
    ];

    const cleaned = cleanAndSortMetrics(unsortedData);

    expect(cleaned.map((p) => p.step)).toEqual([2, 5, 10]);
    expect(cleaned).toHaveLength(3); // Дубликат удален
  });

  it('should match data boundaries for axis labels', () => {
    const rawData: CleanedPoint[] = [
      { step: 100, loss: 0.1, lr: 0.001, grad_norm: 0.5 },
      { step: 500, loss: 5.5, lr: 0.0005, grad_norm: 12.0 },
    ];

    const minLoss = Math.min(...rawData.map((p) => p.loss!));
    const maxLoss = Math.max(...rawData.map((p) => p.loss!));

    expect(minLoss).toBe(0.1);
    expect(maxLoss).toBe(5.5);
  });
});