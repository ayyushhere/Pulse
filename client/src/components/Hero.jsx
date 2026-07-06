import { SignInButton, SignUpButton, SignedOut } from "@clerk/clerk-react";
import { ArrowRight, Sparkles, CheckCircle, Mail } from "lucide-react";
import Pricing from "./Pricing.jsx";
// TODO: Add hero illustration image at src/assets/hero.png and import below
// import heroImg from "../assets/hero.png";

export default function Hero() {
  return (
    <div className="w-full flex flex-col min-h-screen overflow-y-auto overflow-x-hidden relative">
      
      {/* Public Navbar */}
      <nav className="absolute top-0 left-0 w-full z-50 px-8 py-6 flex justify-between items-center max-w-7xl mx-auto right-0">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.4)] text-slate-900 font-black">
            P
          </div>
          <span className="text-2xl font-bold text-white tracking-tight">Pulse</span>
        </div>
        
        <div className="flex items-center space-x-4">
          <SignInButton mode="modal" fallbackRedirectUrl="/" forceRedirectUrl="/">
            <button className="text-slate-300 hover:text-white font-medium transition-colors px-4 py-2">
              Log in
            </button>
          </SignInButton>
          <SignUpButton mode="modal" fallbackRedirectUrl="/" forceRedirectUrl="/">
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

        <div className="z-10 text-center max-w-5xl mx-auto w-full flex flex-col items-center">
          
          <h1 className="text-5xl md:text-7xl font-medium text-white mb-6 tracking-tight leading-tight text-glow max-w-4xl">
            Institutional-Grade AI Investment Research
          </h1>

          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto font-light leading-relaxed mb-10">
            Pulse instantly analyzes real-time market data, breaking news, and investor sentiment to deliver actionable insights on any stock in seconds.
          </p>

          <SignedOut>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-20">
              <SignInButton mode="modal" fallbackRedirectUrl="/" forceRedirectUrl="/">
                <button className="w-full sm:w-auto px-8 py-3.5 bg-white hover:bg-slate-100 text-slate-900 font-semibold rounded-full shadow-[0_0_30px_rgba(255,255,255,0.3)] transition-all duration-300">
                  Get Started, Free Trial!
                </button>
              </SignInButton>

              <button className="w-full sm:w-auto px-8 py-3.5 bg-transparent border border-white/30 hover:border-white/60 text-white font-medium rounded-full transition-all duration-300">
                Watch a Demo
              </button>
            </div>
          </SignedOut>

          {/* Central Glassmorphic Video/GIF Container */}
          <div className="w-full max-w-4xl mx-auto relative group">
            {/* Ambient Glow behind the video */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-[2rem] blur-xl group-hover:blur-2xl transition-all duration-500 opacity-50" />
            
            <div className="relative w-full aspect-video bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2rem] shadow-2xl overflow-hidden flex flex-col items-center justify-center">
              
              <img src="/demo.gif" alt="Pulse App Demo" className="w-full h-full object-cover rounded-[2rem]" />

              {/* Decorative elements representing integrations (like the screenshot) */}
              <div className="absolute left-[-2rem] top-1/2 -translate-y-1/2 flex flex-col space-y-4">
                <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-lg"><CheckCircle size={18} className="text-blue-400"/></div>
                <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-lg"><Sparkles size={18} className="text-purple-400"/></div>
              </div>
              <div className="absolute right-[-2rem] top-1/2 -translate-y-1/2 flex flex-col space-y-4">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.4)] text-slate-900 font-black text-sm">P</div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* Pricing Section */}
      <section className="relative py-16 bg-black/20 border-t border-white/10 backdrop-blur-sm z-10">
        <Pricing />
      </section>

      {/* Developer Footer */}
      <footer className="w-full bg-transparent py-12 border-t border-white/10 relative z-10 text-center">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center">
          <div className="w-10 h-10 rounded-full bg-white text-slate-900 flex items-center justify-center font-black shadow-[0_0_15px_rgba(255,255,255,0.5)] mb-6">
            P
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Developed by Ayush</h3>
          <p className="text-slate-400 max-w-md mx-auto mb-8 text-sm">
            Built with React, Node.js, LangGraph, and Google Gemini. Part of a full-stack AI engineering assignment showcasing autonomous agentic workflows.
          </p>
          <div className="flex space-x-6">
            <a href="https://github.com/ayyushhere" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white hover:scale-110 transition-all duration-300 flex items-center justify-center w-12 h-12 rounded-full bg-white/5 border border-white/10 hover:bg-white/10">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
            </a>
            <a href="https://linkedin.com/in/ayyushhere" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white hover:scale-110 transition-all duration-300 flex items-center justify-center w-12 h-12 rounded-full bg-white/5 border border-white/10 hover:bg-white/10">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
            </a>
            <a href="mailto:contact@ayush.com" className="text-slate-400 hover:text-white hover:scale-110 transition-all duration-300 flex items-center justify-center w-12 h-12 rounded-full bg-white/5 border border-white/10 hover:bg-white/10">
              <Mail size={20} />
            </a>
          </div>
          <p className="text-slate-600 text-xs mt-12">
            © {new Date().getFullYear()} Pulse AI Investment Research. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
