import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { Slider } from "./Slider";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <div
          style={{
            border: "2px solid red",
            width: "100%",
            maxWidth: "500px",
          }}
        >
          <div
            style={{
              border: "2px solid yellow",
              height: "100px",
              display: "flex",
              minWidth: "200px",
              margin: "20px",
            }}
          />
        </div>
        <Slider
          label="Percentage Slider"
          max={100}
          min={0}
          step={5}
          value={50}
          unit={"%"}
          showIncrements
          onChange={(value: number) => console.log(`Percentage is ${value}%`)}
        />
        <Slider
          label="Decimal Slider"
          max={1}
          min={0}
          step={0.01}
          value={0}
          onChange={(value: number) => console.log(`Proportional value is ${value}%`)}
        />
      </header>
    </div>
  );
}

export default App;
