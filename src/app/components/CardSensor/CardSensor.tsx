import { useEffect } from 'react';
import type { ZontSensor } from '../../utils/interfaces/zont-devices.interface';
import type { ThresholdItem } from '../../services/getValues';

type Props = {
  title: string;
  sensor: ZontSensor;
  threshold: ThresholdItem;
  wasOutOfRange: React.RefObject<boolean>;
  speechQueue: {
    enqueue: (text: string) => void;
  };
};

export const CardSensor: React.FC<Props> = ({
  title,
  sensor,
  threshold,
  wasOutOfRange,
  speechQueue,
}) => {
  if (sensor.value === null || sensor.value === undefined) return null;

  const value = Number(sensor.value);
  const min = Number(threshold.min);
  const max = Number(threshold.max);

  const isAboveMax = value > max;
  const isBelowMin = value < min;
  const isOutOfRange = isAboveMax || isBelowMin;

  useEffect(() => {
    if (isOutOfRange && !wasOutOfRange.current) {
      const message = isAboveMax
        ? `Внимание! Датчик ${sensor.name}, объекта ${title} превысил верхний порог.`
        : `Внимание! Датчик ${sensor.name}, объекта ${title} опустился ниже нижнего порога.`;

      speechQueue.enqueue(message);

      wasOutOfRange.current = true;
    }
    if (!isOutOfRange && wasOutOfRange.current) {
      wasOutOfRange.current = false;
    }
  }, [isOutOfRange]);

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
