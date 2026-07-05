import { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { useAuth, SignedIn, SignedOut } from "@clerk/clerk-react";
import { Search, ArrowLeft, Loader2, Coffee } from "lucide-react";
import ResultCard from "./components/ResultCard.jsx";
import TopNav from "./components/TopNav.jsx";
import Portfolio from "./components/Portfolio.jsx";
import Hero from "./components/Hero.jsx";
import History from "./components/History.jsx";
import Pricing from "./components/Pricing.jsx";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export default function App() {
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const [company, setCompany] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState("Initializing AI Agent...");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [serverWaking, setServerWaking] = useState(true);
  const [countdown, setCountdown] = useState(50);

  useEffect(() => {
    let intervalId;
    const checkHealth = async () => {
      try {
        const res = await fetch(`${API_URL}/api/health`);
        if (res.ok) {
          setServerWaking(false);
          clearInterval(intervalId);
        }
      } catch (err) {
        // Still sleeping
      }
    };
    checkHealth();
    intervalId = setInterval(() => {
      checkHealth();
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);
  
  const handleSelectCompany = (itemOrTicker) => {
    if (typeof itemOrTicker === "string") {
      setCompany(itemOrTicker);
      handleSubmit(null, itemOrTicker);
    } else {
      setCompany(itemOrTicker.companyName);
      if (itemOrTicker.fullData) {
        setResult(itemOrTicker.fullData);
        navigate("/");
      } else {
        handleSubmit(null, itemOrTicker.companyName);
        navigate("/");
      }
    }
  };

  const handleSubmit = async (e, forceCompany = null) => {
    if (e) e.preventDefault();
    const searchTarget = forceCompany || company;
    if (!searchTarget.trim()) return;
    
    setLoading(true);
    setLoadingStep("Initializing AI Agent...");
    setError(null);
    setResult(null);

    try {
      const token = await getToken();
      const response = await fetch(`${API_URL}/api/research`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ company: searchTarget }),
      });

      if (!response.ok) {
        const errText = await response.text();
        console.error("Backend Error:", response.status, errText);
        throw new Error(`Failed to fetch research data (${response.status})`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      
      let done = false;
      let buffer = "";
      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        if (value) {
          buffer += decoder.decode(value, { stream: true });
          const parts = buffer.split('\n\n');
          buffer = parts.pop();
          
          for (const part of parts) {
            const lines = part.split('\n');
            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const dataStr = line.replace('data: ', '').trim();
                if (!dataStr) continue;
                try {
                  const parsed = JSON.parse(dataStr);
                  if (parsed.type === 'complete') {
                    setResult(parsed.state);
                  } else if (parsed.type === 'progress') {
                    if (parsed.state.marketAnalysis) setLoadingStep("Finalizing Investment Verdict...");
                    else if (parsed.state.financialAnalysis) setLoadingStep("Analyzing Market Sentiment & News...");
                    else if (parsed.state.researchData?.news) setLoadingStep("Performing Deep Financial Analysis...");
                    else if (parsed.state.researchData?.financials) setLoadingStep("Scanning Global News Sources...");
                    else setLoadingStep("Initializing AI Agent...");
                  } else if (parsed.type === 'error') {
                    throw new Error(parsed.message || "Unknown error");
                  }
                } catch (e) {
                  console.error("Error parsing chunk:", e, dataStr);
                }
              }
            }
          }
        }
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "An error occurred while researching. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-200 selection:bg-blue-500/30 overflow-x-hidden">
      
      {serverWaking && (
        <div className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl max-w-md w-full text-center shadow-2xl animate-in fade-in zoom-in duration-500">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <Coffee size={48} className="text-blue-500 animate-pulse" />
                <Loader2 size={24} className="text-purple-500 absolute -bottom-2 -right-2 animate-spin" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Waking up the AI Brains...</h2>
            <p className="text-slate-400 mb-6 text-sm leading-relaxed">
              Our Render free-tier server takes a quick nap after 15 minutes of inactivity. Please cooperate, we are broke college students! 😅
            </p>
            <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 flex items-center justify-between">
              <span className="text-slate-300 font-medium">Spinning up engines</span>
              <span className="text-blue-400 font-bold font-mono text-xl">{countdown}s</span>
            </div>
          </div>
        </div>
      )}

      {/* Global Background Glows */}
      <div className="fixed top-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="fixed bottom-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none z-0" />

      <SignedOut>
        <div className="relative z-10">
          <Hero />
        </div>
      </SignedOut>

      <SignedIn>
        <div className="flex flex-col min-h-screen relative z-10">
          <TopNav 
            company={company} 
            setCompany={setCompany} 
            handleSubmit={handleSubmit} 
            loading={loading} 
          />
          
          <main className="flex-1 pt-28 pb-12 px-6 max-w-6xl mx-auto w-full">
            <Routes>
              
              <Route path="/" element={
                <div className="animate-in fade-in zoom-in-95 duration-300 h-full">
                  {!loading && !result && !error && (
                    <div className="flex flex-col items-center justify-center min-h-[60vh]">
                      <div className="mb-12 text-center">
                        <div className="w-20 h-20 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_50px_rgba(59,130,246,0.15)]">
                          <Search size={32} className="text-blue-400" />
                        </div>
                        <h2 className="text-4xl font-black text-white mb-3">Begin Your Research</h2>
                        <p className="text-lg text-slate-400 max-w-lg mx-auto leading-relaxed mb-8">
                          Enter a company name or ticker to generate an AI-powered invest/pass verdict.
                        </p>
                        
                        <form onSubmit={handleSubmit} className="relative max-w-xl mx-auto w-full">
                          <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                            <Search size={20} className="text-slate-400" />
                          </div>
                          <input
                            type="text"
                            placeholder="Search company (e.g. Amazon, NFLX)..."
                            className="w-full bg-slate-900/60 border border-slate-700 text-white text-lg rounded-full py-4 pl-14 pr-6 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-2xl backdrop-blur-md"
                            value={company}
                            onChange={(e) => setCompany(e.target.value)}
                            disabled={loading}
                          />
                          <button 
                            type="submit" 
                            disabled={loading || !company.trim()}
                            className="absolute right-2 top-2 bottom-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold rounded-full px-6 transition-colors"
                          >
                            Analyze
                          </button>
                        </form>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                        <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6 cursor-pointer hover:bg-slate-800/60 hover:-translate-y-1 transition-all duration-300 shadow-xl" onClick={() => handleSelectCompany("Nvidia")}>
                          <div className="flex justify-between items-start mb-3">
                            <h3 className="font-bold text-white text-xl">Nvidia (NVDA)</h3>
                            <span className="bg-emerald-500/10 text-emerald-400 text-xs font-bold px-2.5 py-1 rounded-full border border-emerald-500/20">+2.4%</span>
                          </div>
                          <p className="text-sm text-slate-400 leading-relaxed">Trending heavily due to new Blackwell AI chip announcements and stellar earnings.</p>
                        </div>
                        <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6 cursor-pointer hover:bg-slate-800/60 hover:-translate-y-1 transition-all duration-300 shadow-xl" onClick={() => handleSelectCompany("Tesla")}>
                          <div className="flex justify-between items-start mb-3">
                            <h3 className="font-bold text-white text-xl">Tesla (TSLA)</h3>
                            <span className="bg-red-500/10 text-red-400 text-xs font-bold px-2.5 py-1 rounded-full border border-red-500/20">-1.2%</span>
                          </div>
                          <p className="text-sm text-slate-400 leading-relaxed">High volatility following recent margin concerns and robotaxi event announcements.</p>
                        </div>
                        <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6 cursor-pointer hover:bg-slate-800/60 hover:-translate-y-1 transition-all duration-300 shadow-xl" onClick={() => handleSelectCompany("Microsoft")}>
                          <div className="flex justify-between items-start mb-3">
                            <h3 className="font-bold text-white text-xl">Microsoft (MSFT)</h3>
                            <span className="bg-emerald-500/10 text-emerald-400 text-xs font-bold px-2.5 py-1 rounded-full border border-emerald-500/20">+0.8%</span>
                          </div>
                          <p className="text-sm text-slate-400 leading-relaxed">Steady growth driven by Azure cloud expansion and Copilot enterprise adoption.</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {loading && (
                    <div className="flex flex-col items-center justify-center py-20 animate-in fade-in duration-500">
                      <div className="relative w-24 h-24 mb-8">
                        {/* Outer rotating ring */}
                        <div className="absolute inset-0 border-4 border-slate-800 border-t-blue-500 border-r-purple-500 rounded-full animate-[spin_1.5s_linear_infinite]"></div>
                        {/* Inner rotating ring */}
                        <div className="absolute inset-3 border-4 border-slate-800 border-b-emerald-500 rounded-full animate-[spin_2s_linear_infinite_reverse]"></div>
                        {/* Center glowing dot */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse shadow-[0_0_15px_rgba(96,165,250,0.8)]"></div>
                        </div>
                      </div>
                      
                      <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-4 tracking-tight animate-pulse">
                        Analyzing {company}...
                      </h2>
                      
                      <div className="flex items-center space-x-3 bg-slate-900/60 backdrop-blur-md border border-slate-700/50 px-6 py-3 rounded-full shadow-lg">
                        <div className="w-2 h-2 rounded-full bg-blue-500 animate-[ping_1.5s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
                        <p className="text-slate-300 font-medium tracking-wide">
                          {loadingStep}
                        </p>
                      </div>
                    </div>
                  )}

                  {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-6 rounded-2xl mb-8 flex items-start">
                      <span className="mr-3">⚠️</span>
                      <p>{error}</p>
                    </div>
                  )}

                  {result && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 w-full max-w-6xl mx-auto">
                      <button 
                        onClick={() => { setResult(null); setCompany(""); }}
                        className="mb-6 flex items-center text-sm font-medium text-slate-400 hover:text-white transition-colors bg-slate-900/50 px-4 py-2 rounded-full border border-slate-700/50 hover:bg-slate-800 shadow-sm w-fit"
                      >
                        <ArrowLeft size={16} className="mr-2" />
                        Back to Search
                      </button>
                      <ResultCard data={result} />
                    </div>
                  )}
                </div>
              } />

              <Route path="/history" element={
                <div className="animate-in fade-in zoom-in-95 duration-300">
                  <History onSelectCompany={handleSelectCompany} />
                </div>
              } />

              <Route path="/portfolio" element={
                <div className="animate-in fade-in zoom-in-95 duration-300">
                  <Portfolio />
                </div>
              } />

              <Route path="/pricing" element={
                <div className="animate-in fade-in zoom-in-95 duration-300">
                  <Pricing />
                </div>
              } />

            </Routes>
          </main>
        </div>
      </SignedIn>
    </div>
  );
}
