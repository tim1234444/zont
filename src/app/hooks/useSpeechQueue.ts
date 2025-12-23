import { useCallback, useRef } from 'react';

export function useSpeechQueue() {
  const queueRef = useRef<string[]>([]);
  const isSpeakingRef = useRef(false);
  const voices = window.speechSynthesis.getVoices();
  const voice = voices.find(
    (v) => v.lang === 'ru-RU' && v.name.includes('Google')
  );

  const speakNext = useCallback(() => {
    if (isSpeakingRef.current) return;
    if (queueRef.current.length === 0) return;

    const text = queueRef.current.shift();
    if (!text) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = voice || null;
    utterance.lang = 'ru-RU';
    utterance.rate = 1.3;
    utterance.pitch = 0.5;
    utterance.volume = 1;

    isSpeakingRef.current = true;

    utterance.onend = () => {
      isSpeakingRef.current = false;
      speakNext();
    };

    utterance.onerror = () => {
      isSpeakingRef.current = false;
      speakNext();
    };

    window.speechSynthesis.speak(utterance);
  }, []);

  const enqueue = useCallback(
    (text: string) => {
      if (!('speechSynthesis' in window)) return;

      queueRef.current.push(text);
      speakNext();
    },
    [speakNext]
  );

  const clearQueue = useCallback(() => {
    queueRef.current = [];
    window.speechSynthesis.cancel();
    isSpeakingRef.current = false;
  }, []);

  return {
    enqueue,
    clearQueue,
  };
}
