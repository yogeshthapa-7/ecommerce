import React, { useState, useEffect, useRef, HTMLAttributes } from 'react';

// A simple utility for conditional class names
const cn = (...classes: (string | undefined | null | false)[]) => {
  return classes.filter(Boolean).join(' ');
}

// Define the type for a single gallery item
export interface GalleryItem {
  common: string;
  photo: {
    url: string; 
    text: string;
    pos?: string;
  };
}

// Define the props for the CircularGallery component
interface CircularGalleryProps extends HTMLAttributes<HTMLDivElement> {
  items: GalleryItem[];
  /** Controls how far the items are from the center. */
  radius?: number;
}

const CircularGallery = React.forwardRef<HTMLDivElement, CircularGalleryProps>(
  ({ items, className, radius = 450, ...props }, ref) => {
    const [rotation, setRotation] = useState(0);

    const rotateLeft = () => {
      const anglePerItem = 360 / items.length;
      setRotation(prev => prev + anglePerItem);
    };

    const rotateRight = () => {
      const anglePerItem = 360 / items.length;
      setRotation(prev => prev - anglePerItem);
    };

    const anglePerItem = 360 / items.length;
    
  return (
    <div
      ref={ref}
      role="region"
      aria-label="Circular 3D Gallery"
      className={cn("relative w-full h-full flex flex-col items-center justify-center", className)}
      style={{ perspective: '2000px' }}
      {...props}
    >
       <div
        className="relative w-full flex-1 flex items-center justify-center"
        style={{
          transform: `rotateY(${rotation}deg)`,
          transformStyle: 'preserve-3d',
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          transition: 'transform 0.4s ease-out',
        }}
      >
          {items.map((item, i) => {
            const itemAngle = i * anglePerItem;
            const totalRotation = rotation % 360;
            const relativeAngle = (itemAngle + totalRotation + 360) % 360;
            const normalizedAngle = Math.abs(relativeAngle > 180 ? 360 - relativeAngle : relativeAngle);
            const opacity = Math.max(0.3, 1 - (normalizedAngle / 180));

            return (
              <div
                key={item.photo.url} 
                role="group"
                aria-label={item.common}
                className="absolute w-[280px] h-[360px]"
                style={{
                  transform: `rotateY(${itemAngle}deg) translateZ(${radius}px)`,
                  left: '50%',
                  top: '50%',
                  marginLeft: '-140px',
                  marginTop: '-180px',
                  opacity: opacity,
                  transition: 'opacity 0.3s linear',
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                  willChange: 'opacity',
                }}
              >
                <div className="relative w-full h-full rounded-lg shadow-2xl overflow-hidden group border border-border bg-card/70 dark:bg-card/30 backdrop-blur-lg">
                  <img
                    src={item.photo.url}
                    alt={item.photo.text}
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{ objectPosition: item.photo.pos || 'center' }}
                  />
                  {/* Replaced text-primary-foreground with text-white for consistent color */}
                  <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/90 to-transparent text-white">
                    <h2 className="text-xl font-bold">{item.common}</h2>
                    <p className="text-sm italic text-gray-300 mb-1">{item.binomial}</p>
                    <p className="text-xs opacity-90 mb-1">{item.photo.text}</p>
                    <p className="text-xs font-semibold text-cyan-400">{item.photo.by}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      
      {/* Navigation Buttons */}
      <div className="flex gap-4 mt-4 z-10 pb-4">
        <button 
          onClick={rotateLeft}
          className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white flex items-center justify-center transition-all hover:scale-105 active:scale-95"
        >
          ←
        </button>
        <button 
          onClick={rotateRight}
          className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white flex items-center justify-center transition-all hover:scale-105 active:scale-95"
        >
          →
        </button>
      </div>
    </div>
  );
  }
);

CircularGallery.displayName = 'CircularGallery';

export { CircularGallery };