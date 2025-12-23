import React, { useState } from 'react';
import './SensorThreshold.scss';
import ChangeThresholdButton from './ChangeThresholdButton/ChangeThresholdButton';

interface Props {
  title: string;
  minInitialValue: number;
  maxInitialValue: number;
  minLimit?: number;
  maxLimit?: number;
}

export const SensorThreshold: React.FC<Props> = ({
  title,
  minInitialValue,
  maxInitialValue,
  minLimit = 0,
  maxLimit = 100,
}) => {
  const [minValue, setMinValue] = useState(+minInitialValue);
  const [maxValue, setMaxValue] = useState(+maxInitialValue);

  return (
    <div className="full-card">
      <h2 className="full-title">{title}</h2>

      <div className="full-block">
        <div className="full-info">
          <span>Минимум</span>
          <span className="full-number">{minValue}</span>
        </div>

        <input
          type="range"
          min={minLimit}
          max={maxLimit}
          value={minValue}
          className="full-slider"
          onChange={(e) => setMinValue(Number(e.target.value))}
        />

        <div className="full-controls">
          <button
            className="full-btn"
            onClick={() =>
              setMinValue((prev) => Math.round((prev - 0.1) * 10) / 10)
            }
          >
            –
          </button>
          <button
            className="full-btn"
            onClick={() =>
              setMinValue((prev) => Math.round((prev + 0.1) * 10) / 10)
            }
          >
            +
          </button>
        </div>
      </div>

      {/* MAX BLOCK */}
      <div className="full-block">
        <div className="full-info">
          <span>Максимум</span>
          <span className="full-number">{maxValue}</span>
        </div>

        <input
          type="range"
          min={minLimit}
          max={maxLimit}
          value={maxValue}
          className="full-slider"
          onChange={(e) => setMaxValue(Number(e.target.value))}
        />

        <div className="full-controls">
          <button
            className="full-btn"
            onClick={() =>
              setMaxValue((prev) => Math.round((prev - 0.1) * 10) / 10)
            }
          >
            –
          </button>
          <button
            className="full-btn"
            onClick={() =>
              setMaxValue((prev) => Math.round((prev + 0.1) * 10) / 10)
            }
          >
            +
          </button>
        </div>
      </div>
      <ChangeThresholdButton name={title} newMinValue={minValue} newMaxValue={maxValue}></ChangeThresholdButton>
    </div>
  );
};
