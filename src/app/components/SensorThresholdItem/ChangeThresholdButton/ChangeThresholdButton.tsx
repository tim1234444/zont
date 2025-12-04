import { useState } from "react";
import { updateThresholdValue } from "../../../services/ensorThresholdService";
import "./ChangeThresholdButton.scss"
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
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);

    await updateThresholdValue(name, newMinValue, newMaxValue);

    setLoading(false);
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="full-save-btn"
    >
      {loading ? "Сохраняю..." : "Сохранить значения"}
    </button>
  );
}
