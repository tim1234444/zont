import Card from '../Card/Card';
import './Dashboard.scss';
import type { ZontDevice } from '../../utils/interfaces/zont-devices.interface';
import { fetchDevices } from '../../services/getValues';
import { useQuery } from '@tanstack/react-query';

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

export default function Dashboard() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['devices'],
    queryFn: fetchDevices,
    refetchInterval: 60_000,
  });
  const devices: ZontDevice[] = data ?? [];

  const getDisplayDevice = (deviceName: string): ZontDevice | undefined => {
    const current = devices.find((d) => d.name.trim() === deviceName);
    if (current) return current;
  };
  if (isLoading)
    return (
      <div className="container">
        <p className="card-list__message">Загрузка данных...</p>
      </div>
    );
  if (isError)
    return (
      <div className="container">
        <p className="card-list__message">
          {' '}
          Ошибка: {(error as Error).message}
        </p>
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
}
