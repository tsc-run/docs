import React from 'react';

type OrbSize = 'small' | 'default' | 'large';

interface AIOrbProps {
  className?: string;
  size?: OrbSize;
}

export const AIOrb = ({ className = '', size = 'default' }: AIOrbProps) => {
  const sizeClasses: Record<OrbSize, string> = {
    small: 'w-16 h-16',
    default: 'w-[120px] h-[120px]',
    large: 'w-36 h-36'
  };

  const orbSizes: Record<OrbSize, string> = {
    small: 'w-10 h-10',
    default: 'w-20 h-20',
    large: 'w-24 h-24'
  };

  const ringSizes: Record<OrbSize, { outer: string; inner: string }> = {
    small: { outer: 'w-14 h-14', inner: 'w-16 h-16' },
    default: { outer: 'w-[100px] h-[100px]', inner: 'w-[110px] h-[110px]' },
    large: { outer: 'w-28 h-28', inner: 'w-32 h-32' }
  };

  return (
    <div className={`relative inline-flex items-center justify-center ${sizeClasses[size]} ${className}`}>
      <style jsx>{`
        @keyframes gentleFloat {
          0%, 100% {
            transform: translateY(0px) scale(1);
          }
          50% {
            transform: translateY(-8px) scale(1.02);
          }
        }

        @keyframes codePulse {
          0% {
            box-shadow: 
              0 0 20px rgba(49, 120, 198, 0.4),
              0 0 40px rgba(49, 120, 198, 0.2),
              inset 0 0 20px rgba(255, 255, 255, 0.1),
              inset -2px -2px 8px rgba(0, 0, 0, 0.3);
          }
          100% {
            box-shadow: 
              0 0 30px rgba(49, 120, 198, 0.6),
              0 0 60px rgba(49, 120, 198, 0.3),
              inset 0 0 25px rgba(255, 255, 255, 0.15),
              inset -2px -2px 8px rgba(0, 0, 0, 0.3);
          }
        }

        @keyframes frameRotate {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        @keyframes highlight {
          0%, 100% {
            opacity: 0.4;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.1);
          }
        }

        @keyframes orbit {
          0% {
            transform: rotate(0deg) translateX(45px) rotate(0deg);
            opacity: 0.7;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: rotate(360deg) translateX(45px) rotate(-360deg);
            opacity: 0.7;
          }
        }

        @keyframes typeExpand {
          0% {
            transform: translate(-50%, -50%) scale(0.9);
            opacity: 0.6;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.05);
            opacity: 0.3;
          }
          100% {
            transform: translate(-50%, -50%) scale(1.2);
            opacity: 0;
          }
        }

        @keyframes dataFlow {
          0% {
            transform: scale(0.5);
            opacity: 0;
          }
          50% {
            transform: scale(1.5);
            opacity: 1;
          }
          100% {
            transform: scale(0.5);
            opacity: 0;
          }
        }

        .ai-orb {
          background: linear-gradient(135deg, 
            #3178c6 0%,
            #2b6cb0 25%,
            #1e40af 50%,
            #1e3a8a 75%,
            #1e293b 100%);
          animation: gentleFloat 4s ease-in-out infinite, codePulse 2s ease-in-out infinite alternate;
          backdrop-filter: blur(1px);
        }

        .ai-orb::before {
          content: '';
          position: absolute;
          top: -1px;
          left: -1px;
          right: -1px;
          bottom: -1px;
          border-radius: 50%;
          background: linear-gradient(45deg, 
            rgba(49, 120, 198, 0.8),
            rgba(30, 64, 175, 0.6),
            rgba(30, 58, 138, 0.8));
          animation: frameRotate 12s linear infinite;
          z-index: -1;
          filter: blur(2px);
        }

        .ai-orb::after {
          content: '';
          position: absolute;
          top: 20%;
          left: 25%;
          width: 25%;
          height: 25%;
          background: radial-gradient(circle, 
            rgba(255, 255, 255, 0.9) 0%,
            rgba(255, 255, 255, 0.4) 50%,
            transparent 80%);
          border-radius: 50%;
          animation: highlight 3s ease-in-out infinite;
        }

        .particle {
          width: 2px;
          height: 2px;
          background: #3178c6;
          box-shadow: 0 0 6px rgba(49, 120, 198, 0.8);
          opacity: 0.7;
        }

        .particle:nth-child(1) {
          top: 15%;
          left: 85%;
          animation: orbit 8s linear infinite;
        }

        .particle:nth-child(2) {
          top: 75%;
          left: 10%;
          animation: orbit 10s linear infinite reverse;
        }

        .particle:nth-child(3) {
          top: 30%;
          left: 5%;
          animation: orbit 12s linear infinite;
        }

        .particle:nth-child(4) {
          top: 80%;
          left: 80%;
          animation: orbit 9s linear infinite reverse;
        }

        .type-ring {
          border: 1px solid rgba(49, 120, 198, 0.3);
          animation: typeExpand 6s ease-in-out infinite;
        }

        .type-ring:nth-child(2) {
          border-color: rgba(49, 120, 198, 0.2);
          animation-delay: -2s;
        }

        .data-stream {
          width: 1px;
          height: 1px;
          background: rgba(49, 120, 198, 0.6);
          box-shadow: 0 0 4px rgba(49, 120, 198, 0.8);
        }

        .data-stream:nth-child(1) {
          top: 10%;
          left: 50%;
          animation: dataFlow 3s ease-in-out infinite;
        }

        .data-stream:nth-child(2) {
          top: 50%;
          left: 90%;
          animation: dataFlow 3s ease-in-out infinite;
          animation-delay: -1s;
        }

        .data-stream:nth-child(3) {
          top: 90%;
          left: 30%;
          animation: dataFlow 3s ease-in-out infinite;
          animation-delay: -2s;
        }

        .orb-elements * {
          will-change: transform, opacity;
          backface-visibility: hidden;
          perspective: 1000px;
        }
      `}</style>

      <div className="orb-elements">
        {/* Type rings */}
        <div className={`type-ring absolute rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${ringSizes[size].outer}`} />
        <div className={`type-ring absolute rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${ringSizes[size].inner}`} />

        {/* Main orb */}
        <div className={`ai-orb relative rounded-full ${orbSizes[size]}`} />

        {/* Code particles */}
        <div className="absolute w-full h-full pointer-events-none">
          <div className="particle absolute rounded-full" />
          <div className="particle absolute rounded-full" />
          <div className="particle absolute rounded-full" />
          <div className="particle absolute rounded-full" />
        </div>

        {/* Data streams */}
        <div className="absolute w-full h-full pointer-events-none">
          <div className="data-stream absolute rounded-full" />
          <div className="data-stream absolute rounded-full" />
          <div className="data-stream absolute rounded-full" />
        </div>
      </div>
    </div>
  );
};

// Example usage component
const ExampleUsage = () => {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center gap-8 font-mono">
      {/* Logo with AI Orb */}
      <div className="flex items-center gap-4">
        <h1 className="text-4xl font-bold text-white">MyFramework</h1>
        <AIOrb />
      </div>

      {/* Different sizes */}
      <div className="flex flex-col items-center gap-6">
        <div className="flex items-center gap-2">
          <span className="text-white text-sm">Small</span>
          <AIOrb size="small" />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-white text-sm">Default</span>
          <AIOrb size="default" />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-white text-sm">Large</span>
          <AIOrb size="large" />
        </div>
      </div>
    </div>
  );
};

export default ExampleUsage;