import { CheckCircle2, AlertOctagon, TrendingDown, Clock } from "lucide-react";

export default function ResultCard({ data }) {
  const { companyName, ticker, sector, decision } = data || {};

  if (!decision) {
    return <p className="text-slate-500 italic">No decision returned - check the server logs.</p>;
  }

  const isInvest = decision.verdict === "INVEST";

  // Use dynamic data from AI if available, otherwise fallback to empty arrays
  const criticalUpdates = decision.criticalUpdates || [];
  const metrics = decision.metrics || [];

  const isPositiveChange = decision.priceChange && !decision.priceChange.startsWith("-");
  const priceChangeColor = isPositiveChange ? "text-emerald-400" : "text-red-400";

  return (
    <div className="space-y-8">
      {/* Header section */}
      <div className="flex items-end justify-between border-b border-slate-800 pb-6">
        <div>
          <h2 className="text-4xl font-extrabold text-white mb-3">
            {companyName} {ticker ? <span className="text-slate-400 font-medium">({ticker})</span> : ""}
          </h2>
          <div className="flex space-x-3">
            {sector && (
              <span className="bg-slate-800 text-slate-300 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-slate-700">
                {sector}
              </span>
            )}
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-1">Last Updated: Just Now</div>
          <div className="text-3xl font-light text-white">
            {decision.price || "N/A"} <span className={`text-sm font-medium ${priceChangeColor}`}>({decision.priceChange || "N/A"})</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Final Synthesis & Sentiment Pulse */}
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 flex flex-col items-center justify-center text-center shadow-lg relative overflow-hidden">
            {/* Glowing background hint */}
            <div className={`absolute -top-10 -right-10 w-32 h-32 blur-[60px] rounded-full pointer-events-none ${isInvest ? 'bg-emerald-500/20' : 'bg-red-500/20'}`}></div>
            
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Final Synthesis</h3>
            
            <div className={`w-full py-4 rounded-xl border-2 mb-8 ${isInvest ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}>
              <span className="text-3xl font-black tracking-widest uppercase">{decision.verdict}</span>
            </div>
            
            <div className="text-5xl font-light text-white mb-2">{decision.confidence}%</div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6">Model Confidence</div>
            
            {/* Confidence Bar */}
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className={`h-full rounded-full ${isInvest ? 'bg-emerald-500' : 'bg-red-500'}`} style={{ width: `${decision.confidence}%` }}></div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center mb-4">
              <TrendingDown size={14} className="mr-2" />
              Sentiment Pulse
            </h3>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-sm font-medium border border-slate-700">High Volatility</span>
              <span className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-sm font-medium border border-slate-700">Revenue Growth</span>
              <span className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-sm font-medium border border-slate-700">Ecosystem Lock-in</span>
            </div>
          </div>
        </div>

        {/* Right Column: Research Breakdown & Updates */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-lg">
            <h3 className="text-xl font-bold text-white mb-6">Research Breakdown</h3>
            <div className="space-y-6">
              {decision.reasoning?.map((point, i) => {
                // Alternating icons just for visual reference styling
                const isGood = i % 2 === 0;
                return (
                  <div key={i} className="flex items-start">
                    <div className={`mt-1 flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full border ${isGood ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}>
                      {isGood ? <CheckCircle2 size={14} /> : <AlertOctagon size={14} />}
                    </div>
                    <div className="ml-4">
                      <h4 className="text-slate-200 font-semibold mb-1">{isGood ? "Financial Foundation" : "Technological Headwinds"}</h4>
                      <p className="text-slate-400 text-sm leading-relaxed">{point}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Critical Updates</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {criticalUpdates.map((update, i) => (
                <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center">
                    <Clock size={12} className="mr-1.5" />
                    {update.time}
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed font-medium">{update.text}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Comparative Metrics Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-slate-800">
          <h3 className="text-xl font-bold text-white">Comparative Metrics</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-800/50 text-xs font-bold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-bold">Metric</th>
                <th className="px-6 py-4 font-bold">{ticker || "Company"}</th>
                <th className="px-6 py-4 font-bold">Sector Avg</th>
                <th className="px-6 py-4 font-bold">Variance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {metrics.map((row, i) => (
                <tr key={i} className="hover:bg-slate-800/20 transition-colors">
                  <td className="px-6 py-4 font-semibold text-slate-300">{row.name}</td>
                  <td className="px-6 py-4 text-slate-400">{row.val}</td>
                  <td className="px-6 py-4 text-slate-400">{row.avg}</td>
                  <td className={`px-6 py-4 font-medium ${row.pos ? 'text-emerald-400' : 'text-red-400'}`}>
                    {row.var}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="text-center text-xs text-slate-600 italic pb-8">
        Generated by Pulse AI Core V3. Data synthesis current as of Market Close. Not financial advice.
      </div>

    </div>
  );
}
