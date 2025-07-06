import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ConfettiParticle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  velocity: { x: number; y: number };
  rotation: number;
  rotationSpeed: number;
}

interface ConfettiCelebrationProps {
  isActive: boolean;
  duration?: number;
  particleCount?: number;
  colors?: string[];
  onComplete?: () => void;
}

const defaultColors = [
  "#FFD700", // Gold
  "#FF6B6B", // Red
  "#4ECDC4", // Teal
  "#45B7D1", // Blue
  "#96CEB4", // Green
  "#FFEAA7", // Yellow
  "#DDA0DD", // Plum
  "#98D8C8", // Mint
];

export default function ConfettiCelebration({
  isActive,
  duration = 3000,
  particleCount = 50,
  colors = defaultColors,
  onComplete
}: ConfettiCelebrationProps) {
  const [particles, setParticles] = useState<ConfettiParticle[]>([]);

  useEffect(() => {
    if (isActive) {
      // Create particles
      const newParticles: ConfettiParticle[] = [];
      
      for (let i = 0; i < particleCount; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * window.innerWidth,
          y: -20,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: Math.random() * 8 + 4,
          velocity: {
            x: (Math.random() - 0.5) * 8,
            y: Math.random() * 3 + 2,
          },
          rotation: Math.random() * 360,
          rotationSpeed: (Math.random() - 0.5) * 10,
        });
      }
      
      setParticles(newParticles);

      // Clean up after duration
      const timer = setTimeout(() => {
        setParticles([]);
        onComplete?.();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isActive, duration, particleCount, colors, onComplete]);

  return (
    <AnimatePresence>
      {isActive && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              initial={{
                x: particle.x,
                y: particle.y,
                rotate: particle.rotation,
                opacity: 1,
              }}
              animate={{
                y: window.innerHeight + 50,
                x: particle.x + particle.velocity.x * 100,
                rotate: particle.rotation + particle.rotationSpeed * 100,
                opacity: [1, 1, 0.8, 0],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                ease: "easeOut",
              }}
              className="absolute"
              style={{
                width: particle.size,
                height: particle.size,
                backgroundColor: particle.color,
                borderRadius: Math.random() > 0.5 ? "50%" : "0%",
              }}
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  );
}

// Fireworks celebration component
interface FireworksProps {
  isActive: boolean;
  onComplete?: () => void;
}

export function FireworksCelebration({ isActive, onComplete }: FireworksProps) {
  const [bursts, setBursts] = useState<Array<{ id: number; x: number; y: number; color: string }>>([]);

  useEffect(() => {
    if (isActive) {
      const burstCount = 5;
      const newBursts = [];

      for (let i = 0; i < burstCount; i++) {
        setTimeout(() => {
          const burst = {
            id: Date.now() + i,
            x: Math.random() * window.innerWidth,
            y: Math.random() * (window.innerHeight * 0.6) + window.innerHeight * 0.2,
            color: defaultColors[Math.floor(Math.random() * defaultColors.length)]
          };
          
          setBursts(prev => [...prev, burst]);
          
          // Remove burst after animation
          setTimeout(() => {
            setBursts(prev => prev.filter(b => b.id !== burst.id));
          }, 1500);
        }, i * 300);
      }

      // Complete after all bursts
      const timer = setTimeout(() => {
        onComplete?.();
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [isActive, onComplete]);

  return (
    <AnimatePresence>
      {isActive && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {bursts.map((burst) => (
            <div key={burst.id} className="absolute" style={{ left: burst.x, top: burst.y }}>
              {/* Create radiating particles */}
              {Array.from({ length: 12 }).map((_, i) => {
                const angle = (i * 30) * (Math.PI / 180);
                const distance = 60 + Math.random() * 40;
                
                return (
                  <motion.div
                    key={i}
                    initial={{ x: 0, y: 0, opacity: 1 }}
                    animate={{
                      x: Math.cos(angle) * distance,
                      y: Math.sin(angle) * distance,
                      opacity: 0,
                    }}
                    transition={{
                      duration: 1.5,
                      ease: "easeOut",
                    }}
                    className="absolute w-2 h-2 rounded-full"
                    style={{ backgroundColor: burst.color }}
                  />
                );
              })}
              
              {/* Central flash */}
              <motion.div
                initial={{ scale: 0, opacity: 1 }}
                animate={{ scale: [0, 3, 0], opacity: [1, 0.8, 0] }}
                transition={{ duration: 0.8 }}
                className="absolute w-4 h-4 rounded-full"
                style={{ backgroundColor: burst.color }}
              />
            </div>
          ))}
        </div>
      )}
    </AnimatePresence>
  );
}

// Combined celebration effect
interface CelebrationEffectProps {
  type: 'confetti' | 'fireworks' | 'both';
  isActive: boolean;
  onComplete?: () => void;
}

export function CelebrationEffect({ type, isActive, onComplete }: CelebrationEffectProps) {
  const [showConfetti, setShowConfetti] = useState(false);
  const [showFireworks, setShowFireworks] = useState(false);
  const [completedEffects, setCompletedEffects] = useState(0);

  useEffect(() => {
    if (isActive) {
      setCompletedEffects(0);
      
      if (type === 'confetti' || type === 'both') {
        setShowConfetti(true);
      }
      
      if (type === 'fireworks' || type === 'both') {
        setShowFireworks(true);
      }
    } else {
      setShowConfetti(false);
      setShowFireworks(false);
    }
  }, [isActive, type]);

  const handleEffectComplete = () => {
    const newCompleted = completedEffects + 1;
    setCompletedEffects(newCompleted);
    
    const expectedEffects = (
      (type === 'confetti' || type === 'both' ? 1 : 0) +
      (type === 'fireworks' || type === 'both' ? 1 : 0)
    );
    
    if (newCompleted >= expectedEffects) {
      onComplete?.();
    }
  };

  return (
    <>
      {showConfetti && (
        <ConfettiCelebration
          isActive={showConfetti}
          onComplete={() => {
            setShowConfetti(false);
            handleEffectComplete();
          }}
        />
      )}
      
      {showFireworks && (
        <FireworksCelebration
          isActive={showFireworks}
          onComplete={() => {
            setShowFireworks(false);
            handleEffectComplete();
          }}
        />
      )}
    </>
  );
}