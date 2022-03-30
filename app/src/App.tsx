import { useState } from "react";

import PriceChart from "./components/PriceChart";
import SymbolSelect from "./components/SymbolSelect";
import { ISymbol } from "./utils/useSymbols";

const App = () => {
  const [symbol, setSymbol] = useState<ISymbol>();

  return (
    <div className="w-screen h-screen p-5">
      <div>
        <SymbolSelect symbol={symbol} onSelect={setSymbol} />
      </div>

      <PriceChart symbol={symbol} />
    </div>
  );
};

export default App;
