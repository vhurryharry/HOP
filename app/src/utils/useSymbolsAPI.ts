import { useEffect, useState } from "react";
import useSWR, { Key, Fetcher } from "swr";

export interface ISymbol {
  symbol: string;
  name: string;
  exch: string;
  type: string;
  exchDisp: string;
  typeDisp: string;
}

const fetcher: Fetcher<Array<ISymbol>, string> = (query) => {
  console.log("fetching: ", query);
  if (!query) return [];

  return fetch(`/api/symbol/${query}`).then((res) => res.json());
};

const useSymbols = (query: string) => {
  const { data, error } = useSWR<Array<ISymbol>, string>(query, fetcher);

  return { data, error };
};

export default useSymbols;
