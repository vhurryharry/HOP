import { useEffect, useState } from "react";

export interface IAPIPriceData {
  symbol: string;
  timestamps: Array<number>;
  prices: Array<number>;
  predictions: Array<number>;
}

export interface IPrice {
  timestamp: number;
  price: number;
  prediction: number;
}

export interface IPriceData {
  symbol: string;
  data: Array<IPrice>;
}

const usePriceData = (symbol: string) => {
  const [priceData, setPriceData] = useState<IPriceData>();

  useEffect(() => {
    if (symbol) {
      setPriceData(null);

      fetch(`/api/${symbol}`)
        .then((res) => res.json())
        .then((data: IAPIPriceData) => {
          setPriceData({
            symbol: data.symbol,
            data: data.timestamps.map((timestamp, i) => ({
              timestamp: timestamp,
              price: data.prices[i],
              prediction: data.predictions[i],
            })),
          });
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [symbol]);

  return priceData;
};

export default usePriceData;
