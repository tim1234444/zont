import { useRef, useState } from 'react';
import './SoundPermissionModal.scss';
import alarmSound from '../../../assets/silent.wav';
import { toast } from 'sonner';
type Props = {
  soundEnabled: boolean;
  setSoundEnabled: React.Dispatch<React.SetStateAction<boolean>>
}
export default function SoundPermissionModal({soundEnabled, setSoundEnabled}: Props) {
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const enableSound = async () => {
    try {
      if (!audioRef.current) return;

      await audioRef.current.play();
      audioRef.current.pause();
      audioRef.current.currentTime = 0;

      setSoundEnabled(true);
    } catch (e) {
      toast.error('Не удалось включить звук');
    }
  };
  if (soundEnabled) return null;

  return (
    <>
      <audio ref={audioRef} src={alarmSound} preload="auto" />

      <div className="modal-backdrop">
        <div className="modal">
          <div className="modal-header">🔔 Звуковые уведомления</div>

          <div className="modal-body">
            <p>
              Для корректной работы диспетчерской системы необходимо включить
              звуковые уведомления.
            </p>
            <p className="modal-note">
              Без этого вы можете пропустить уведомления об аварийных событиях.
            </p>
          </div>

          <div className="modal-footer">
            <button className="btn-primary" onClick={enableSound}>
              Включить звук
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
