import { useEffect } from 'react';
import type { Threshold } from '../../context/types';
import type { ZontSensor } from '../../utils/interfaces/zont-devices.interface';

type Props = {
  sensor: ZontSensor;
  threshold: Threshold;
  alarmRef: React.RefObject<HTMLAudioElement | null>;
  wasOutOfRange: React.RefObject<boolean>;
};

export const CardSensor: React.FC<Props> = ({
  sensor,
  threshold,
  alarmRef,
  wasOutOfRange,
}) => {
  if (sensor.value === null || sensor.value === undefined) return null;

  const value = Number(sensor.value);
  const min = Number(threshold.min);
  const max = Number(threshold.max);

  const isAboveMax = value > max;
  const isBelowMin = value < min;
  const isOutOfRange = isAboveMax || isBelowMin;

  useEffect(() => {
    if (!alarmRef.current) return;
   
    if (isOutOfRange && !wasOutOfRange.current) {
      console.log("Все впорядке")
      alarmRef.current?.play();
      wasOutOfRange.current = true;
    }

    if (!isOutOfRange && wasOutOfRange.current) {
      alarmRef.current?.pause();
      if (alarmRef.current) alarmRef.current.currentTime = 0;
      wasOutOfRange.current = false;
    }
  }, [isOutOfRange, alarmRef, wasOutOfRange]);

  return (
    <div className="sensor">
      <div>
        <div
          className={`sensor__value ${
            isOutOfRange ? 'sensor__value--alert' : ''
          }`}
        >
          {value} {sensor.unit ?? ''}
        </div>
        <div className="sensor__label">{sensor.name}</div>
      </div>
    </div>
  );
};
