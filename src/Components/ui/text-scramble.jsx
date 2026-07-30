import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

const defaultChars =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

export function TextScramble({
  children,
  duration = 0.8,
  speed = 0.04,
  characterSet = defaultChars,
  className,
  as: Component = 'span',
  trigger = true,
  onScrambleComplete,
  ...props
}) {
  const MotionComponent = motion.create(Component);
  const [displayText, setDisplayText] = useState(children);
  const hasScrambledRef = useRef(false);
  const text = String(children || '');

  const scramble = () => {
    if (hasScrambledRef.current) return;
    hasScrambledRef.current = true;

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
        onScrambleComplete?.();
      }
    }, speed * 1000);
  };

  useEffect(() => {
    if (trigger && !hasScrambledRef.current) {
      scramble();
    }
  }, [trigger, text]);

  return (
    <MotionComponent className={`inline-block ${className || ''}`} {...props}>
      {displayText}
    </MotionComponent>
  );
}
