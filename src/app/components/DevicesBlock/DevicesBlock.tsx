import type {
  ZontDevice,
  ZontSensor,
} from '../../utils/interfaces/zont-devices.interface';
import type { HeatingSeason, ThresholdItem } from '../../services/getValues';
import DevicesCard from '../DevicesCard/DevicesCard';

type DeviceConfig = {
  apiName: string;
  pageName: string;
  sensors: Record<string, string>;
};

type Props = {
  devicesConfig: DeviceConfig[];
  devices: ZontDevice[];
  thresholds: ThresholdItem[];
  heatingSeason: HeatingSeason | undefined;
};

export default function DevicesBlock({
  devicesConfig,
  devices,
  thresholds,
  heatingSeason,
}: Props) {
  const getDeviceByName = (name: string) =>
    devices.find((d) => d.name.trim() === name);

  const mapSensors = (
    device: ZontDevice,
    sensorsMap: Record<string, string>
  ): ZontSensor[] =>
    Object.entries(sensorsMap)
      .map(([originalName, mappedName]) => {
        const sensor = device.sensors.find(
          (s) => s.name.trim() === originalName
        );
        return sensor ? { ...sensor, name: mappedName } : null;
      })
      .filter((s): s is ZontSensor => s !== null);

  return (
    <>
      {devicesConfig.map((config) => {
        const device = getDeviceByName(config.apiName);
        if (!device) return null;

        return (
          <DevicesCard
            key={config.apiName}
            device={device}
            title={config.pageName}
            sensors={mapSensors(device, config.sensors)}
            thresholds={thresholds}
            heatingSeason={heatingSeason}
          />
        );
      })}
    </>
  );
}
