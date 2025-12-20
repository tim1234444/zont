import React, { useRef } from 'react';
import './Card.scss';
import type {
  ZontDevice,
  ZontSensor,
} from '../../utils/interfaces/zont-devices.interface';
import { useAppState } from '../../context/useAppState';
import alarmSound from '../../../assets/alarm.mp3';
import { CardSensor } from '../CardSensor/CardSensor';
interface CardProps {
  device: ZontDevice;
  title: string;
  sensors: ZontSensor[];
}

const Card: React.FC<CardProps> = ({ device, title, sensors }) => {
  const { state } = useAppState();

  const alarmRef = useRef<HTMLAudioElement | null>(null);
  if (!alarmRef.current) {
    alarmRef.current = new Audio(alarmSound);
    alarmRef.current.loop = false;
  }
  
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
            const threshold = state.thresholds.find(
              (t) => t.name === sensor.name
            );
            if (!threshold) return null;

            return (
              <CardSensor
                key={sensor.name ?? index}
                sensor={sensor}
                threshold={threshold}
                alarmRef={alarmRef}
                wasOutOfRange={wasOutOfRange}
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
