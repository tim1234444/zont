import type { ZontDevice } from '../utils/interfaces/zont-devices.interface';
import type { AlertHistoryResponse } from '../utils/types/alertHistory';

export const fetchDevices = async (): Promise<ZontDevice[]> => {
  try {
    const response = await fetch('https://zont-gresk.ru/api/zont-proxy.php');

    if (!response.ok) throw new Error('Ошибка загрузки данных');

    const data = await response.json();
    return data.devices;
  } catch (err: unknown) {
    if (err instanceof Error) {
      throw err;
    } else if (typeof err === 'string') {
      throw new Error(err);
    } else {
      throw new Error('Произошла неизвестная ошибка');
    }
  }
};
export interface HeatingSeason {
  heating_start_date: string;
  heating_end_date: string;
}
export const fetchHeatingSeason = async (): Promise<HeatingSeason> => {
  try {
    const res = await fetch(
      'https://zont-gresk.ru/api/updatingValues.php?route=getHeatingSeason'
    );
    if (!res.ok) throw new Error('Ошибка загрузки отопительного сезона');
    const data = await res.json();
    if (!data.ok) throw new Error(data.message || 'Ошибка сервера');
    return data.data;
  } catch (err: unknown) {
    if (err instanceof Error) {
      throw err;
    } else if (typeof err === 'string') {
      throw new Error(err);
    } else {
      throw new Error('Произошла неизвестная ошибка');
    }
  }
};

export interface ThresholdItem {
  name: string;
  min: number;
  max: number;
}

export const fetchThresholdValues = async (): Promise<ThresholdItem[]> => {
  try {
    const res = await fetch(
      'https://zont-gresk.ru/api/updatingValues.php?route=getThresholdValues'
    );

    if (!res.ok) {
      throw new Error(`Ошибка запроса: ${res.status}`);
    }

    const json = await res.json();

    if (!json.data || !Array.isArray(json.data)) {
      throw new Error('Неверный формат данных');
    }

    return json.data;
  } catch (err: unknown) {
    if (err instanceof Error) {
      throw err;
    } else if (typeof err === 'string') {
      throw new Error(err);
    } else {
      throw new Error('Произошла неизвестная ошибка');
    }
  }
};

export async function fetchAlertHistory(
  page = 1,
  eventType: string,
  minDuration: number,
  activeOnly: boolean = false
): Promise<AlertHistoryResponse> {
  const params = new URLSearchParams({
    route: 'getAlertHistory',
    page: String(page),
  });
  if (eventType) params.append('event_type', eventType);
  if (minDuration) params.append('min_duration', String(minDuration));
  if (activeOnly) params.append('active_only', '1');

  const res = await fetch(
    `https://zont-gresk.ru/api/updatingValues.php?${params}`
  );
  if (!res.ok) throw new Error('Ошибка загрузки истории');
  return res.json();
}
