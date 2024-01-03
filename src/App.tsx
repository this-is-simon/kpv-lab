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
        <Slider
          label="Percentage Slider"
          max={100}
          min={0}
          step={10}
          value={50}
          unit={"%"}
          showIncrements
          showButtons
          onChange={(value: number) => console.log(`Percentage is ${value}%`)}
        />
        <Slider
          label="Decimal Slider"
          max={1}
          min={0}
          step={0.01}
          value={0}
          showIncrements
          showButtons
          onChange={(value: number) => console.log(`Proportional value is ${value}`)}
        />
      </header>
    </div>
  );
}

export default App;
