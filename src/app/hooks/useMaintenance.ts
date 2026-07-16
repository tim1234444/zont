import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

type MaintenanceUpdateResponse = {
  device: string;
  maintenance: boolean;
  ok: boolean;
};
const API_URL = 'https://zont-gresk.ru/api/maintenance.php';

async function fetchMaintenance(device: string): Promise<boolean> {
  const res = await fetch(`${API_URL}?device=${encodeURIComponent(device)}`);
  if (!res.ok) throw new Error('Fetch maintenance failed');
  const data = await res.json();
  return data.maintenance ?? false;
}

async function updateMaintenance(
  device: string,
  maintenance: boolean
): Promise<MaintenanceUpdateResponse> {
  const res = await fetch(API_URL, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ device, maintenance }),
  });
  const data = await res.json();

  if (!res.ok) throw new Error('Update maintenance failed');
  return data;
}

export function useMaintenance(deviceTitle: string) {
  const queryClient = useQueryClient();
  const queryKey = ['maintenance', deviceTitle];

  const { data: maintenance = false, isPending } = useQuery({
    queryKey,
    queryFn: () => fetchMaintenance(deviceTitle),
    staleTime: 30_000,
  });

  const mutation = useMutation({
    mutationFn: (value: boolean) => updateMaintenance(deviceTitle, value),

    onMutate: async (value) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<boolean>(queryKey);
      queryClient.setQueryData(queryKey, value);
      return { previous };
    },
    onSuccess: (data) => {
      if (data.ok) {
        toast.success('Статус обслуживания успешно обновлен');

        queryClient.invalidateQueries({
          queryKey: ['thresholdValues'],
        });
      } else {
        toast.error('Ошибка при обновлении статуса обслуживания:');
      }
    },
    onError: (_err, _value, context) => {
      const message =
        _err instanceof Error ? _err.message : 'Произошла неизвестная ошибка';
      toast.error('Ошибка: ' + message);
      if (context?.previous !== undefined) {
        queryClient.setQueryData(queryKey, context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  return {
    maintenance,
    isLoading: isPending,
    toggle: (value: boolean) => mutation.mutate(value),
  };
}
