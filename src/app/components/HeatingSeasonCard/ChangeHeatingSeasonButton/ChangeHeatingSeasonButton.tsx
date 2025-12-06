import { useState } from 'react';
import { updateHeatingSeason } from '../../../services/updatingValues';

type Props = {
  startDate: string;
  endDate: string;
};
export default function ChangeHeatingSeasonButton({
  startDate,
  endDate,
}: Props) {
  const [loading, setLoading] = useState(false);

  const saveSeason = async () => {
    if (!startDate || !endDate) return;

    if (startDate > endDate) {
      alert('Дата начала позже даты окончания');
      return;
    }

    setLoading(true);

    const result = await updateHeatingSeason(startDate, endDate);

    if (result.ok) {
      alert('Даты отопительного сезона обновлены!');
    } else {
      alert('Ошибка: ' + result.message);
    }

    setLoading(false);
  };
  return (
    <>
      <button
        className="season-save-btn"
        disabled={loading}
        onClick={saveSeason}
      >
        {loading ? 'Сохранение…' : 'Сохранить'}
      </button>
    </>
  );
}
