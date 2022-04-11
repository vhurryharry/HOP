import { useState } from "react";
import { SWRConfig } from "swr";

import PriceChart from "./components/PriceChart";
import SymbolSelect from "./components/SymbolSelectAPI";
import { ISymbol } from "./utils/useSymbolsAPI";

const App = () => {
  const [symbol, setSymbol] = useState<ISymbol>();

  return (
    <SWRConfig
      value={{
        dedupingInterval: 1000 * 60 * 60 * 8,
      }}
    >
      <div className="w-screen h-screen flex flex-col bg-slate-900">
        <div className="p-5 pb-0 flex flex-row items-center">
          <img src="/logo.png" alt="logo" className="h-10 mr-4" />
          <SymbolSelect symbol={symbol} onSelect={setSymbol} />
        </div>

        <PriceChart symbol={symbol} />
      </div>
    </SWRConfig>
  );
};

export default App;
