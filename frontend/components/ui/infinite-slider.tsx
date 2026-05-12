'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

type InfiniteSliderProps = {
  children: React.ReactNode;
  gap?: number;
  duration?: number;
  durationOnHover?: number;
  speed?: number;
  speedOnHover?: number;
  direction?: 'horizontal' | 'vertical';
  reverse?: boolean;
  className?: string;
};

export function InfiniteSlider({
  children,
  gap = 16,
  duration,
  durationOnHover,
  speed,
  speedOnHover,
  direction = 'horizontal',
  reverse = false,
  className,
}: InfiniteSliderProps) {
  const baseDuration = duration ?? speed ?? 25;
  const hoverDuration = durationOnHover ?? speedOnHover;
  const animationName =
    direction === 'horizontal' ? 'infinite-slider-x' : 'infinite-slider-y';

  return (
    <div
      className={cn(
        'overflow-hidden [--slider-duration:25s] [--slider-hover-duration:var(--slider-duration)]',
        className
      )}
      style={
        {
          '--slider-duration': `${baseDuration}s`,
          '--slider-hover-duration': `${hoverDuration ?? baseDuration}s`,
        } as React.CSSProperties
      }
    >
      <div
        className={cn(
          'flex w-max motion-reduce:animate-none',
          hoverDuration && 'hover:[animation-duration:var(--slider-hover-duration)]',
          direction === 'vertical' && 'flex-col',
          reverse && '[animation-direction:reverse]'
        )}
        style={{
          animation: `${animationName} var(--slider-duration) linear infinite`,
          gap,
        }}
      >
        {children}
        {children}
      </div>

      <style jsx>{`
        @keyframes infinite-slider-x {
          from {
            transform: translate3d(0, 0, 0);
          }
          to {
            transform: translate3d(calc(-50% - ${gap / 2}px), 0, 0);
          }
        }

        @keyframes infinite-slider-y {
          from {
            transform: translate3d(0, 0, 0);
          }
          to {
            transform: translate3d(0, calc(-50% - ${gap / 2}px), 0);
          }
        }
      `}</style>
    </div>
  );
}
