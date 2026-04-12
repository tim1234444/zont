export interface AlertHistoryItem {
  id: number;
  sensor_name: string;
  device_name: string;
  value: number | null;
  threshold: number | null;
  direction: 'above' | 'below' | null;
  event_type: 'threshold' | 'offline';
  is_active: number;
  created_at: string;
  resolved_at: string | null;
}
  
  export interface AlertHistoryResponse {
    ok: boolean;
    data: AlertHistoryItem[];
    total: number;
    page: number;
    pages: number;
  }