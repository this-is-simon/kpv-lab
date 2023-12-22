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
  step: 33,
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
        // if i have max = 100
        // and min = 0
        // and I want to go in steps of 5
        // I would do... max-min for the range
        // and then i would divide the range into steps
        // so range / steps
        // which equals 20
        console.log({ offsetX });
        const range = max - min;
        const numIncrements = range / step;
        // console.log({ range, step, numIncrements });
        const percentage = (offsetX / rect.width) * 100;
        const unroundedValue = (percentage / 100) * (max - min) + min;

        // Calculate the adjusted value to the nearest 5
        const adjustedValue = min + Math.round((unroundedValue - min) / step) * step;

        // Ensure the adjusted value is within the specified range
        const clampedValue = Math.min(Math.max(adjustedValue, min), max);
        console.log({ percentage, unroundedValue, adjustedValue, clampedValue });

        setSlider({ ...slider, value: clampedValue });
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
