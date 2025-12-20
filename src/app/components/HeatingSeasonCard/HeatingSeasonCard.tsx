import { useEffect, useState } from 'react';
import './HeatingSeasonCard.scss';
import ChangeHeatingSeasonButton from './ChangeHeatingSeasonButton/ChangeHeatingSeasonButton';
import { useAppState } from '../../context/useAppState';
export const HeatingSeasonCard = () => {
  const { updateHeatingSeason } = useAppState();

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSeason = async () => {
      try {
        const res = await fetch(
          'https://zont-gresk.ru/api/updatingValues.php?route=getHeatingSeason'
        );
        const data = await res.json();

        if (data.ok) {
          updateHeatingSeason(data.data);
          setStartDate(data.data.heating_start_date);
          setEndDate(data.data.heating_end_date);
        } else if (!data.ok) {
          console.error(data.message);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    loadSeason();
  }, []);

  return (
    <div className="season-card">
      <h3 className="season-title">Отопительный сезон</h3>

      {loading ? (
        <p>Загрузка...</p>
      ) : (
        <>
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
        </>
      )}
    </div>
  );
};
