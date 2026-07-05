import { SignInButton, SignUpButton, SignedOut } from "@clerk/clerk-react";
import { ArrowRight, Sparkles, CheckCircle } from "lucide-react";
import Pricing from "./Pricing.jsx";
// TODO: Add hero illustration image at src/assets/hero.png and import below
// import heroImg from "../assets/hero.png";

export default function Hero() {
  return (
    <div className="w-full flex flex-col min-h-screen overflow-y-auto overflow-x-hidden relative">
      
      {/* Public Navbar */}
      <nav className="absolute top-0 left-0 w-full z-50 px-8 py-6 flex justify-between items-center max-w-7xl mx-auto right-0">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-500 to-purple-500 text-white flex items-center justify-center font-black shadow-lg">
            P
          </div>
          <span className="text-2xl font-bold text-white tracking-tight">Pulse</span>
        </div>
        
        <div className="flex items-center space-x-4">
          <SignInButton mode="modal" fallbackRedirectUrl="/" forceRedirectUrl="/" asChild>
            <button className="text-slate-300 hover:text-white font-medium transition-colors px-4 py-2">
              Log in
            </button>
          </SignInButton>
          <SignUpButton mode="modal" fallbackRedirectUrl="/" forceRedirectUrl="/" asChild>
            <button className="bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/10 px-5 py-2 rounded-xl font-medium transition-all duration-300">
              Sign Up
            </button>
          </SignUpButton>
        </div>
      </nav>

        {/* Hero Landing Section */}
        <section className="relative pt-32 pb-20 px-8 flex flex-col items-center justify-center min-h-[85vh] overflow-hidden">
          
          {/* Background illustration placeholder */}
          {/* Place hero illustration at src/assets/hero.png and uncomment the line below */}
          {/* <img src={heroImg} alt="Hero illustration" className="absolute inset-0 w-full h-full object-cover opacity-30" /> */}
          
          {/* Glassmorphic Background Glows */}
          <div className="absolute top-[10%] right-[20%] w-[40vw] h-[40vw] bg-blue-600/20 rounded-full blur-[150px] pointer-events-none z-0" />
          <div className="absolute bottom-[10%] left-[20%] w-[40vw] h-[40vw] bg-purple-600/20 rounded-full blur-[150px] pointer-events-none z-0" />

        <div className="z-10 text-center max-w-4xl mx-auto mb-12">
          
          <div className="inline-block mb-6 px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 backdrop-blur-md">
            <span className="text-sm font-medium text-blue-400 flex items-center">
              <Sparkles size={16} className="mr-2" />
              Pulse AI Core V3 Now Live
            </span>
          </div>

            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight leading-tight">
              AI‑Powered Stock Research, <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
                Made Simple.
              </span>
            </h1>

            <p className="text-lg md:text-2xl text-slate-400 max-w-3xl mx-auto font-light leading-relaxed mb-10">
              Get instant, deep research, market sentiment, and clear buy/sell recommendations for any listed company – all powered by our LangGraph AI.
            </p>

            {/* Feature Highlights */}
            <ul className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12 text-slate-300">
              <li className="flex items-start space-x-3">
                <CheckCircle className="w-6 h-6 text-blue-400" />
                <span>Instant AI research for any ticker</span>
              </li>
              <li className="flex items-start space-x-3">
                <CheckCircle className="w-6 h-6 text-blue-400" />
                <span>Real‑time sentiment & news analysis</span>
              </li>
              <li className="flex items-start space-x-3">
                <CheckCircle className="w-6 h-6 text-blue-400" />
                <span>Clear buy / sell verdicts</span>
              </li>
            </ul>

            <SignedOut>
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                <SignInButton mode="modal" fallbackRedirectUrl="/" forceRedirectUrl="/" asChild>
                  <button className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500 text-white font-bold rounded-2xl shadow-[0_0_40px_rgba(59,130,246,0.4)] transition-all duration-300 flex items-center justify-center group">
                    Sign In
                    <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </button>
                </SignInButton>

                <SignUpButton mode="modal" fallbackRedirectUrl="/" forceRedirectUrl="/" asChild>
                  <button className="w-full sm:w-auto px-8 py-4 bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 hover:bg-slate-800/80 text-white font-bold rounded-2xl transition-all duration-300">
                    Create Account
                  </button>
                </SignUpButton>
              </div>
            </SignedOut>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="relative py-16 bg-slate-950/50 border-t border-slate-800/50 backdrop-blur-sm z-10">
        <Pricing />
      </section>
    </div>
  );
}
