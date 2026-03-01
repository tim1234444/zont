import { createContext, useContext } from "react";
import { useTTSQueue } from "../hooks/useTTSQueue";


const TTSContext = createContext<{ speak: (text: string) => void } | null>(null);

export const TTSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const tts = useTTSQueue();
  return <TTSContext.Provider value={tts}>{children}</TTSContext.Provider>;
};

export const useTTS = () => {
  const ctx = useContext(TTSContext);
  if (!ctx) throw new Error("TTS context not found");
  return ctx;
};