import { Search, BarChart3, Clock, Briefcase, CreditCard, Menu, X } from "lucide-react";
import { useUser, UserButton } from "@clerk/clerk-react";
import { NavLink } from "react-router-dom";
import { useState } from "react";

export default function TopNav({ company, setCompany, handleSubmit, loading }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user } = useUser();
  const displayName = user?.username || user?.fullName || user?.firstName || "Pulse User";
  const userEmail = "Investor";
  
  const navItems = [
    { path: "/", label: "Research", icon: <BarChart3 size={16} /> },
    { path: "/history", label: "History", icon: <Clock size={16} /> },
    { path: "/portfolio", label: "Portfolio", icon: <Briefcase size={16} /> },
    { path: "/pricing", label: "Pricing", icon: <CreditCard size={16} /> }
  ];

  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 w-full max-w-6xl z-50 px-4">
      <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.3)] flex items-center justify-between px-6 py-3">
        
        {/* Logo */}
        <NavLink to="/" className="flex items-center space-x-2 mr-6 cursor-pointer hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 text-white flex items-center justify-center font-black text-sm shadow-[0_0_15px_rgba(59,130,246,0.5)]">
            P
          </div>
          <span className="font-bold text-white tracking-tight hidden lg:block">Pulse</span>
        </NavLink>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden flex items-center text-slate-300 hover:text-white"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation menu"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Navigation Links (desktop) */}
        <nav className="hidden md:flex items-center space-x-1 mr-6 bg-slate-950/50 p-1 rounded-full border border-slate-800">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white shadow-inner border border-blue-500/30"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/50 border border-transparent"
                }`
              }
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Mobile navigation dropdown */}
        {menuOpen && ( /* Mobile dropdown with high z-index */
          <nav className="absolute top-full left-0 w-full bg-slate-900/95 backdrop-blur-md border-t border-slate-800 p-4 md:hidden rounded-b-lg shadow-lg">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center space-x-2 px-4 py-2 rounded-md text-base font-medium transition-colors ${
                    isActive
                      ? "bg-gradient-to-r from-blue-500/30 to-purple-500/30 text-white"
                      : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                  }`
                }
              >
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        )}

        {/* Search Bar */}
        <form onSubmit={handleSubmit} className="flex-1 max-w-sm relative mr-6 hidden sm:block">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search size={16} className="text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Search Ticker (e.g. NVDA)..."
            className="w-full bg-slate-950/50 border border-slate-700/50 text-white text-sm rounded-full py-2.5 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all placeholder-slate-500 shadow-inner backdrop-blur-sm"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            disabled={loading}
          />
        </form>

        {/* User Profile */}
        <div className="flex items-center space-x-3 pl-4 border-l border-slate-700/50">
          <div className="flex flex-col items-end">
            <span className="text-sm font-bold text-white">{displayName}</span>
            <span className="text-xs text-emerald-400 font-medium">Investor</span>
          </div>
          <UserButton 
            appearance={{
              elements: {
                avatarBox: "w-10 h-10 border-2 border-slate-700 rounded-full"
              }
            }}
          />
        </div>
      </div>
    </header>
  );
}
