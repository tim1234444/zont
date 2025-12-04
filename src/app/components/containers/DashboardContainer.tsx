import { useState, useEffect } from 'react';
import type { ZontDevice } from '../../utils/interfaces/zont-devices.interface';
import Dashboard from '../Dashboard/Dashboard';
import { SensorsPanel } from '../SensorsPanel/SensorsPanel';

export default function DashboardContainer() {
  const [devices, setDevices] = useState<ZontDevice[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(
          'https://zont-gresk.ru/api/zont-proxy.php'
        );

        if (!response.ok) throw new Error('Ошибка загрузки данных');

        const data = await response.json();
        setDevices(data.devices);
        setLoading(false);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else if (typeof err === 'string') {
          setError(err);
        } else {
          setError('Произошла неизвестная ошибка');
        }
        setLoading(false);
      }
    }

    fetchData();
    const interval = setInterval(fetchData, 300000);
    return () => clearInterval(interval);
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
    <div className="app">
      <Dashboard devices={devices} />
      <SensorsPanel />
    </div>
  );
}
