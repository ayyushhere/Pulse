import { Briefcase, Link2, TrendingUp, ShieldCheck } from "lucide-react";

export default function Portfolio() {
  const brokerages = [
    { name: "Robinhood", color: "from-emerald-400 to-emerald-600" },
    { name: "Fidelity", color: "from-green-600 to-green-800" },
    { name: "Charles Schwab", color: "from-blue-400 to-blue-600" },
    { name: "Interactive Brokers", color: "from-red-500 to-red-700" },
    { name: "E*TRADE", color: "from-purple-500 to-purple-700" }
  ];

  return (
    <div className="max-w-5xl mx-auto py-8">
      <div className="text-center mb-16">
        <div className="inline-block mb-4 px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 backdrop-blur-md text-blue-400 text-sm font-bold tracking-widest uppercase">
          Coming Soon
        </div>
        <h2 className="text-5xl font-black text-white mb-6">Portfolio Integration</h2>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Soon you'll be able to securely connect your brokerage accounts to automatically track your investments against our AI-generated verdicts.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 p-8 rounded-3xl text-center shadow-xl hover:-translate-y-1 transition-all duration-300">
          <div className="w-16 h-16 mx-auto bg-blue-500/20 text-blue-400 rounded-2xl flex items-center justify-center mb-6 border border-blue-500/30">
            <Link2 size={32} />
          </div>
          <h3 className="text-xl font-bold text-white mb-3">One-Click Connect</h3>
          <p className="text-slate-400">Seamlessly link your accounts using Plaid's secure infrastructure.</p>
        </div>
        
        <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 p-8 rounded-3xl text-center shadow-xl hover:-translate-y-1 transition-all duration-300">
          <div className="w-16 h-16 mx-auto bg-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center mb-6 border border-emerald-500/30">
            <TrendingUp size={32} />
          </div>
          <h3 className="text-xl font-bold text-white mb-3">Live Tracking</h3>
          <p className="text-slate-400">Monitor your portfolio's performance against Pulse's market synthesis.</p>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 p-8 rounded-3xl text-center shadow-xl hover:-translate-y-1 transition-all duration-300">
          <div className="w-16 h-16 mx-auto bg-purple-500/20 text-purple-400 rounded-2xl flex items-center justify-center mb-6 border border-purple-500/30">
            <ShieldCheck size={32} />
          </div>
          <h3 className="text-xl font-bold text-white mb-3">Bank-Grade Security</h3>
          <p className="text-slate-400">Your data is encrypted. We only have read access to your holdings.</p>
        </div>
      </div>

      <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-10 shadow-[0_0_50px_rgba(0,0,0,0.3)]">
        <h3 className="text-2xl font-bold text-white mb-8 text-center">Supported Brokerages Preview</h3>
        <div className="flex flex-wrap justify-center gap-4">
          {brokerages.map((broker) => (
            <div 
              key={broker.name} 
              className="flex items-center space-x-3 bg-slate-950/80 border border-slate-800 px-6 py-4 rounded-xl opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300 cursor-not-allowed shadow-md"
            >
              <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${broker.color}`}></div>
              <span className="font-semibold text-slate-300">{broker.name}</span>
            </div>
          ))}
          <div className="flex items-center space-x-3 bg-slate-950/80 border border-slate-800 border-dashed px-6 py-4 rounded-xl opacity-60">
            <span className="font-semibold text-slate-500">+ 12,000 more</span>
          </div>
        </div>
      </div>
    </div>
  );
}
