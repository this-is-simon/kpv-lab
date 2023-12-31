import { ReactElement, useMemo, useRef } from "react";
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
  onChange: (value: number) => void;
}

export function Slider(initData: SliderProps): ReactElement {
  const [slider, setSlider] = useState<SliderProps>(initData);
  const [dragging, setDragging] = useState<boolean>(false);
  const [position, setPosition] = useState<string>();
  const [fillWidth, setFillWidth] = useState<string>();
  const sliderRef = useRef<HTMLDivElement | null>(null);
  const sliderThumbRef = useRef<HTMLDivElement | null>(null);
  const { label, max, min, step, value, unit, showIncrements, onChange } = slider;
  const thumbClass = `slider-thumb${showIncrements ? " show-increments" : ""}`;

  useEffect(() => {
    const sliderBar = sliderRef.current;
    const sliderWidth = sliderBar?.offsetWidth as number;
    const thumbWidth = sliderThumbRef.current?.offsetWidth as number;
    // Calculate the total number of steps
    const totalSteps = (max - min) / step;
    // Calculate the width of one step
    const stepWidth = sliderWidth / totalSteps;
    // Calculate the percentage offset for the thumb
    const thumbPosition = ((value - min) / step) * stepWidth;
    const thumbWidthOffset = thumbWidth / 2;

    // Adjust for width of thumb
    setFillWidth(`${thumbPosition}px`);
    setPosition(`${thumbPosition - thumbWidthOffset}px`);
  }, [value]);

  const updateSliderValue = (clientX: number) => {
    const sliderBar = sliderRef.current;
    if (sliderBar) {
      const rect = sliderBar.getBoundingClientRect();
      const offsetX = clientX - rect.left;
      const percentage = (offsetX / rect.width) * 100;
      const newValue = (percentage / 100) * (max - min) + min;

      // Calculate the adjusted value to the nearest step
      const adjustedValue = min + Math.round((newValue - min) / step) * step;

      // Ensure the adjusted value is within the specified range
      const clampedValue = Number(Math.min(Math.max(adjustedValue, min), max).toFixed(2));
      onChange(clampedValue);
      setSlider({ ...slider, value: clampedValue });
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (dragging) {
      updateSliderValue(e.clientX);
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    updateSliderValue(e.clientX);
  };

  useEffect(() => {
    document.addEventListener("mouseup", () => setDragging(false));
    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.removeEventListener("mouseup", () => setDragging(false));
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, [dragging, handleMouseMove]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    let newValue = value;
    if (e.key === "ArrowRight") {
      newValue = Number(Math.min(value + step, max).toFixed(2));
    } else if (e.key === "ArrowLeft") {
      newValue = Number(Math.max(value - step, min).toFixed(2));
    }
    if (newValue !== value) {
      onChange(newValue);
      setSlider({ ...slider, value: newValue });
    }
  };

  return (
    <>
      <div className="slider" onKeyDown={handleKeyDown} tabIndex={0}>
        <label>{label}</label>
        <div ref={sliderRef} className="slider-bar" onClick={handleClick}>
          <div className="slider-fill" style={{ width: fillWidth }}></div>
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
          <div className="marker-line"></div>
          <div className="marker-label">{markerValue}</div>
        </div>
      ))}
    </div>
  );
};
