import { useEffect, useMemo, useRef } from 'react';
import type { ZontSensor } from '../../utils/interfaces/zont-devices.interface';
import {
  type HeatingSeason,
  type ThresholdItem,
} from '../../services/getValues';
import { HEATING_TEMPERATURE_SENSOR } from '../../constants/mainConstants';
type Props = {
  title: string;
  sensor: ZontSensor;
  threshold: ThresholdItem;
  speechQueue: { enqueue: (text: string) => void };
  muted: boolean;
  heatingSeason?: HeatingSeason;
};
export const DevicesSensor: React.FC<Props> = ({
  title,
  sensor,
  threshold,
  speechQueue,
  muted,
  heatingSeason,
}) => {
  if (sensor.value === null || sensor.value === undefined) return null;

  const wasOutOfRange = useRef(false);

  const { value, isAboveMax, isOutOfRange } = useMemo(() => {
    const value = Number(sensor.value);
    const min = Number(threshold.min);
    const max = Number(threshold.max);

    return {
      value,
      isAboveMax: value > max,
      isOutOfRange: value < min || value > max,
    };
  }, [sensor.value, threshold.min, threshold.max]);
  
  const isHeatingSeason = useMemo(() => {
    if (!heatingSeason) return false;

    const now = new Date();
    const start = new Date(heatingSeason.heating_start_date);
    const end = new Date(heatingSeason.heating_end_date);

    return now >= start && now <= end;
  }, [heatingSeason]);
  useEffect(() => {
    if (muted) return;
    if (!isOutOfRange) {
      wasOutOfRange.current = false;
      return;
    }

    if (wasOutOfRange.current) return;
    if (
      sensor.name === HEATING_TEMPERATURE_SENSOR &&
      heatingSeason &&
      !isHeatingSeason
    ) {
      return;
    }
    const message = isAboveMax
      ? `Внимание! Датчик ${sensor.name}, объекта ${title} превысил верхний порог.`
      : `Внимание! Датчик ${sensor.name}, объекта ${title} опустился ниже нижнего порога.`;
    speechQueue.enqueue(message);
    wasOutOfRange.current = true;
  }, [
    isOutOfRange,
    isAboveMax,
    isHeatingSeason,
    muted,
    sensor.name,
    title,
    speechQueue,
    heatingSeason,
  ]);



  const showAlert =
    isOutOfRange &&
    !muted &&
    !(
      sensor.name === HEATING_TEMPERATURE_SENSOR &&
      heatingSeason &&
      !isHeatingSeason
    );
  return (
    <div className="sensor">
      <div>
        <div
          className={`sensor__value ${showAlert ? 'sensor__value--alert' : ''}`}
        >
          {value} {sensor.unit ?? ''}{' '}
        </div>{' '}
        <div className="sensor__label">{sensor.name}</div>{' '}
      </div>{' '}
    </div>
  );
};
