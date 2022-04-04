import { useEffect, useState } from "react";
import useSWR, { Key, Fetcher } from "swr";

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

const fetcher: Fetcher<IAPIPriceData, string> = (symbol) => {
  if (!symbol) return null;

  return fetch(`/api/${symbol}`).then((res) => res.json());
};

const usePriceData = (symbol: string) => {
  const [priceData, setPriceData] = useState<Array<IPrice>>();
  const { data: apiData, error } = useSWR<IAPIPriceData, string>(
    symbol,
    fetcher
  );

  useEffect(() => {
    if (apiData) {
      const timestamps = [...apiData.timestamps];

      for (let i = 0; i < 15; i++) {
        timestamps.push(timestamps[timestamps.length - 1] + 60 * 60 * 24);
      }

      const offset = apiData.prices.length + 15 - apiData.predictions.length;

      setPriceData(
        timestamps.map((timestamp, i) => ({
          timestamp: timestamp,
          price: apiData.prices[i],
          prediction: apiData.predictions[i - offset],
        }))
      );
    }
  }, [apiData]);

  return {
    symbol: apiData?.symbol,
    priceData,
    isLoading: !apiData && !error,
    error,
  };
};

export default usePriceData;
