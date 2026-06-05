// hooks/useWeather.ts
import { useQuery } from '@tanstack/react-query';

const weatherDescriptions: Record<number, string> = {
  0: 'Ясно',
  1: 'Преимущественно ясно',
  2: 'Переменная облачность',
  3: 'Пасмурно',
  45: 'Туман',
  48: 'Туман с инеем',
  51: 'Лёгкая морось',
  53: 'Морось',
  61: 'Небольшой дождь',
  63: 'Умеренный дождь',
  65: 'Сильный дождь',
  71: 'Небольшой снег',
  73: 'Умеренный снег',
  75: 'Сильный снег',
  80: 'Ливень',
  95: 'Гроза',
};

const weatherIcons: Record<number, string> = {
  0: '☀️',
  1: '🌤️',
  2: '⛅',
  3: '☁️',
  45: '🌫️',
  48: '🌫️',
  51: '🌦️',
  53: '🌦️',
  61: '🌧️',
  63: '🌧️',
  65: '🌧️',
  71: '❄️',
  73: '❄️',
  75: '❄️',
  80: '⛈️',
  95: '⛈️',
};

const fetchWeather = async () => {
  const res = await fetch(
    'https://api.open-meteo.com/v1/forecast?latitude=55.75&longitude=37.62&current=temperature_2m,apparent_temperature,weathercode,windspeed_10m,relativehumidity_2m'
  );
  const data = await res.json();
  const current = data.current;

  return {
    temp: Math.round(current.temperature_2m),
    feelsLike: Math.round(current.apparent_temperature),
    humidity: current.relativehumidity_2m,
    windSpeed: Math.round(current.windspeed_10m / 3.6),
    description: weatherDescriptions[current.weathercode] ?? 'Неизвестно',
    icon: weatherIcons[current.weathercode] ?? '🌡️',
  };
};

export const useWeather = () =>
  useQuery({
    queryKey: ['weather'],
    queryFn: fetchWeather,
    staleTime: 1000 * 60 * 120,
    refetchInterval: 1000 * 60 * 120,
  });
