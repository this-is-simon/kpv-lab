import React, { ReactElement, useMemo, useRef } from "react";
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

let initData = {
  label: "Percentage Slider",
  max: 100,
  min: 0,
  step: 1,
  value: 50,
  unit: "percent",
  onChange: (value: number) => console.log("sliding"),
};

export function Slider(): ReactElement {
  const [slider, setSlider] = useState<SliderProps>(initData);
  const [dragging, setDragging] = useState(false);
  const [position, setPosition] = useState<string>();
  const sliderRef = useRef<HTMLDivElement | null>(null);
  const sliderThumbRef = useRef<HTMLDivElement | null>(null);
  const { label, max, min, step, value, unit, onChange } = slider;

  useEffect(() => {
    const sliderBar = sliderRef.current;
    const sliderWidth = sliderBar?.offsetWidth as number;
    const thumbWidth = sliderThumbRef.current?.offsetWidth as number;

    if (sliderWidth && thumbWidth) {
      const percentageOfThumbWidth = (thumbWidth / sliderWidth) * 100;
      const thumbOffset = percentageOfThumbWidth / 2;
      setPosition(`${value - thumbOffset}%`);
    }
  }, [value]);

  const handleMouseMove = (e: MouseEvent) => {
    if (dragging) {
      const sliderBar = sliderRef.current;
      if (sliderBar) {
        const rect = sliderBar.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        const percentage = (offsetX / rect.width) * 100;
        const unroundedValue = (percentage / 100) * (max - min) + min;
        const roundedValue = Math.round(unroundedValue / step) * step; // Round to the nearest step
        const adjustedValue = Math.min(Math.max(roundedValue, min), max);
        setSlider({ ...slider, value: adjustedValue });
      }
    }
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
      <span>{value}</span>
      <div className="slider">
        <label>{label}</label>
        <div
          ref={sliderRef}
          id="slider-bar"
          className="slider-bar"
          onMouseDown={() => setDragging(true)}
        >
          <div ref={sliderThumbRef} className="slider-thumb" style={{ left: position }}></div>
        </div>
      </div>
    </>
  );
}
