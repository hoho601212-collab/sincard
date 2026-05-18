'use client';

import GaugeComponent from 'react-gauge-component';

import { cn } from '@/lib/cn';

interface AnimatedCircularProgressBarProps {
  max?: number;
  min?: number;
  value: number;
  grade: string;
  color: string;
  className?: string;
}

export function AnimatedCircularProgressBar({
  max = 1000,
  min = 0,
  value = 0,
  grade,
  color,
  className,
}: AnimatedCircularProgressBarProps) {
  // 점수별 색상: 빨강 → 베이지 → 초록으로 자연스럽게 연결되는 20단계
  const scoreColors = [
    // 0-900 (빨강 구간): 13단계 - 진한 빨강에서 연한 빨강으로
    '#B91C1C',
    '#DC2626',
    '#E63946',
    '#EF4444',
    '#F25555',
    '#F56565',
    '#F87171',
    '#FA8181',
    '#FB8B8B',
    '#FC9595',
    '#FCA5A5',
    '#FDB5B5',
    '#FEC5C5',

    // 전환 구간: 2단계 - 연한 핑크에서 크림 베이지로
    '#FED7C9',
    '#E8E5C8',

    // 900-1000 (초록 구간): 5단계 - 연한 초록에서 진한 초록으로
    '#C5ECC5',
    '#A5E3A5',
    '#86EFAC',
    '#4ADE80',
    '#22C55E',
  ];

  return (
    <div className={cn('relative mx-auto w-full max-w-[350px]', className)}>
      <GaugeComponent
        value={value}
        minValue={min}
        maxValue={max}
        type='radial'
        labels={{
          valueLabel: {
            hide: true,
          },
          tickLabels: {
            hideMinMax: true,
            defaultTickValueConfig: {
              hide: true,
            },
          },
        }}
        arc={{
          colorArray: scoreColors,
          subArcs: [
            { limit: 900 }, // 빨강: 0-900 (90%)
            {}, // 초록: 900-1000 (10%)
          ],
          nbSubArcs: 20, // 20단계 그라데이션
          padding: 0.04,
          width: 0.15,
          cornerRadius: 8,
        }}
        pointer={{
          type: 'needle',
          elastic: false,
          animationDelay: 0,
          animationDuration: 0,
          color: '#6B7280',
          length: 0.8,
          width: 15,
        }}
      />

      {/* 점수 표시 */}
      <div className='mt-4 text-center'>
        <div className='text-5xl font-bold text-gray-900 sm:text-6xl'>{value}</div>
        <div className='mt-1 text-sm text-gray-400'>/ 1000점</div>
        <div
          className='mt-3 inline-block rounded-full px-5 py-1.5 text-sm font-semibold'
          style={{ backgroundColor: color, color: 'white' }}
        >
          {grade}
        </div>
      </div>
    </div>
  );
}
