import React, { useEffect, useState } from 'react';

import './SensorsPanel.scss';
import { SensorThreshold } from '../SensorThresholdItem/SensorThreshold';
import { useAppState } from '../../context/useAppState';
interface ThresholdItem {
  name: string;
  min: number;
  max: number;
}
export const SensorsPanel: React.FC = () => {
  const { updateThreshold } = useAppState();

  const [thresholdValues, setThresholdValues] = useState<ThresholdItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(
          'https://zont-gresk.ru/api/updatingValues.php?route=getThresholdValues',
          {
            method: 'GET',
          }
        );

        if (!res.ok) throw new Error('Ошибка запроса: ' + res.status);

        const json = await res.json();
        updateThreshold(json.data);
        setThresholdValues(json.data);
        setError('');
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Неизвестная ошибка');
        }
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);
  if (loading)
    return (
      <div className="container">
        <p className="card-list__message">Загрузка данных...</p>
      </div>
    );
  if (error)
    return (
      <div className="container">
        <p className="card-list__message">Ошибка: {error}</p>
      </div>
    );
  return (
    <>
      {thresholdValues &&
        thresholdValues.map((sensor) => (
          <SensorThreshold
            key={sensor.name}
            title={sensor.name}
            minInitialValue={sensor.min}
            maxInitialValue={sensor.max}
          />
        ))}
    </>
  );
};
