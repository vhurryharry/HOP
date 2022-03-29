import "./App.css";

import { useState } from "react";
import { Button } from "@blueprintjs/core";

import PriceChart from "./components/PriceChart";
import SymbolSelect from "./components/SymbolSelect";
import { ISymbol } from "./utils/useSymbols";

const App = () => {
  const [symbol, setSymbol] = useState<ISymbol>();

  const getPrediction = () => {};

  return (
    <div className="app">
      <div>
        <SymbolSelect symbol={symbol} onSelect={setSymbol} />
        <Button
          className="ml-4"
          text="Get Prediction"
          onClick={getPrediction}
        />
      </div>

      <PriceChart symbol={symbol} />
    </div>
  );
};

export default App;
