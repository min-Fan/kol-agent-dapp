import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Minus, Plus } from "lucide-react";

interface NumberStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  className?: string;
}
const NumberStepper: React.FC<NumberStepperProps> = ({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  disabled = false,
  className = "",
}) => {
  const handleDecrease = () => {
    const newValue = Math.max(min, value - step);
    onChange(newValue);
  };

  const handleIncrease = () => {
    const newValue = Math.min(max, value + step);
    onChange(newValue);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val)) {
      onChange(Math.min(max, Math.max(min, val)));
    } else {
      onChange(min);
    }
  };
  return (
    <div className={`flex justify-center items-center gap-1 ${className}`}>
      <Button variant="primary" onClick={handleDecrease}>
        <Minus></Minus>
      </Button>
      <Input
        value={value}
        min={min}
        max={max}
        type="number"
        className="w-20 text-center"
        onChange={handleInputChange}
      ></Input>
      <Button variant="primary" onClick={handleIncrease}>
        <Plus></Plus>
      </Button>
    </div>
  );
};

export default NumberStepper;
