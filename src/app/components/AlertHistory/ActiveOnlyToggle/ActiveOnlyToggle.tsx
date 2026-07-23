type ActiveOnlyToggleProps = {
  isActiveOnly: boolean;
  onToggle: (value: boolean) => void;
};

export default function ActiveOnlyToggle({
  isActiveOnly,
  onToggle,
}: ActiveOnlyToggleProps) {
  return (
    <button
      type="button"
      className={`ah-filter-btn ah-filter-btn--toggle ${
        isActiveOnly ? 'ah-filter-btn--active' : ''
      }`}
      onClick={() => onToggle(!isActiveOnly)}
      aria-pressed={isActiveOnly}
    >
      {isActiveOnly ? '● Только активные' : 'Все события'}
    </button>
  );
}
