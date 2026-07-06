import { Check, Zap, Crown, Shield } from "lucide-react";

export default function Pricing() {
  const plans = [
    {
      name: "Starter",
      price: "Free",
      description: "Perfect for testing the waters.",
      icon: <Shield size={24} className="text-blue-400" />,
      color: "from-blue-600/20 to-blue-900/20",
      border: "border-blue-500/30",
      features: ["5 AI Researches per month", "Basic Sentiment Pulse", "Standard execution speed"]
    },
    {
      name: "Pro",
      price: "$29/mo",
      description: "For serious investors needing deep insights.",
      icon: <Zap size={24} className="text-emerald-400" />,
      color: "from-emerald-600/20 to-teal-900/20",
      border: "border-emerald-500/50",
      popular: true,
      features: ["Unlimited AI Researches", "Real-time Critical Updates", "Priority execution speed", "Comparative Metrics Export"]
    },
    {
      name: "Institutional",
      price: "$99/mo",
      description: "Enterprise-grade intelligence for funds.",
      icon: <Crown size={24} className="text-purple-400" />,
      color: "from-purple-600/20 to-fuchsia-900/20",
      border: "border-purple-500/30",
      features: ["API Access", "Custom LangGraph Workflows", "Dedicated Account Manager", "White-label reports"]
    }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto py-12 px-8">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-white mb-4">Transparent Pricing</h2>
        <p className="text-slate-400 text-lg">Choose the intelligence tier that matches your investment style.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan, i) => (
          <div 
            key={i} 
            className={`relative flex flex-col p-8 rounded-3xl border bg-gradient-to-b ${plan.color} ${plan.border} backdrop-blur-md transition-transform hover:-translate-y-2 duration-300 shadow-xl`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-emerald-400 to-teal-500 text-slate-900 text-xs font-bold uppercase tracking-widest py-1 px-4 rounded-full shadow-lg">
                  Most Popular
                </span>
              </div>
            )}
            
            <div className="flex items-center space-x-4 mb-4">
              <div className="p-3 bg-white/10 rounded-xl border border-white/20">
                {plan.icon}
              </div>
              <h3 className="text-2xl font-bold text-white">{plan.name}</h3>
            </div>
            
            <div className="mb-2">
              <span className="text-4xl font-black text-white">{plan.price}</span>
            </div>
            <p className="text-slate-400 mb-8 min-h-[48px]">{plan.description}</p>
            
            <div className="space-y-4 mb-8 flex-1">
              {plan.features.map((feature, j) => (
                <div key={j} className="flex items-start">
                  <Check size={18} className="text-emerald-400 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-300 text-sm font-medium">{feature}</span>
                </div>
              ))}
            </div>
            
            <button className={`w-full py-4 rounded-xl font-bold transition-all shadow-lg ${
              plan.popular 
                ? "bg-emerald-500 hover:bg-emerald-400 text-slate-900" 
                : "bg-white/5 hover:bg-white/10 text-white border border-white/20"
            }`}>
              Get Started
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
