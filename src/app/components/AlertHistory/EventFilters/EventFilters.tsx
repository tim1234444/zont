export const EventFilter = {
  Active: 'active',
  All: 'all',
} as const;

export type EventFilterType = (typeof EventFilter)[keyof typeof EventFilter];

type EventFiltersProps = {
  value: EventFilterType;
  onChange: (value: EventFilterType) => void;
};

export default function EventFilters({ value, onChange }: EventFiltersProps) {
  return (
    <div className="ah-filters__btns">
      <button
        type="button"
        className={`ah-filter-btn ${
          value === EventFilter.All ? 'ah-filter-btn--active' : ''
        }`}
        onClick={() => onChange(EventFilter.All)}
        aria-pressed={value === EventFilter.All}
      >
        Все события
      </button>

      <button
        type="button"
        className={`ah-filter-btn ${
          value === EventFilter.Active ? 'ah-filter-btn--active' : ''
        }`}
        onClick={() => onChange(EventFilter.Active)}
        aria-pressed={value === EventFilter.Active}
      >
        ● Только активные
      </button>
    </div>
  );
}
