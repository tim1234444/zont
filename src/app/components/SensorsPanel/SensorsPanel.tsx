import React, { useEffect, useState } from 'react';

import './SensorsPanel.scss';
import { SensorThreshold } from '../SensorThresholdItem/SensorThreshold';
interface ThresholdItem {
  name: string;
  min: number;
  max: number; 
}
export const SensorsPanel: React.FC = () => {
  const [thresholdValues, setThresholdValues] = useState<ThresholdItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(
          'https://zont-gresk.ru/api/thresholdValues.php?route=getData',
          {
            method: 'GET',
          }
        );

        if (!res.ok) throw new Error('Ошибка запроса: ' + res.status);

        const json = await res.json();
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
    <div className="sensors-panel container">
      {thresholdValues &&
        thresholdValues.map((sensor) => (
          <SensorThreshold
            key={sensor.name}
            title={sensor.name}
            minInitialValue={sensor.min}
            maxInitialValue={sensor.max}
          />
        ))}
      
    </div>
  );
};
