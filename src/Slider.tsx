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
  onChange: (value: number) => void;
}

export function Slider(initData: SliderProps): ReactElement {
  const [slider, setSlider] = useState<SliderProps>(initData);
  const [dragging, setDragging] = useState(false);
  const [position, setPosition] = useState<string>();
  const [fillWidth, setFillWidth] = useState<string>();
  const sliderRef = useRef<HTMLDivElement | null>(null);
  const sliderThumbRef = useRef<HTMLDivElement | null>(null);
  const { label, max, min, step, value, unit, onChange } = slider;

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
    setPosition(`${thumbPosition - thumbWidthOffset}px`);
    setFillWidth(`${thumbPosition}px`);
  }, [value, max, min, step]);

  const handleMouseMove = (e: MouseEvent) => {
    if (dragging) {
      const sliderBar = sliderRef.current;
      if (sliderBar) {
        const rect = sliderBar.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        const percentage = (offsetX / rect.width) * 100;
        const unroundedValue = (percentage / 100) * (max - min) + min;

        // Calculate the adjusted value to the nearest step
        const adjustedValue = min + Math.round((unroundedValue - min) / step) * step;

        // Ensure the adjusted value is within the specified range
        const clampedValue = Number(Math.min(Math.max(adjustedValue, min), max).toFixed(2));
        console.log("mouseMove", { percentage, unroundedValue, adjustedValue, clampedValue });
        onChange(clampedValue);
        setSlider({ ...slider, value: clampedValue });
      }
    }
  };

  const renderIncrementMarkers = () => {
    const markers = [
      min,
      min + (max - min) * 0.25,
      min + (max - min) * 0.5,
      min + (max - min) * 0.75,
      max,
    ];
    return markers.map((markerValue, index) => (
      <div key={index} className="slider-marker">
        <div className="marker-line"></div>
        <div className="marker-label">{markerValue}</div>
      </div>
    ));
  };

  useEffect(() => {
    document.addEventListener("mouseup", () => setDragging(false));
    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.removeEventListener("mouseup", () => setDragging(false));
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, [dragging, handleMouseMove]);

  return (
    <>
      <div style={{ display: "flex", gap: "10px" }}>
        <div>{value}</div>
        <div>{unit}</div>
      </div>
      <div className="slider">
        <label>{label}</label>
        <div
          ref={sliderRef}
          id="slider-bar"
          className="slider-bar"
          onMouseDown={() => setDragging(true)}
        >
          <div className="slider-fill" style={{ width: fillWidth }}></div>

          <div ref={sliderThumbRef} className="slider-thumb" style={{ left: position }}>
            <div className="slider-thumb-centre"></div>
          </div>
        </div>
        <div className="slider-markers">{renderIncrementMarkers()}</div>
      </div>
    </>
  );
}
