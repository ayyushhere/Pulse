import React, { useState, useEffect } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export default function MarketTicker() {
  const [tickerData, setTickerData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickerData = async () => {
      try {
        const response = await fetch(`${API_URL}/api/ticker`);
        if (response.ok) {
          const data = await response.json();
          setTickerData(data);
        }
      } catch (err) {
        console.error("Failed to fetch market ticker data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTickerData();
    // Refresh every 60 seconds
    const interval = setInterval(fetchTickerData, 60000);
    return () => clearInterval(interval);
  }, []);

  // Duplicate data to create a seamless scrolling effect
  const seamlessData = tickerData.length > 0 ? [...tickerData, ...tickerData, ...tickerData] : [];

  if (loading && tickerData.length === 0) {
    return (
      <div className="fixed top-0 left-0 right-0 z-40 w-full bg-[#07091D]/90 backdrop-blur-md border-b border-white/10 overflow-hidden flex items-center justify-center h-10">
        <span className="text-slate-400 text-xs font-mono animate-pulse">Loading Live Market Data...</span>
      </div>
    );
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-40 w-full bg-[#07091D]/90 backdrop-blur-md border-b border-white/10 overflow-hidden flex items-center h-10 hover-pause group">
      <div className="flex animate-marquee whitespace-nowrap min-w-full">
        {seamlessData.map((item, idx) => (
          <div key={idx} className="flex items-center space-x-2 px-8 border-r border-white/10 last:border-0">
            <span className="text-slate-300 text-xs font-semibold tracking-wider">{item.symbol}</span>
            <span className="text-white text-xs font-medium">{item.price}</span>
            <span className={`flex items-center text-xs font-bold ${item.up ? 'text-emerald-400' : 'text-red-400'}`}>
              {item.change}
              {item.up ? <TrendingUp size={12} className="ml-1" /> : <TrendingDown size={12} className="ml-1" />}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
