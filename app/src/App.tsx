import { useState } from "react";

import PriceChart from "./components/PriceChart";
import SymbolSelect from "./components/SymbolSelect";
import { ISymbol } from "./utils/useSymbols";

const App = () => {
  const [symbol, setSymbol] = useState<ISymbol>();

  return (
    <div className="w-screen h-screen flex flex-col bg-slate-900">
      <div className="p-5 pb-0 flex flex-row items-center">
        <img src="/logo.png" alt="logo" className="h-10 mr-4" />
        <SymbolSelect symbol={symbol} onSelect={setSymbol} />
      </div>

      <PriceChart symbol={symbol} />
    </div>
  );
};

export default App;
