import { useEffect, useState } from "react";

export interface IPriceData {}

const usePriceData = (symbol: string) => {
  const [priceData, setPriceData] = useState<IPriceData>();

  useEffect(() => {
    if (symbol) {
      fetch(`/api/${symbol}`)
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          // setPriceData(data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [symbol]);

  return {};
};

export default usePriceData;
