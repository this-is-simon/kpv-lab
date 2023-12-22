import React, { ReactElement } from "react";
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
  const [newValue, setNewValue] = useState<number>();

  useEffect(() => {
    console.log("newValue?", newValue);
    if (newValue) {
      setSlider({ ...slider, value: newValue });
    }
  }, [newValue]);

  const handleMouseMove = (e: MouseEvent) => {
    if (dragging) {
      const sliderBar = document.getElementById("slider-bar");
      if (sliderBar) {
        const rect = sliderBar.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        const percentage = (offsetX / rect.width) * 100;
        const newValue = (percentage / 100) * (max - min) + min;
        console.log({ offsetX, percentage, oldValue: value, newValue });
        setNewValue(newValue);
        onChange(newValue);
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

  // const calculatePosition = () => {
  //   const percentage = ((value - min) / (max - min)) * 100;
  //   return `calc(${percentage}% - ${percentage * 0.15}px)`; // Adjust the 0.15 multiplier for styling
  // };

  //

  return (
    <div className="slider">
      <label>{label}</label>
      <div id="slider-bar" className="slider-bar" onMouseDown={() => setDragging(true)}>
        <div className="slider-thumb" style={{ left: `${((value - min) / (max - min)) * 100}%` }}>
          <span>{value}</span>
        </div>
      </div>
    </div>
  );
}
