import './DevicesCard.scss';
import type {
  ZontDevice,
  ZontSensor,
} from '../../utils/interfaces/zont-devices.interface';
import { DevicesSensor } from '../DevicesSensor/DevicesSensor';
import { useNotificationsMute } from '../../hooks/useNotificationsMute';
import type { HeatingSeason, ThresholdItem } from '../../services/getValues';
import { useRef, useEffect } from 'react';
import { useTTS } from '../../services/TTSProvider.tsx';
import { useMaintenance } from '../../hooks/useMaintenance.ts';
type Props = {
  device: ZontDevice;
  title: string;
  sensors: ZontSensor[];
  thresholds: ThresholdItem[];
  heatingSeason?: HeatingSeason;
};
const DevicesCard: React.FC<Props> = ({
  device,
  title,
  sensors,
  thresholds,
  heatingSeason,
}) => {
  // Получение информации о том включены ли уведомления у карточки
  const { muted, toggle } = useNotificationsMute(title);
  // Хук для звуковых уведомлений
  const { speak } = useTTS();
  // Хук для проверки и получения статуса профилактики
  const {
    maintenance,
    isLoading: maintenanceLoading,
    toggle: toggleMaintenance,
  } = useMaintenance(title);
  // Флаг готовности устройства (не в состоянии загрузки профилактики)
  const isReady = !maintenanceLoading;

  const status = device.online
    ? { icon: '🟢', label: 'На связи' }
    : { icon: '🔴', label: 'Оффлайн' };

  const prevOnlineRef = useRef(device.online);

  useEffect(() => {
    if (!isReady) return;

    if (!muted && !maintenance) {
      const prevOnline = prevOnlineRef.current;

      if (prevOnline !== device.online) {
        const message = device.online
          ? `Устройство, ${title} снова на связи.`
          : `Внимание! Устройство, ${title} оффлайн.`;

        speak(message);
      }
    }

    prevOnlineRef.current = device.online;
  }, [device.online, muted, isReady, title, maintenance]);

  return (
    <div
      className={`card ${!device.online ? 'card--offline' : ''} ${muted ? 'card--disabled' : ''} ${maintenance ? 'card--maintenance' : ''}`}
    >
      <label className="card__checkbox">
        <input
          type="checkbox"
          checked={muted}
          onChange={(e) => toggle(e.target.checked)}
        />
        <span className="card__checkmark"></span>
        <span className="card__checkbox-label">Отключить уведомления</span>
      </label>

      <label className="card__checkbox card__checkbox--maintenance">
        <input
          type="checkbox"
          checked={maintenance}
          onChange={(e) => toggleMaintenance(e.target.checked)}
        />
        <span className="card__checkmark"></span>
        <span className="card__checkbox-label">Профилактика</span>
      </label>

      <div className="card__header">
        <h3>{title}</h3>
        <span className="status-icon" title={status.label}>
          {status.icon}
        </span>
      </div>

      {maintenance ? (
        <div className="card__maintenance-overlay">
          <span className="card__maintenance-icon">🔧</span>
          <span className="card__maintenance-text">Профилактика</span>
        </div>
      ) : (
        <>
          <div className="card__sensors">
            {sensors.length > 0 ? (
              sensors.map((sensor, index) => {
                const threshold = thresholds.find(
                  (t) => t.name === sensor.name
                );
                if (!threshold) return null;
                return (
                  <DevicesSensor
                    key={sensor.name ?? index}
                    title={title}
                    sensor={sensor}
                    threshold={threshold}
                    speak={speak}
                    muted={muted}
                    heatingSeason={heatingSeason}
                    isReady={isReady}
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
        </>
      )}
    </div>
  );
};
export default DevicesCard;
