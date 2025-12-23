import { updateThresholdValue } from '../../../services/updatingValues';
import './ChangeThresholdButton.scss';
import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';
type Props = {
  name: string;
  newMinValue: number;
  newMaxValue: number;
};

export default function ChangeThresholdButton({
  name,
  newMinValue,
  newMaxValue,
}: Props) {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: () => updateThresholdValue(name, newMinValue, newMaxValue),

    onSuccess: (data) => {
      if (data.ok) {
        toast.success(data.message);

        queryClient.invalidateQueries({
          queryKey: ['thresholdValues'],
        });
      } else {
        toast.error(data.message);
      }
    },

    onError: (error) => {
      const message =
        error instanceof Error ? error.message : 'Произошла неизвестная ошибка';
      toast.error('Ошибка: ' + message);
    },
  });

  const handleClick = () => {
    if (newMinValue >= newMaxValue) {
      toast.error(
        'Минимальное значение не может быть больше или равно максимальному'
      );
      return;
    }

    mutate();
  };

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className="full-save-btn"
    >
      {isPending ? 'Сохраняю...' : 'Сохранить значения'}
    </button>
  );
}
