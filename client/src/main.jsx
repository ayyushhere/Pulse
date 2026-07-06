import React from "react";
import ReactDOM from "react-dom/client";
import { ClerkProvider } from "@clerk/clerk-react";
import { dark } from "@clerk/themes";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ClerkProvider 
        publishableKey={PUBLISHABLE_KEY} 
        appearance={{
          baseTheme: dark,
          variables: {
            colorBackground: 'rgba(15, 23, 42, 0.7)',
            colorInputBackground: 'rgba(30, 41, 59, 0.5)',
            colorPrimary: '#3b82f6',
            colorText: '#f8fafc',
            colorInputText: '#f8fafc',
            borderRadius: '1rem'
          },
          elements: {
            card: "backdrop-blur-xl border border-slate-700/50 shadow-2xl",
            headerTitle: "text-2xl font-bold tracking-tight",
            headerSubtitle: "text-slate-400",
            socialButtonsBlockButton: "border-white/10 bg-white/5 hover:bg-white/10 transition-colors",
            socialButtonsBlockButtonText: "font-semibold",
            dividerLine: "bg-white/10",
            dividerText: "text-slate-500",
            formFieldLabel: "text-slate-300 font-medium",
            formFieldInput: "border-slate-700/50 focus:border-blue-500/50 transition-colors",
            formButtonPrimary: "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500 border-none shadow-[0_0_20px_rgba(59,130,246,0.2)] transition-all font-bold",
            footerActionText: "text-slate-400",
            footerActionLink: "text-blue-400 hover:text-blue-300 font-semibold"
          }
        }}
      >
        <App />
      </ClerkProvider>
    </BrowserRouter>
  </React.StrictMode>
);
