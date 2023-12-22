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

export function Slider(props: SliderProps): ReactElement {
  const { label, max, min, step, value, unit, onChange } = props;
  const [dragging, setDragging] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (dragging) {
      const sliderBar = document.getElementById("slider-bar");
      if (sliderBar) {
        const rect = sliderBar.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        const percentage = (offsetX / rect.width) * 100;
        const newValue = (percentage / 100) * (max - min) + min;
        onChange(newValue);
      }
    }
  };

  console.log({ dragging });

  useEffect(() => {
    document.addEventListener("mouseup", () => setDragging(false));
    document.addEventListener("mousemove", () => {});

    return () => {
      document.removeEventListener("mouseup", () => setDragging(false));
      document.removeEventListener("mousemove", () => {});
    };
  }, [dragging, handleMouseMove]);

  // const calculatePosition = () => {
  //   const percentage = ((value - min) / (max - min)) * 100;
  //   return `calc(${percentage}% - ${percentage * 0.15}px)`; // Adjust the 0.15 multiplier for styling
  // };

  //
  let isDrawing = false;
  let x = 0;
  let y = 0;

  const myPics = document.getElementById("myPics");
  //@ts-ignore
  const context: HTMLElement = myPics.getContext("2d") as HTMLElement;

  // event.offsetX, event.offsetY gives the (x,y) offset from the edge of the canvas.

  // Add the event listeners for mousedown, mousemove, and mouseup
  //@ts-ignore
  myPics.addEventListener("mousedown", (e) => {
    x = e.offsetX;
    y = e.offsetY;
    isDrawing = true;
  });

  //@ts-ignore
  myPics.addEventListener("mousemove", (e) => {
    if (isDrawing) {
      drawLine(context, x, y, e.offsetX, e.offsetY);
      x = e.offsetX;
      y = e.offsetY;
    }
  });

  window.addEventListener("mouseup", (e) => {
    if (isDrawing) {
      drawLine(context, x, y, e.offsetX, e.offsetY);
      x = 0;
      y = 0;
      isDrawing = false;
    }
  });

  //@ts-ignore
  function drawLine(context, x1, y1, x2, y2) {
    context.beginPath();
    context.strokeStyle = "white";
    context.lineWidth = 1;
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.stroke();
    context.closePath();
  }
  //

  return (
    <div className="slider">
      <canvas id="myPics" width="560" height="360"></canvas>
      <label>{label}</label>
      <div id="slider-bar" className="slider-bar" onMouseDown={() => setDragging(true)}>
        <div className="slider-thumb" style={{ left: `${((value - min) / (max - min)) * 100}%` }}>
          <span>{value}</span>
        </div>
      </div>
    </div>
  );
}
