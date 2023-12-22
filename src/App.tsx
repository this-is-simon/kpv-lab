import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { Slider, SliderProps } from "./Slider";
import { useState } from "react";

const percentSliderData = {
  label: "Percentage Slider",
  max: 100,
  min: 0,
  step: 1,
  value: 2,
  unit: "percent",
  onChange: (value: number) => console.log("sliding"),
};

function App() {
  const [percentSlider, setPercentSlider] = useState<SliderProps>(percentSliderData);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <Slider {...percentSlider} />
      </header>
    </div>
  );
}

export default App;
