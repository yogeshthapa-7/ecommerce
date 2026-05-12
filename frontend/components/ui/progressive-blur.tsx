'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export const GRADIENT_ANGLES = {
  top: 0,
  right: 90,
  bottom: 180,
  left: 270,
};

export type ProgressiveBlurProps = {
  direction?: keyof typeof GRADIENT_ANGLES;
  blurLayers?: number;
  className?: string;
  blurIntensity?: number;
} & React.HTMLAttributes<HTMLDivElement>;

export function ProgressiveBlur({
  direction = 'bottom',
  blurLayers = 4,
  className,
  blurIntensity = 0.25,
  ...props
}: ProgressiveBlurProps) {
  const layers = Math.min(Math.max(blurLayers, 2), 5);
  const segmentSize = 1 / (layers + 1);
  const angle = GRADIENT_ANGLES[direction];

  return (
    <div className={cn('relative', className)} {...props}>
      {Array.from({ length: layers }).map((_, index) => {
        const gradientStops = [
          index * segmentSize,
          (index + 1) * segmentSize,
          (index + 2) * segmentSize,
          (index + 3) * segmentSize,
        ].map(
          (pos, posIndex) =>
            `rgba(255, 255, 255, ${posIndex === 1 || posIndex === 2 ? 1 : 0}) ${pos * 100}%`
        );

        const gradient = `linear-gradient(${angle}deg, ${gradientStops.join(
          ', '
        )})`;

        return (
          <div
            key={index}
            className="pointer-events-none absolute inset-0 rounded-[inherit]"
            style={{
              maskImage: gradient,
              WebkitMaskImage: gradient,
              backdropFilter: `blur(${index * blurIntensity}px)`,
            }}
          />
        );
      })}
    </div>
  );
}
