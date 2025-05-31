import React from 'react';

type OrbSize = 'small' | 'default' | 'large';

interface AIOrbProps {
  className?: string;
  size?: OrbSize;
}

export const AIOrb: React.FC<AIOrbProps> = ({ className = '', size = 'default' }) => {
  const sizeMap = {
    small: 80,
    default: 300,
    large: 600
  };

  const dimensions = sizeMap[size];

  return (
      <svg
          viewBox="0 0 400 400"
          xmlns="http://www.w3.org/2000/svg"
          width={dimensions}
          height={dimensions}
          className={className}
      >
        <defs>
          {/* Complex gradient with more color variation */}
          <radialGradient id="orbGradient" cx="50%" cy="40%" r="50%">
            <stop offset="0%" style={{ stopColor: '#93c5fd', stopOpacity: 1 }} />
            <stop offset="30%" style={{ stopColor: '#6366f1', stopOpacity: 1 }} />
            <stop offset="60%" style={{ stopColor: '#4338ca', stopOpacity: 0.9 }} />
            <stop offset="100%" style={{ stopColor: '#1e1b4b', stopOpacity: 0.8 }} />
          </radialGradient>

          {/* Inner neural activity gradient */}
          <radialGradient id="neuralGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" style={{ stopColor: '#8b5cf6', stopOpacity: 0.3 }} />
            <stop offset="50%" style={{ stopColor: '#6366f1', stopOpacity: 0.5 }} />
            <stop offset="100%" style={{ stopColor: '#3b82f6', stopOpacity: 0 }} />
          </radialGradient>

          {/* Thinking pulse gradient */}
          <radialGradient id="thinkPulse">
            <stop offset="0%" style={{ stopColor: '#a78bfa', stopOpacity: 0.8 }} />
            <stop offset="100%" style={{ stopColor: '#6366f1', stopOpacity: 0 }} />
          </radialGradient>

          {/* Simple glow filter */}
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Specular highlight for shine */}
          <radialGradient id="specular" cx="35%" cy="30%">
            <stop offset="0%" style={{ stopColor: '#ffffff', stopOpacity: 0.9 }} />
            <stop offset="20%" style={{ stopColor: '#e0e7ff', stopOpacity: 0.6 }} />
            <stop offset="50%" style={{ stopColor: '#c7d2fe', stopOpacity: 0.2 }} />
            <stop offset="100%" style={{ stopColor: '#818cf8', stopOpacity: 0 }} />
          </radialGradient>

          {/* Glossy overlay gradient */}
          <linearGradient id="gloss" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#ffffff', stopOpacity: 0.6 }} />
            <stop offset="30%" style={{ stopColor: '#e0e7ff', stopOpacity: 0.3 }} />
            <stop offset="70%" style={{ stopColor: '#818cf8', stopOpacity: 0.1 }} />
            <stop offset="100%" style={{ stopColor: '#1e1b4b', stopOpacity: 0.4 }} />
          </linearGradient>

        </defs>

        {/* Outer atmospheric layers */}
        <circle cx="200" cy="200" r="130" fill="url(#orbGradient)" opacity="0.2" filter="url(#glow)" />
        <circle cx="200" cy="200" r="110" fill="url(#orbGradient)" opacity="0.4" filter="url(#glow)" />

        {/* Main orb body */}
        <circle cx="200" cy="200" r="80" fill="url(#orbGradient)" />

        {/* Glossy overlay */}
        <circle cx="200" cy="200" r="80" fill="url(#gloss)" opacity="0.8" />

        {/* Neural activity layers */}
        <circle cx="200" cy="200" r="70" fill="url(#neuralGlow)" opacity="0.6" />


        {/* Internal energy nodes */}
        <g opacity="0.5">
          <circle cx="180" cy="180" r="4" fill="#a78bfa" opacity="0.8" />
          <circle cx="220" cy="190" r="3" fill="#818cf8" opacity="0.7" />
          <circle cx="200" cy="220" r="3.5" fill="#60a5fa" opacity="0.9" />
          <circle cx="190" cy="210" r="2.5" fill="#a78bfa" opacity="0.6" />
        </g>
      </svg>
  );
};