import './Dashboard.scss';
import {
  fetchDevices,
  fetchHeatingSeason,
  fetchThresholdValues,
  type ThresholdItem,
} from '../../services/getValues';
import { useQuery } from '@tanstack/react-query';
import DevicesBlock from '../DevicesBlock/DevicesBlock';
import { DEVICES_INFO } from '../../constants/mainConstants';
import { getErrorMessage } from '../../utils/getErrorMassage';



export default function Dashboard() {
  const {
    data: devices = [],
    isLoading: isDevicesLoading,
    isError: isDevicesError,
    error: devicesError,
  } = useQuery({
    queryKey: ['devices'],
    queryFn: fetchDevices,
    refetchInterval: 60_000,
  });

  const {
    data: thresholdValues = [],
    isLoading: isThresholdValuesLoading,
    isError: isThresholdValuesError,
    error: thresholdValueError,
  } = useQuery<ThresholdItem[]>({
    queryKey: ['thresholdValues'],
    queryFn: fetchThresholdValues,
  });
  
  const { data: heatingSeason, isLoading: isHeatingSeasonLoading } = useQuery({
    queryKey: ['heatingSeason'],
    queryFn: fetchHeatingSeason,
  });
  
  
  if (isDevicesLoading || isThresholdValuesLoading || isHeatingSeasonLoading)
    return (
      <div className="container">
        <p className="card-list__message">Загрузка данных...</p>
      </div>
    );
  if (isDevicesError || isThresholdValuesError) {
    return (
      <div className="container">
        <div className="card-list__message card-list__message--error">
          <p>Произошла ошибка при загрузке данных:</p>

          {isDevicesError && <p>Устройства: {getErrorMessage(devicesError)}</p>}

          {isThresholdValuesError && (
            <p>Пороговые значения: {getErrorMessage(thresholdValueError)}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard container">
      <h1 className="dashboard__title">Мониторинг показателей</h1>

      <div className="dashboard__grid">
        {/* Блок 1: К.7/1 Teplo, К. 5/1 Teplo, Krekshino VZU */}
        <div className="block block--primary">
          <DevicesBlock
            devicesConfig={DEVICES_INFO.honeyValley}
            devices={devices}
            thresholds={thresholdValues}
            heatingSeason={heatingSeason}
          />
        </div>

        {/* Блок 2: Mar5. Teplo, Mar 5. VZU */}
        <div className="block block--secondary">
          <DevicesBlock
            devicesConfig={DEVICES_INFO.maryinoGrad}
            devices={devices}
            thresholds={thresholdValues}
            heatingSeason={heatingSeason}
          />
        </div>
        <DevicesBlock
          devicesConfig={DEVICES_INFO.separate}
          devices={devices}
          thresholds={thresholdValues}
          heatingSeason={heatingSeason}
        />
      </div>
    </div>
  );
}
