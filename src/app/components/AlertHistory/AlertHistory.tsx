import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import './AlertHistory.scss';
import { fetchAlertHistory } from '../../services/getValues';

function formatDuration(from: string, to: string | null): string {
  const start = new Date(from).getTime();
  const end = to ? new Date(to).getTime() : Date.now();
  const diff = Math.floor((end - start) / 1000);
  const h = Math.floor(diff / 3600);
  const m = Math.floor((diff % 3600) / 60);
  const s = diff % 60;
  if (h > 0) return `${h}ч ${m}м`;
  if (m > 0) return `${m}м ${s}с`;
  return `${s}с`;
}

export default function AlertHistory() {
  const [page, setPage] = useState(1);
  const [eventType, setEventType] = useState('');
  const [minDuration, setMinDuration] = useState(0);

  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: ['alertHistory', page, eventType, minDuration],

    queryFn: () => fetchAlertHistory(page, eventType, minDuration),
    staleTime: 30_000,
    placeholderData: (prev) => prev,
  });

  const handleEventType = (val: string) => {
    setEventType(val);
    setPage(1);
  };
  const handleDuration = (val: number) => {
    setMinDuration(val);
    setPage(1);
  };
  return (
    <div className="ah-wrapper">
      <h2 className="ah-title">
        История оповещений
        {isFetching && <span className="ah-updating">обновление...</span>}
      </h2>
      <div className="ah-filters">
        <div className="ah-filters__group">
          <span className="ah-filters__label">Тип события</span>
          <div className="ah-filters__btns">
            {[
              { value: '', label: 'Все' },
              { value: 'above', label: '▲ Превышение' },
              { value: 'below', label: '▼ Занижение' },
              { value: 'offline', label: '● Офлайн' },
            ].map((opt) => (
              <button
                key={opt.value}
                className={`ah-filter-btn ${eventType === opt.value ? 'ah-filter-btn--active' : ''}`}
                onClick={() => handleEventType(opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
        <div className="ah-filters__group">
          <span className="ah-filters__label">Длительность от</span>
          <div className="ah-filters__btns">
            {[
              { value: 0, label: 'Любая' },
              { value: 15, label: '15 мин' },
              { value: 30, label: '30 мин' },
              { value: 60, label: '1 час' },
              { value: 360, label: '6 часов' },
              { value: 1440, label: '1 день' },
            ].map((opt) => (
              <button
                key={opt.value}
                className={`ah-filter-btn ${minDuration === opt.value ? 'ah-filter-btn--active' : ''}`}
                onClick={() => handleDuration(opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      {isLoading && <p className="ah-message">Загрузка...</p>}
      {isError && (
        <p className="ah-message ah-message--error">Ошибка загрузки</p>
      )}
      {!isLoading && !isError && data?.data.length === 0 && (
        <p className="ah-message">Нет событий по выбранным фильтрам</p>
      )}

      {!isLoading && !isError && data && data.data.length > 0 && (
        <>
          <div className="ah-list">
            {data.data.map((item) => {
              const isOffline = item.event_type === 'offline';
              const isActive = +item.is_active === 1;
              return (
                <div
                  key={item.id}
                  className={`ah-item ${isActive ? 'ah-item--active' : 'ah-item--resolved'} ${isOffline ? 'ah-item--offline' : ''}`}
                >
                  <div className="ah-item__status">
                    {isOffline ? (
                      <span className="ah-badge ah-badge--offline">
                        {isActive ? '● Офлайн' : '✓ Восстановлено'}
                      </span>
                    ) : isActive ? (
                      <span className="ah-badge ah-badge--active">
                        {item.direction === 'above'
                          ? '● Превышение'
                          : '● Занижение'}
                      </span>
                    ) : (
                      <span className="ah-badge ah-badge--resolved">
                        ✓ Завершено
                      </span>
                    )}
                  </div>

                  <div className="ah-item__main">
                    <span className="ah-item__device">{item.device_name}</span>
                    <span className="ah-item__sensor">
                      {isOffline ? 'Устройство недоступно' : item.sensor_name}
                    </span>
                  </div>

                  <div className="ah-item__values">
                    {!isOffline && (
                      <>
                        <span className="ah-item__value">
                          {item.direction === 'above' ? '▲' : '▼'} {item.value}
                        </span>
                        <span className="ah-item__threshold">
                          порог: {item.threshold}
                        </span>
                      </>
                    )}
                  </div>

                  <div className="ah-item__time">
                    <span className="ah-item__date">
                      {new Date(item.created_at).toLocaleString('ru')}
                    </span>
                    <span
                      className={`ah-item__duration ${isActive ? 'ah-item__duration--active' : ''}`}
                    >
                      {isActive
                        ? formatDuration(item.created_at, null)
                        : item.resolved_at
                          ? formatDuration(item.created_at, item.resolved_at)
                          : '—'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {data.pages > 1 && (
            <div className="ah-pagination">
              <button
                className="ah-pagination__btn"
                onClick={() => setPage(1)}
                disabled={page === 1}
              >
                «
              </button>
              <button
                className="ah-pagination__btn"
                onClick={() => setPage((p) => p - 1)}
                disabled={page === 1}
              >
                ‹
              </button>

              <span className="ah-pagination__info">
                {page} / {data.pages}
                <span className="ah-pagination__total">
                  ({data.total} записей)
                </span>
              </span>

              <button
                className="ah-pagination__btn"
                onClick={() => setPage((p) => p + 1)}
                disabled={page === data.pages}
              >
                ›
              </button>
              <button
                className="ah-pagination__btn"
                onClick={() => setPage(data.pages)}
                disabled={page === data.pages}
              >
                »
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
