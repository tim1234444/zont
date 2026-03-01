import { useRef, useEffect } from 'react';

export function useTTSQueue() {
  const lastRequestTime = useRef(0);
  const queue = useRef<string[]>([]);
  const isPlaying = useRef(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playNext = async () => {
    

    if (isPlaying.current) return;

    if (queue.current.length === 0) {
      isPlaying.current = false;
      return;
    }

    

    const text = queue.current.shift()!;
    isPlaying.current = true;

    try {
      const now = Date.now();
      const diff = now - lastRequestTime.current;

      if (diff < 1000) {
        await new Promise((res) => setTimeout(res, 1000 - diff));
      }

      lastRequestTime.current = Date.now();
      const response = await fetch('https://zont-gresk.ru/api/tts.php', {
        method: 'POST',
        body: new URLSearchParams({ text }),
      });

      if (!response.ok) {
        throw new Error('TTS request failed');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      const audio = new Audio(url);
      audioRef.current = audio;

      audio.onended = async () => {
        URL.revokeObjectURL(url);
        isPlaying.current = false;
        playNext();
      };
  
      await audio.play();

    } catch (error) {
      isPlaying.current = false;
      playNext();
    }
  };

  const speak = (text: string) => {
    queue.current.push(text);

    if (!isPlaying.current) {
      playNext();
    }
  };

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
        audioRef.current = null;
      }
      queue.current = [];
    };
  }, []);

  return { speak };
}
