import { useEffect, useState } from "react";
import Papa from "papaparse";

export interface ISymbol {
  symbol: string;
  name: string;
  sector: string;
  industry: string;
}

const useSymbols = (keyword?: string) => {
  const [symbols, setSymbols] = useState<ISymbol[]>([]);

  useEffect(() => {
    Papa.parse<ISymbol>("/symbols.csv", {
      download: true,
      header: true,
      complete: (results) => {
        setSymbols(results.data);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }, []);

  return {
    symbols: symbols
      .filter((symbol) => {
        if (keyword) {
          return (
            symbol.name.toLowerCase().includes(keyword.toLowerCase()) ||
            symbol.symbol.toLowerCase().includes(keyword.toLowerCase())
          );
        }

        return true;
      })
      .slice(0, 50),
    loading: symbols.length === 0,
  };
};

export default useSymbols;
