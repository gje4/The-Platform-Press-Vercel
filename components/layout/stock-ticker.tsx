// Removed getLocale import since we're only showing deltas
import type { Stock } from "@/lib/types";

async function getStocks(): Promise<Stock[]> {
  try {
    // In a server component, we need to use the full URL
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : 'http://localhost:3000';
    
    const res = await fetch(`${baseUrl}/api/stocks`, { 
      cache: "no-store",
      next: { revalidate: 60 } // Revalidate every 60 seconds
    });
    
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data?.stocks) ? data.stocks : [];
  } catch {
    return [];
  }
}

// Remove formatPrice function since we're only showing deltas

export async function StockTicker() {
  const stocks = await getStocks();

  if (stocks.length === 0) {
    return (
      <div className="relative text-sm font-medium text-neutral-700 text-center">
        <div className="h-16 flex items-center justify-center text-foreground/60">
          Loading…
        </div>
      </div>
    );
  }

  // Total duration of animation
  // The delay between each item is the total duration divided by the number of items
  const totalDuration = 10; 
  
  return (
    <div className="relative text-sm font-medium text-neutral-700 text-center">
      <div className="relative h-16 flex items-center justify-center overflow-hidden">
        {stocks.map((stock, index) => (
          <div
            key={stock.symbol}
            className="cycling-item absolute inset-0 flex items-center justify-center font-light text-foreground opacity-0 will-change-opacity"
            style={{ 
              animationDelay: `${index * (totalDuration / stocks.length)}s`,
              animationFillMode: 'both'
            }}
          >
            <div className="flex items-center gap-3">
              <span className="font-medium text-foreground">{stock.symbol}</span>
              <span className={`text-sm font-medium ${
                stock.isPositive ? 'text-green-600' : 'text-red-600'
              }`}>
                {stock.isPositive ? '+' : ''}{stock.change}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}