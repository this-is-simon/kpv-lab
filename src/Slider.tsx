import { ReactElement, useRef } from "react";
import "./slider.css";
import { useState, useEffect } from "react";

export interface SliderProps {
  label: string;
  max: number;
  min: number;
  step: number;
  value: number;
  unit?: string;
  showIncrements?: boolean;
  showButtons?: boolean;
  onChange: (value: number) => void;
}

export function Slider(initData: SliderProps): ReactElement {
  const [value, setValue] = useState<number>(initData.value);
  const [dragging, setDragging] = useState<boolean>(false);
  const [position, setPosition] = useState<string>("");
  const sliderRef = useRef<HTMLDivElement | null>(null);
  const sliderThumbRef = useRef<HTMLDivElement | null>(null);
  const { label, max, min, step, unit, showIncrements, showButtons, onChange } = initData;
  const thumbClass = `slider-thumb${showIncrements ? " show-increments" : ""}`;

  useEffect(() => {
    onChange(value);
  }, [value]);

  useEffect(() => {
    const sliderBar = sliderRef.current;
    if (sliderBar) {
      const sliderWidth = sliderBar.offsetWidth; // Get the rendered width of the slider bar.
      const thumbWidth = sliderThumbRef.current?.offsetWidth || 0; // Get the rendered width of the slider thumb.
      const totalSteps = (max - min) / step; // Calculate the total number of steps.
      const stepWidth = sliderWidth / totalSteps; // Calculate the width of each step.
      const thumbPosition = ((value - min) / step) * stepWidth; // Calculate thumb position.
      const position = thumbPosition - thumbWidth / 2; // Adjust for thumb's width.
      setPosition(`${position}px`); // Set the thumb's position.
    }
  }, [value, max, min, step]);

  const clampAndRoundValue = (valueToAdjust: number): number => {
    return Number(Math.min(Math.max(valueToAdjust, min), max).toFixed(2));
  };

  const updateSliderValue = (clientX: number) => {
    const sliderBar = sliderRef.current;
    if (sliderBar) {
      const rect = sliderBar.getBoundingClientRect();
      const offsetX = clientX - rect.left;
      const percentage = (offsetX / rect.width) * 100;
      const newValue = (percentage / 100) * (max - min) + min;
      const adjustedValue = min + Math.round((newValue - min) / step) * step;
      const clampedValue = clampAndRoundValue(adjustedValue);
      setValue(clampedValue);
    }
  };

  const handleMouseDrag = (e: MouseEvent) => {
    if (dragging) {
      updateSliderValue(e.clientX);
    }
  };

  const handleBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    updateSliderValue(e.clientX);
  };

  useEffect(() => {
    document.addEventListener("mouseup", () => setDragging(false));
    document.addEventListener("mousemove", handleMouseDrag);

    return () => {
      document.removeEventListener("mouseup", () => setDragging(false));
      document.removeEventListener("mousemove", handleMouseDrag);
    };
  }, [dragging, handleMouseDrag]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight") {
      incrementValue();
    } else if (e.key === "ArrowLeft") {
      decrementValue();
    }
  };

  const incrementValue = () => {
    const newValue = clampAndRoundValue(value + step);
    setValue(newValue);
  };

  const decrementValue = () => {
    const newValue = clampAndRoundValue(value - step);
    setValue(newValue);
  };

  return (
    <>
      <div
        className="slider-container"
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="slider"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-valuetext={`${value}${unit}`}
        aria-label={label}
      >
        <label>{label}</label>
        <div className="slider">
          {showButtons && (
            <button onClick={decrementValue} className="slider-btn">
              −
            </button>
          )}
          <div ref={sliderRef} className="slider-bar" onClick={handleBarClick}>
            <div className="slider-fill" style={{ width: value === min ? "0px" : position }}></div>
            <div
              ref={sliderThumbRef}
              className={thumbClass}
              style={{ left: position }}
              onMouseDown={() => setDragging(true)}
            >
              {value}
              {unit}
            </div>
            {showIncrements && <IncrementMarkers min={min} max={max} />}
          </div>
          {showButtons && (
            <button onClick={incrementValue} className="slider-btn">
              +
            </button>
          )}
        </div>
      </div>
    </>
  );
}

interface IncrementProps {
  min: number;
  max: number;
}

const IncrementMarkers = ({ min, max }: IncrementProps) => {
  const markers = [
    min,
    min + (max - min) * 0.25,
    min + (max - min) * 0.5,
    min + (max - min) * 0.75,
    max,
  ];
  return (
    <div className="slider-markers">
      {markers.map((markerValue, index) => (
        <div key={index} className="slider-marker">
          <div className="marker-line" />
          <div className="marker-label">{markerValue}</div>
        </div>
      ))}
    </div>
  );
};
