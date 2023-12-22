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
  const { label, max, min, step, value, unit, onChange } = slider;
  const [dragging, setDragging] = useState(false);

  const handleMouseMove = (e: MouseEvent) => {
    if (dragging) {
      const sliderBar = document.getElementById("slider-bar");
      if (sliderBar) {
        const rect = sliderBar.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        const percentage = (offsetX / rect.width) * 100;
        const newValue = (percentage / 100) * (max - min) + min;
        const adjustedValue = Math.min(Math.max(newValue, min), max);
        console.log({ offsetX, percentage, oldValue: value, newValue, adjustedValue });
        setSlider({ ...slider, value: adjustedValue });
      }
    }
  };

  console.log({ dragging });

  useEffect(() => {
    document.addEventListener("mouseup", () => setDragging(false));
    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.removeEventListener("mouseup", () => setDragging(false));
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, [dragging, handleMouseMove]);

  const sliderRef = useRef<HTMLDivElement | null>(null);
  const sliderThumbRef = useRef<HTMLDivElement | null>(null);

  // const calculatePosition = useMemo(

  const [initPosition, setInitPosition] = useState<string>();
  //
  useEffect(() => {
    let sliderWidth = sliderRef?.current?.offsetWidth as number;
    const thumbWidth = sliderThumbRef?.current?.offsetWidth as number;
    console.log({ sliderWidth, thumbWidth });
    const percentageOfThumbWidth = (thumbWidth / sliderWidth) * 100;
    console.log({ percentageOfThumbWidth });
    const thumbOffset = percentageOfThumbWidth / 2;
    setInitPosition(`${value - thumbOffset}%`);
  }, [value]);

  console.log({ thumbOffset: initPosition });

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
          <div ref={sliderThumbRef} className="slider-thumb" style={{ left: initPosition }}></div>
        </div>
      </div>
    </>
  );
}
