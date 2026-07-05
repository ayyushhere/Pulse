import { useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import { Clock, ExternalLink } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export default function History({ onSelectCompany }) {
  const { getToken } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchHistory() {
      try {
        const token = await getToken();
        const res = await fetch(`${API_URL}/api/history`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        if (!res.ok) throw new Error("Failed to load history");
        const data = await res.json();
        setHistory(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchHistory();
  }, [getToken]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-950/50 border border-red-900/50 text-red-400 rounded-2xl">
        <p>Error: {error}</p>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="text-center p-12 bg-slate-900/50 backdrop-blur-md rounded-3xl border border-slate-800">
        <Clock size={48} className="mx-auto text-slate-600 mb-4" />
        <h3 className="text-2xl font-bold text-white mb-2">No History Found</h3>
        <p className="text-slate-400">You haven't researched any companies yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold text-white mb-8">Research History</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {history.map((item) => {
          const isInvest = item.verdict === "INVEST";
          
          return (
            <div 
              key={item.id} 
              className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-xl hover:-translate-y-1 transition-transform duration-300 relative overflow-hidden group cursor-pointer"
              onClick={() => onSelectCompany(item)}
            >
              {/* Subtle glowing orb inside card */}
              <div className={`absolute -top-10 -right-10 w-32 h-32 blur-[50px] rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${isInvest ? 'bg-emerald-500/20' : 'bg-red-500/20'}`}></div>

              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white">{item.companyName}</h3>
                  <span className="text-xs font-semibold text-slate-500 tracking-widest uppercase">
                    {item.ticker || "UNKNOWN"}
                  </span>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
                  isInvest ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-red-500/10 border-red-500/30 text-red-400'
                }`}>
                  {item.verdict}
                </div>
              </div>
              
              <div className="mb-6">
                <div className="flex justify-between text-xs text-slate-400 mb-1 font-medium uppercase tracking-wider">
                  <span>Confidence</span>
                  <span>{item.confidence}%</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${isInvest ? 'bg-emerald-500' : 'bg-red-500'}`} style={{ width: `${item.confidence}%` }}></div>
                </div>
              </div>

              <div className="flex items-center justify-between text-slate-500 text-xs font-medium border-t border-slate-800 pt-4">
                <span className="flex items-center">
                  <Clock size={12} className="mr-1" />
                  {new Date(item.createdAt).toLocaleDateString()}
                </span>
                <span className="flex items-center text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  View Research <ExternalLink size={12} className="ml-1" />
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
}
