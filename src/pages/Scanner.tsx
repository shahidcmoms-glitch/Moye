import React, { useState } from "react";
import { motion } from "motion/react";
import { Search, Lock, ShieldAlert, Zap, AlertTriangle, CheckCircle2, Skull, Rocket } from "lucide-react";
import { cn } from "@/src/lib/utils";

export default function Scanner() {
  const [address, setAddress] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address) return;
    
    setIsScanning(true);
    setResult(null);

    // Mock API call
    setTimeout(() => {
      setIsScanning(false);
      setResult({
        rugProbability: 88,
        analysis: [
          { type: 'danger', text: 'Developer wallet holds 45% of supply' },
          { type: 'danger', text: 'Liquidity is not locked' },
          { type: 'warning', text: 'Contract is not renounced' },
          { type: 'success', text: 'No honeypot code detected' }
        ]
      });
    }, 2000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-20 md:pb-0">
      <header className="text-center space-y-4">
        <div className="inline-flex items-center justify-center p-3 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-2xl mb-2">
          <Zap className="w-8 h-8 text-amber-500" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Premium AI Scanner</h1>
        <p className="text-zinc-400 max-w-xl mx-auto">
          Paste any Solana contract address to get an instant AI-powered risk analysis and rug probability score.
        </p>
      </header>

      {/* Scanner Input */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-moye-card border border-moye-border rounded-2xl p-6 relative overflow-hidden shadow-[0_0_40px_rgba(245,158,11,0.05)]"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-orange-500" />
        
        <form onSubmit={handleScan} className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
            <input 
              type="text" 
              placeholder="Enter Token Contract Address (e.g. 7xKX...)"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-all font-mono"
            />
          </div>
          <button 
            type="submit"
            disabled={isScanning || !address}
            className="bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold py-4 px-8 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isScanning ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              >
                <Search className="w-5 h-5" />
              </motion.div>
            ) : (
              <>Scan Token</>
            )}
          </button>
        </form>
      </motion.div>

      {/* Results Area */}
      {isScanning && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12 space-y-4"
        >
          <div className="w-16 h-16 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin mx-auto" />
          <p className="text-zinc-400 font-mono animate-pulse">Analyzing contract bytecode...</p>
        </motion.div>
      )}

      {result && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {/* Score Card */}
          <div className="bg-moye-card border border-moye-border rounded-2xl p-6 flex flex-col items-center justify-center text-center">
            <h3 className="text-zinc-400 mb-4">Rug Probability</h3>
            <div className="relative w-32 h-32 flex items-center justify-center mb-4">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="#27272a" strokeWidth="10" />
                <motion.circle 
                  cx="50" cy="50" r="45" fill="none" 
                  stroke={result.rugProbability > 70 ? "#ef4444" : result.rugProbability < 30 ? "#10b981" : "#f59e0b"} 
                  strokeWidth="10" strokeDasharray="283" strokeDashoffset={283 - (283 * result.rugProbability) / 100}
                  initial={{ strokeDashoffset: 283 }}
                  animate={{ strokeDashoffset: 283 - (283 * result.rugProbability) / 100 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={cn(
                  "text-3xl font-bold font-mono",
                  result.rugProbability > 70 ? "text-moye-rug" : result.rugProbability < 30 ? "text-moye-moon" : "text-amber-500"
                )}>
                  {result.rugProbability}%
                </span>
              </div>
            </div>
            <p className={cn(
              "font-bold text-lg",
              result.rugProbability > 70 ? "text-moye-rug" : result.rugProbability < 30 ? "text-moye-moon" : "text-amber-500"
            )}>
              {result.rugProbability > 70 ? "HIGH RISK" : result.rugProbability < 30 ? "LOW RISK" : "MEDIUM RISK"}
            </p>
          </div>

          {/* Analysis Details */}
          <div className="md:col-span-2 bg-moye-card border border-moye-border rounded-2xl p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-moye-primary" />
              Detailed Analysis
            </h3>
            
            <div className="space-y-3">
              {result.analysis.map((item: any, idx: number) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + (idx * 0.1) }}
                  className={cn(
                    "flex items-start gap-3 p-3 rounded-xl border",
                    item.type === 'danger' ? "bg-moye-rug/10 border-moye-rug/20 text-moye-rug-muted" :
                    item.type === 'warning' ? "bg-amber-500/10 border-amber-500/20 text-amber-500" :
                    "bg-moye-moon/10 border-moye-moon/20 text-moye-moon-muted"
                  )}
                >
                  {item.type === 'danger' ? <Skull className="w-5 h-5 shrink-0 mt-0.5" /> :
                   item.type === 'warning' ? <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" /> :
                   <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />}
                  <p className="text-sm">{item.text}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Premium Banner (Mock) */}
      {!result && !isScanning && (
        <div className="bg-gradient-to-r from-zinc-900 to-moye-card border border-moye-border rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0">
              <Lock className="w-6 h-6 text-amber-500" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Unlock Unlimited Scans</h3>
              <p className="text-zinc-400 text-sm">Get access to deep contract analysis and early alerts.</p>
            </div>
          </div>
          <button className="whitespace-nowrap bg-white text-black font-bold py-3 px-6 rounded-xl hover:bg-zinc-200 transition-colors">
            Upgrade for $40 USDT
          </button>
        </div>
      )}
    </div>
  );
}
