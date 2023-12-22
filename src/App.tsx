import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { Slider } from "./Slider";
import { useState } from "react";

function App() {
  // const [percentSlider, setPercentSlider] = useState<SliderProps>(percentSliderData);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <Slider />
      </header>
    </div>
  );
}

export default App;
