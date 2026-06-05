import { useWeather } from '../../hooks/useWeather';
import './WeatherCard.scss';
export const WeatherCard = () => {
  const { data, isLoading, isError } = useWeather();

  if (isLoading) return <div>Загрузка погоды...</div>;
  if (isError) return <div>Не удалось загрузить погоду</div>;
  if (!data) return null;

  return (
    <div className="weather-card">
      <div className="weather-city">Москва, сегодня</div>
      <div className="weather-main">
        <span className="weather-icon">{data.icon}</span>
        <span className="weather-description">{data.description}</span>
      </div>
      <div className="weather-temp">
        {data.temp > 0 ? `+${data.temp}` : data.temp}°C
      </div>
      <div className="weather-divider" />
      <div className="weather-details">
        <span>
          Ощущается{' '}
          <strong>
            {data.feelsLike > 0 ? `+${data.feelsLike}` : data.feelsLike}°C
          </strong>
        </span>
        <span>
          Влажность <strong>{data.humidity}%</strong>
        </span>
        <span>
          Ветер <strong>{data.windSpeed} м/с</strong>
        </span>
      </div>
    </div>
  );
};
