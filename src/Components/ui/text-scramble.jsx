import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const defaultChars =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';

export function TextScramble({
  children,
  duration = 0.8,
  speed = 0.03,
  characterSet = defaultChars,
  className,
  as: Component = 'span',
  trigger = true,
  scrambleOnHover = true,
  onScrambleComplete,
  ...props
}) {
  const MotionComponent = motion.create(Component);
  const [displayText, setDisplayText] = useState(children);
  const [isAnimating, setIsAnimating] = useState(false);
  const [scrambleCount, setScrambleCount] = useState(0);
  const text = String(children || '');

  const scramble = () => {
    if (isAnimating) return;
    setIsAnimating(true);

    const steps = duration / speed;
    let step = 0;

    const interval = setInterval(() => {
      let scrambled = '';
      const progress = step / steps;

      for (let i = 0; i < text.length; i++) {
        if (text[i] === ' ') {
          scrambled += ' ';
          continue;
        }

        if (progress * text.length > i) {
          scrambled += text[i];
        } else {
          scrambled +=
            characterSet[Math.floor(Math.random() * characterSet.length)];
        }
      }

      setDisplayText(scrambled);
      step++;

      if (step > steps) {
        clearInterval(interval);
        setDisplayText(text);
        setIsAnimating(false);
        onScrambleComplete?.();
      }
    }, speed * 1000);
  };

  useEffect(() => {
    if (!trigger) return;
    scramble();
  }, [trigger, text, scrambleCount]);

  const handleMouseEnter = () => {
    if (scrambleOnHover && !isAnimating) {
      setScrambleCount((c) => c + 1);
    }
  };

  return (
    <MotionComponent 
      className={`inline-block ${className || ''}`}
      onMouseEnter={handleMouseEnter}
      whileInView={{ opacity: 1 }}
      onViewportEnter={() => {
        if (!isAnimating) setScrambleCount((c) => c + 1);
      }}
      viewport={{ once: false }}
      {...props}
    >
      {displayText}
    </MotionComponent>
  );
}
