import { updateHeatingSeason } from '../../../services/updatingValues';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

type Props = {
  startDate: string;
  endDate: string;
};

export default function ChangeHeatingSeasonButton({
  startDate,
  endDate,
}: Props) {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: () => updateHeatingSeason(startDate, endDate),
    onSuccess: (result) => {
      if (result.ok) {
        queryClient.invalidateQueries({ queryKey: ['heatingSeason'] });
        toast.success('Даты отопительного сезона обновлены!');
      }
    },
    onError: (err: unknown) => {
      const message =
        err instanceof Error ? err.message : 'Произошла неизвестная ошибка';
      toast.error('Ошибка: ' + message);
    },
  });

  const handleClick = () => {
    if (!startDate || !endDate) {
      toast.error('Пожалуйста, заполните обе даты');
      return;
    }
    if (startDate > endDate) {
      toast.error('Дата начала позже даты окончания');
      return;
    }

    mutate();
  };

  return (
    <>
      <button
        className="season-save-btn"
        disabled={isPending}
        onClick={handleClick}
      >
        {isPending ? 'Сохранение…' : 'Сохранить'}
      </button>
    </>
  );
}
