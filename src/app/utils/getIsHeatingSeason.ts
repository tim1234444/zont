export const getIsHeatingSeason = (
  heatingSeason:
    | {
        heating_start_date: string;
        heating_end_date: string;
      }
    | null
    | undefined
): boolean => {
  if (!heatingSeason) return false;

  const now = new Date();
  const start = new Date(heatingSeason.heating_start_date);
  const end = new Date(heatingSeason.heating_end_date);

  return now >= start && now <= end;
};
