"use client";

import React, { useEffect, useState } from "react";

const BarGraph = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        const data = await res.json();
        setCategories(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const maxProducts =
    categories.length > 0 ? Math.max(...categories.map((c) => c.products)) : 1;
  const totalProducts = categories.reduce((sum, cat) => sum + cat.products, 0);

  if (isLoading) {
    return (
      <div className="w-full mx-auto p-8 bg-black rounded-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-orange-600/5"></div>
        <div className="relative animate-pulse space-y-6">
          <div className="h-8 bg-white/10 rounded-lg w-2/5"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-white/10 rounded w-1/3"></div>
                <div className="h-10 bg-white/10 rounded-lg"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto p-8 bg-black rounded-2xl relative overflow-hidden shadow-2xl">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-orange-600/5"></div>
      <div className="absolute top-0 right-0 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/5 rounded-full blur-3xl"></div>
      
      {/* Noise Texture */}
      <div className="absolute inset-0 opacity-[0.015]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat',
      }}></div>

      <div className="relative z-10">
        {/* Header Section */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-1 h-6 bg-gradient-to-b from-orange-500 to-orange-600 rounded-full"></div>
              <h2 className="text-3xl font-black text-white tracking-tighter" style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif" }}>
                CATEGORY PERFORMANCE
              </h2>
            </div>
            <p className="text-zinc-400 text-xs font-medium tracking-wide ml-4 uppercase">
              Product Distribution Analysis
            </p>
          </div>
          
          {/* Total Stats Badge */}
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-xl px-5 py-3 border border-white/10">
            <p className="text-zinc-500 text-xs uppercase font-bold tracking-wider mb-0.5">Total Portfolio</p>
            <p className="text-white text-2xl font-black">{totalProducts}</p>
          </div>
        </div>

        {/* Chart Grid */}
        <div className="space-y-5">
          {categories.map((category, index) => {
            const percentage = (category.products / maxProducts) * 100;
            const isHovered = hoveredIndex === index;
            
            return (
              <div
                key={category.id}
                className="group relative"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                style={{
                  animation: `fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.08}s both`,
                }}
              >
                {/* Category Header */}
                <div className="flex justify-between items-baseline mb-2">
                  <div className="flex items-center gap-2.5">
                    <span className="text-white font-black text-base uppercase tracking-wider" style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif" }}>
                      {category.name}
                    </span>
                    {isHovered && (
                      <span className="text-orange-500 text-xs font-bold uppercase tracking-widest animate-pulse">
                        ●
                      </span>
                    )}
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-white text-2xl font-black tabular-nums">
                      {category.products}
                    </span>
                    <span className="text-zinc-600 text-xs font-bold uppercase tracking-wider">
                      SKUs
                    </span>
                  </div>
                </div>

                {/* Bar Container */}
                <div className="relative">
                  {/* Background Track */}
                  <div className="relative h-10 bg-white/5 rounded-lg overflow-hidden backdrop-blur-sm border border-white/10">
                    {/* Progress Bar */}
                    <div
                      className={`absolute top-0 left-0 h-full transition-all duration-700 ease-out ${
                        isHovered ? 'scale-y-105' : 'scale-y-100'
                      }`}
                      style={{
                        width: `${percentage}%`,
                        transformOrigin: 'left center',
                        animation: `slideBar 1s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.08}s both`,
                      }}
                    >
                      {/* Gradient Fill */}
                      <div className={`absolute inset-0 transition-all duration-500 ${
                        isHovered 
                          ? 'bg-gradient-to-r from-orange-600 via-orange-500 to-orange-400' 
                          : 'bg-gradient-to-r from-white via-zinc-200 to-zinc-300'
                      }`}>
                        {/* Shine Effect */}
                        <div 
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
                          style={{
                            animation: isHovered ? 'shine 1.5s ease-in-out infinite' : 'none',
                          }}
                        ></div>
                        
                        {/* Top Highlight */}
                        <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-white/30 to-transparent"></div>
                      </div>

                      {/* Pattern Overlay */}
                      <div className="absolute inset-0 opacity-10" style={{
                        backgroundImage: `repeating-linear-gradient(
                          45deg,
                          transparent,
                          transparent 10px,
                          rgba(255,255,255,0.1) 10px,
                          rgba(255,255,255,0.1) 20px
                        )`,
                      }}></div>
                    </div>

                    {/* Percentage Label */}
                    <div className="absolute inset-0 flex items-center justify-end pr-4">
                      <div className={`font-black text-xs transition-all duration-300 ${
                        isHovered ? 'text-white scale-110' : 'text-black/60'
                      }`}>
                        {Math.round(percentage)}%
                      </div>
                    </div>

                    {/* Glow Effect */}
                    {isHovered && (
                      <div className="absolute inset-0 rounded-lg" style={{
                        boxShadow: '0 0 20px rgba(249, 115, 22, 0.4), inset 0 0 15px rgba(249, 115, 22, 0.1)',
                      }}></div>
                    )}
                  </div>

                  {/* Rank Indicator */}
                  <div className={`absolute -left-10 top-1/2 -translate-y-1/2 text-xl font-black transition-all duration-300 ${
                    isHovered ? 'text-orange-500 scale-125' : 'text-white/20'
                  }`} style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif" }}>
                    {String(index + 1).padStart(2, '0')}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Stats Grid */}
        <div className="mt-8 pt-6 border-t border-white/10">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-300">
              <p className="text-zinc-500 text-xs uppercase font-bold tracking-wider mb-1">Categories</p>
              <p className="text-white text-2xl font-black">{categories.length}</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-300">
              <p className="text-zinc-500 text-xs uppercase font-bold tracking-wider mb-1">Average</p>
              <p className="text-white text-2xl font-black">{Math.round(totalProducts / categories.length)}</p>
            </div>
            <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/10 backdrop-blur-sm rounded-xl p-4 border border-orange-500/20 hover:border-orange-500/40 transition-all duration-300">
              <p className="text-orange-300 text-xs uppercase font-bold tracking-wider mb-1">Top Category</p>
              <p className="text-white text-2xl font-black">{maxProducts}</p>
            </div>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideBar {
          from {
            width: 0;
          }
        }

        @keyframes shine {
          0% {
            transform: translateX(-100%) skewX(-15deg);
          }
          50% {
            transform: translateX(100%) skewX(-15deg);
          }
          100% {
            transform: translateX(100%) skewX(-15deg);
          }
        }
      `}</style>
    </div>
  );
};

export default BarGraph;