import { useEffect, useState } from 'react';

interface CipherTextProps {
  holdDuration?: number;
  interval?: number;
  text: string;
}

const chars = '-_~`!@#$%^&*()+=[]{}|;:,.<>?';

function randomNoise(length: number) {
  return Array.from(
    { length },
    () => chars[Math.floor(Math.random() * chars.length)],
  ).join('');
}

export function CipherText({
  holdDuration = 6000,
  interval = 50,
  text,
}: CipherTextProps) {
  // Starts fully revealed so the first client render matches the server HTML
  const [frame, setFrame] = useState({ noise: '', revealed: text.length });

  useEffect(() => {
    let revealed = 0;
    let timer: ReturnType<typeof setTimeout>;

    const tick = () => {
      setFrame({ noise: randomNoise(text.length - revealed), revealed });

      if (revealed < text.length) {
        revealed++;
        timer = setTimeout(tick, interval);
      } else {
        revealed = 0;
        timer = setTimeout(tick, holdDuration);
      }
    };

    timer = setTimeout(tick, 0);

    return () => clearTimeout(timer);
  }, [text, interval, holdDuration]);

  return (
    <span>
      {text.slice(0, frame.revealed)}
      {frame.noise}
    </span>
  );
}
