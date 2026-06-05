import './TextInfo.scss';
export default function TextInfo() {
  return (
    <div className="sanpin-card">
      <div className="sanpin-header">
        <div className="sanpin-icon-wrap">
          <span className="sanpin-icon">📋</span>
        </div>
        <span className="sanpin-label">СанПиН 2.1.3684-21</span>
      </div>
      <p className="sanpin-text">
        Температура горячей воды в местах водоразбора централизованной системы
        горячего водоснабжения должна быть{' '}
        <span className="sanpin-accent">не ниже +60°С</span> и{' '}
        <span className="sanpin-accent">не выше +75°С</span>.
      </p>
      <div className="sanpin-divider" />
      <div className="sanpin-grid">
        <div className="sanpin-time-block">
          <span className="sanpin-time-label">Дневное время</span>
          <span className="sanpin-time">05:00 — 00:00</span>
          <span className="sanpin-deviation">отклонение ±3°C</span>
        </div>
        <div className="sanpin-time-block">
          <span className="sanpin-time-label">Ночное время</span>
          <span className="sanpin-time">00:00 — 05:00</span>
          <span className="sanpin-deviation">отклонение ±5°C</span>
        </div>
      </div>
    </div>
  );
}
