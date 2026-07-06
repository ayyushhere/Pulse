import React from 'react';
import { TrendingUp, TrendingDown } from "lucide-react";

export default function MarketTicker() {
  const tickerData = [
    { symbol: "S&P 500", price: "5,234.18", change: "+0.42%", up: true },
    { symbol: "NASDAQ", price: "16,401.84", change: "+0.85%", up: true },
    { symbol: "DOW", price: "39,127.14", change: "-0.15%", up: false },
    { symbol: "BTC", price: "$68,420", change: "+2.1%", up: true },
    { symbol: "ETH", price: "$3,450", change: "+1.2%", up: true },
    { symbol: "GOLD", price: "$2,165", change: "-0.3%", up: false },
    { symbol: "VIX", price: "13.4", change: "-2.5%", up: false },
    { symbol: "US10Y", price: "4.21%", change: "+0.01%", up: true },
  ];

  // Double the data to create a seamless infinite scroll loop
  const seamlessData = [...tickerData, ...tickerData];

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
