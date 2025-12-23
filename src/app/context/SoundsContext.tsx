import { createContext, useState, type ReactNode } from 'react';

interface SoundContextProps {
  soundEnabled: boolean;
  setSoundEnabled: (value: boolean) => void;
}

export const SoundContext = createContext<SoundContextProps>({
  soundEnabled: false,
  setSoundEnabled: () => {},
});

export const SoundProvider = ({ children }: { children: ReactNode }) => {
  const [soundEnabled, setSoundEnabled] = useState(false);

  return (
    <SoundContext value={{ soundEnabled, setSoundEnabled }}>
      {children}
    </SoundContext>
  );
};
