import React, { useRef } from 'react';
import './Card.scss';
import type {
  ZontDevice,
  ZontSensor,
} from '../../utils/interfaces/zont-devices.interface';
import alarmSound from '../../../assets/alarm.mp3';
import { CardSensor } from '../CardSensor/CardSensor';
import { useQuery } from '@tanstack/react-query';
import { fetchThresholdValues } from '../../services/getValues';
import { useSpeechQueue } from '../../hooks/useSpeechQueue';
type Props = {
  device: ZontDevice;
  title: string;
  sensors: ZontSensor[];
};

const Card: React.FC<Props> = ({ device, title, sensors }) => {
  const { data: thresholds } = useQuery({
    queryKey: ['thresholdValues'],
    queryFn: fetchThresholdValues,
  });

  const speechQueue = useSpeechQueue();

  const wasOutOfRange = useRef(false);

  const getDeviceStatus = () => {
    return device.online
      ? { icon: '🟢', label: 'На связи' }
      : { icon: '🔴', label: 'Оффлайн' };
  };

  const status = getDeviceStatus();

  return (
    <div className={`card  ${!device.online ? 'card--offline' : ''}`}>
      <div className="card__header">
        <h3>{title}</h3>
        <span className="status-icon" title={status.label}>
          {status.icon}
        </span>
      </div>

      <div className="card__sensors">
        {sensors.length > 0 ? (
          sensors.map((sensor, index) => {
            const threshold = thresholds?.find((t) => t.name === sensor.name);
            if (!threshold) return null;

            return (
              <CardSensor
                title={title}
                key={sensor.name ?? index}
                sensor={sensor}
                threshold={threshold}
                wasOutOfRange={wasOutOfRange}
                speechQueue={speechQueue}
              />
            );
          })
        ) : (
          <div className="sensor sensor--empty">—</div>
        )}
      </div>

      {!device.online && (
        <div className="card__offline-badge">Оффлайн (посл. данные)</div>
      )}
    </div>
  );
};

export default Card;
