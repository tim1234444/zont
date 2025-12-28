import { useCallback, useState } from 'react';

const STORAGE_KEY = 'notificationsMuted';

type MutedMap = Record<string, boolean>;

function getMutedMap(): MutedMap {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
}

function saveMutedMap(map: MutedMap) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
}

export function useNotificationsMute(title: string) {
  const [muted, setMutedState] = useState<boolean>(() => {
    return getMutedMap()[title] ?? false;
  });

  const toggle = useCallback(
    (value: boolean) => {
      setMutedState(value);

      const map = getMutedMap();
      map[title] = value;
      saveMutedMap(map);
    },
    [title]
  );

  return {
    muted,
    toggle,
  };
}
