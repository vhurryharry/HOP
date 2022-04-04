import { useState } from "react";
import { Button, MenuItem } from "@blueprintjs/core";
import { Select, ItemRenderer } from "@blueprintjs/select";
import useSymbols, { ISymbol } from "../utils/useSymbols";

interface ISymbolSelectProps {
  onSelect: (symbol: ISymbol) => void;
  symbol: ISymbol;
}

const SymbolSelect = Select.ofType<ISymbol>();

const SymbolSelectWrapper = ({ symbol, onSelect }: ISymbolSelectProps) => {
  const [query, setQuery] = useState("");
  const symbols = useSymbols(query);

  const renderSymbol: ItemRenderer<ISymbol> = (
    symbol,
    { handleClick, modifiers }
  ) => {
    if (!modifiers.matchesPredicate) {
      return null;
    }

    return (
      <MenuItem
        active={modifiers.active}
        key={symbol.symbol}
        onClick={handleClick}
        text={`${symbol.symbol} - ${symbol.name}`}
        label={symbol.industry}
      />
    );
  };

  return (
    <SymbolSelect
      items={symbols.symbols}
      itemRenderer={renderSymbol}
      onItemSelect={onSelect}
      noResults={<MenuItem disabled={true} text="No results." />}
      className="w-5 grow"
      filterable={true}
      query={query}
      onQueryChange={setQuery}
      popoverProps={{
        popoverClassName: "max-h-96 overflow-y-auto",
      }}
    >
      <Button
        text={
          symbol ? `${symbol.symbol} - ${symbol.name}` : "Please select a stock"
        }
        rightIcon="double-caret-vertical"
      />
    </SymbolSelect>
  );
};

export default SymbolSelectWrapper;
