import { useSearchStocks, getSearchStocksQueryKey } from "@workspace/api-client-react";
import { useState, useRef, useEffect } from "react";
import { Search, Loader2 } from "lucide-react";
import { useLocation } from "wouter";
import { Input } from "./input";

export function StockSearch() {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [, setLocation] = useLocation();
  const wrapperRef = useRef<HTMLDivElement>(null);

  const { data: results, isLoading } = useSearchStocks(
    { q: query },
    { query: { enabled: query.length > 1, queryKey: getSearchStocksQueryKey({ q: query }) } }
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (ticker: string) => {
    setQuery("");
    setIsOpen(false);
    setLocation(`/stock/${ticker}`);
  };

  return (
    <div ref={wrapperRef} className="relative w-full max-w-md z-50">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search ticker or company..."
          className="pl-9 bg-black/20 border-border/50 focus:border-primary/50"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
        />
        {isLoading && query.length > 1 && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-muted-foreground" />
        )}
      </div>

      {isOpen && query.length > 1 && results && (
        <div className="absolute top-full mt-2 w-full bg-card/95 backdrop-blur-md border border-border rounded-md shadow-lg overflow-hidden flex flex-col">
          {results.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No stocks found.
            </div>
          ) : (
            results.map((stock) => (
              <button
                key={stock.ticker}
                className="w-full text-left px-4 py-3 hover:bg-white/5 flex items-center justify-between border-b border-border/50 last:border-0 transition-colors"
                onClick={() => handleSelect(stock.ticker)}
              >
                <div>
                  <div className="font-semibold">{stock.ticker}</div>
                  <div className="text-xs text-muted-foreground truncate max-w-[200px]">{stock.name}</div>
                </div>
                <div className="text-right">
                  <div className="font-medium">${stock.price.toFixed(2)}</div>
                  <div className={`text-xs ${stock.change >= 0 ? "text-success" : "text-destructive"}`}>
                    {stock.change >= 0 ? "+" : ""}{stock.changePercent.toFixed(2)}%
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
