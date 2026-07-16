import './SensorsPanel.scss';
import { SensorThreshold } from '../SensorThresholdItem/SensorThreshold';
import { useQuery } from '@tanstack/react-query';
import { fetchThresholdValues } from '../../services/getValues';
import { recommendedSettings } from '../../constants/recommendedSettings';
interface ThresholdItem {
  name: string;
  min: number;
  max: number;
}
export const SensorsPanel: React.FC = () => {
  const {
    data: thresholdValues,
    isLoading,
    isError,
    error,
  } = useQuery<ThresholdItem[]>({
    queryKey: ['thresholdValues'],
    queryFn: fetchThresholdValues,
  });

  if (isLoading)
    return (
      <div className="container">
        <p className="card-list__message">Загрузка данных...</p>
      </div>
    );
  if (isError)
    return (
      <div className="container">
        <p className="card-list__message">Ошибка: {(error as Error).message}</p>
      </div>
    );
  return (
    <>
      {thresholdValues &&
        thresholdValues.map((sensor) => {
          const recommendations = recommendedSettings.find(
            (item) => item.title === sensor.name
          );
          return (
            <SensorThreshold
              key={sensor.name}
              title={sensor.name}
              minInitialValue={sensor.min}
              maxInitialValue={sensor.max}
              recommendedMin={recommendations?.recommendedMin}
              recommendedMax={recommendations?.recommendedMax}
            />
          );
        })}
    </>
  );
};
