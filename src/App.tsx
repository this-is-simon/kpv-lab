import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { Slider } from "./Slider";
import { useState } from "react";

function App() {
  const [percentSlider, setPercentSlider] = useState<number>();

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <Slider
          label="Percentage Slider"
          max={100}
          min={0}
          step={5}
          value={50}
          unit={"chickens"}
          onChange={(value: number) => setPercentSlider(value)}
        />
        <Slider
          label="Decimal Slider"
          max={1}
          min={0}
          step={0.01}
          value={0}
          unit={"Decimals"}
          onChange={(value: number) => setPercentSlider(value)}
        />
      </header>
    </div>
  );
}

export default App;
