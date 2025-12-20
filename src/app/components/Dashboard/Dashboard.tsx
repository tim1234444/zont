import Card from '../Card/Card';
import './Dashboard.scss';
import type { ZontDevice } from '../../utils/interfaces/zont-devices.interface';
import { useEffect, useState } from 'react';

const DEVICES_INFO = {
  honeyValley: [
    {
      apiName: 'К.7/1 Teplo',
      pageName: 'Жилой комплекс «Медовая долина» 7к1',
      sensors: {
        'Темп. Отопление': 'Температура отопления',
        'Темп. ГВС': 'Температура горячего водоснабжения',
      },
    },
    {
      apiName: 'К. 5/1 Teplo',
      pageName: 'Жилой комплекс «Медовая долина» 5к1',

      sensors: {
        'Темп. Отопление': 'Температура отопления',
        'Темп. ГВС': 'Температура горячего водоснабжения',
      },
    },
    {
      apiName: 'Krekshino VZU',
      pageName: 'Жилой комплекс «Медовая долина»',

      sensors: { 'Давление в поселок': 'Давление холодного водоснабжения' },
    },
  ],
  maryinoGrad: [
    {
      apiName: 'Mar5. Teplo',
      pageName: 'Жилой комплекс «Марьино Град»',

      sensors: {
        'Темп. Отопление': 'Температура отопления',
        'Тем. ГВС': 'Температура горячего водоснабжения',
      },
    },
    {
      apiName: 'Mar 5. VZU',
      pageName: 'Жилой комплекс «Марьино Град»',
      sensors: {
        'Давление город': 'Давление холодного водоснабжения',
      },
    },
  ],
  separate: [
    {
      apiName: 'Rum Teplo',
      pageName: 'Жилой комплекс Homecity',

      sensors: {
        'Т подачи':
          'Температура отопления (теплоносителя для приготовления горячего водоснабжения)',
      },
    },
    {
      apiName: 'Prokshino Teplo',
      pageName: 'Жилой комплекс «Николин Парк»',

      sensors: {
        'Т отопления': 'Температура отопления',
        'Т ГВС': 'Температура горячего водоснабжения',
      },
    },
    {
      apiName: 'Klen allei VZU',
      pageName: 'Жилой комплекс «Кленовые Аллеи»',

      sensors: { 'Давление в город': 'Давление холодного водоснабжения' },
    },
    {
      apiName: 'Rom VZU',
      pageName: 'Жилой комплекс «Западное Кунцево»',

      sensors: { 'Д поселок': 'Давление холодного водоснабжения' },
    },
    {
      apiName: 'Cvet VZU',
      pageName: 'Жилой комплекс «Цветочные Поляны»',

      sensors: { 'Д в поселок': 'Давление холодного водоснабжения' },
    },
  ],
};

const Dashboard: React.FC = () => {
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
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else if (typeof err === 'string') {
          setError(err);
        } else {
          setError('Произошла неизвестная ошибка');
        }
      } finally {
        setLoading(false);
      }
    }

    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  const getDisplayDevice = (deviceName: string): ZontDevice | undefined => {
    const current = devices.find((d) => d.name.trim() === deviceName);
    if (current) return current;
  };
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
    <div className="dashboard container">
      <h1 className="dashboard__title">Мониторинг показателей</h1>

      <div className="dashboard__grid">
        {/* Блок 1: К.7/1 Teplo, К. 5/1 Teplo, Krekshino VZU */}
        <div className="block block--primary">
          {DEVICES_INFO.honeyValley.map((device) => {
            const deviceInfo = getDisplayDevice(device.apiName);
            if (!deviceInfo) return null;
            return (
              <Card
                key={device.apiName}
                device={deviceInfo}
                title={device.pageName}
                sensors={deviceInfo.sensors
                  .filter((s) =>
                    Object.keys(device.sensors).includes(s.name.trim())
                  )
                  .map((sensor) => ({
                    ...sensor,
                    name:
                      device.sensors[
                        sensor.name.trim() as keyof typeof device.sensors
                      ] || sensor.name,
                  }))}
              />
            );
          })}
        </div>

        {/* Блок 2: Mar5. Teplo, Mar 5. VZU */}
        <div className="block block--secondary">
          {DEVICES_INFO.maryinoGrad.map((device) => {
            const deviceInfo = getDisplayDevice(device.apiName);
            if (!deviceInfo) return null;
            return (
              <Card
                key={device.apiName}
                device={deviceInfo}
                title={device.pageName}
                sensors={deviceInfo.sensors
                  .filter((s) =>
                    Object.keys(device.sensors).includes(s.name.trim())
                  )
                  .map((sensor) => ({
                    ...sensor,
                    name:
                      device.sensors[
                        sensor.name.trim() as keyof typeof device.sensors
                      ] || sensor.name,
                  }))}
              />
            );
          })}
        </div>
        {DEVICES_INFO.separate.map((device) => {
          const deviceInfo = getDisplayDevice(device.apiName);
          if (!deviceInfo) return null;
          return (
            <Card
              key={device.apiName}
              device={deviceInfo}
              title={device.pageName}
              sensors={deviceInfo.sensors
                .filter((s) =>
                  Object.keys(device.sensors).includes(s.name.trim())
                )
                .map((sensor) => ({
                  ...sensor,
                  name:
                    device.sensors[
                      sensor.name.trim() as keyof typeof device.sensors
                    ] || sensor.name,
                }))}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;
