import { useEffect, useMemo, useRef } from 'react';
import type { ZontSensor } from '../../utils/interfaces/zont-devices.interface';
import {
  type HeatingSeason,
  type ThresholdItem,
} from '../../services/getValues';
import { HEATING_TEMPERATURE_SENSOR } from '../../constants/mainConstants';
import { getIsHeatingSeason } from '../../utils/getIsHeatingSeason';
type Props = {
  title: string;
  sensor: ZontSensor;
  threshold: ThresholdItem;
  speak: (text: string) => void;
  muted: boolean;
  heatingSeason?: HeatingSeason;
  isReady: boolean;
};
export const DevicesSensor: React.FC<Props> = ({
  title,
  sensor,
  threshold,
  speak,
  muted,
  heatingSeason,
  isReady,
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

  const isHeatingSeason = useMemo(
    () => getIsHeatingSeason(heatingSeason),
    [heatingSeason]
  );
  useEffect(() => {
    if (muted || !isReady) return;
    if (!isOutOfRange) {
      wasOutOfRange.current = false;
      return;
    }

    if (wasOutOfRange.current) return;
    const isHeatingSensor = sensor.name === HEATING_TEMPERATURE_SENSOR;
    if (isHeatingSensor && heatingSeason && !isHeatingSeason) {
      wasOutOfRange.current = false;
      return;
    }
    const message = isAboveMax
      ? `Внимание! Датчик ${sensor.name} объекта ${title} превысил верхний порог.`
      : `Внимание! Датчик ${sensor.name} объекта ${title} опустился ниже нижнего порога.`;

    speak(message);
    wasOutOfRange.current = true;
  }, [
    isReady,
    isOutOfRange,
    isAboveMax,
    isHeatingSeason,
    muted,
    sensor.name,
    title,
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
