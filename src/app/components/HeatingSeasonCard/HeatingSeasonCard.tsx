import './HeatingSeasonCard.scss';
import ChangeHeatingSeasonButton from './ChangeHeatingSeasonButton/ChangeHeatingSeasonButton';
import { useQuery } from '@tanstack/react-query';
import { fetchHeatingSeason } from '../../services/getValues';
import { useEffect, useState } from 'react';
export const HeatingSeasonCard = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const {
    data: season,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['heatingSeason'],
    queryFn: fetchHeatingSeason,
  });
  useEffect(() => {
    if (season) {
      setStartDate(season.heating_start_date || '');
      setEndDate(season.heating_end_date || '');
    }
  }, [season]);

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
    <div className="season-card">
      <h3 className="season-title">Отопительный сезон</h3>

      <div className="season-field">
        <label className="season-label">Дата начала</label>
        <input
          type="date"
          className="season-input"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
      </div>

      <div className="season-field">
        <label className="season-label">Дата окончания</label>
        <input
          type="date"
          className="season-input"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>
      <ChangeHeatingSeasonButton
        startDate={startDate}
        endDate={endDate}
      ></ChangeHeatingSeasonButton>
    </div>
  );
};
