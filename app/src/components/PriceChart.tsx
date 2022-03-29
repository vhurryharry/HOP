import { useMemo } from "react";
import usePriceData from "../utils/usePriceData";
import { ISymbol } from "../utils/useSymbols";

interface IPriceChartProps {
  symbol?: ISymbol;
}

const PriceChart = ({ symbol }: IPriceChartProps) => {
  const data = usePriceData(symbol?.symbol);

  const primaryAxis = useMemo(() => ({ getValue: (datum) => datum.date }), []);
  const secondaryAxes = useMemo(
    () => ({ getValue: (datum) => datum.price }),
    []
  );

  return <div>{symbol?.symbol || "No stock selected"}</div>;
};

export default PriceChart;
