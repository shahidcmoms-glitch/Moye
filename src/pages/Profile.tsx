import { motion } from "motion/react";
import { User, Trophy, Target, History, Wallet, Settings } from "lucide-react";
import { cn } from "@/src/lib/utils";

const PREDICTION_HISTORY = [
  { id: 1, token: "DOGE2", type: "rug", result: "win", points: "+50", date: "2h ago" },
  { id: 2, token: "PEPEAI", type: "moon", result: "loss", points: "-20", date: "5h ago" },
  { id: 3, token: "SOLCAT", type: "rug", result: "win", points: "+50", date: "1d ago" },
  { id: 4, token: "MINU", type: "moon", result: "pending", points: "...", date: "1d ago" },
];

export default function Profile() {
  return (
    <div className="space-y-8 pb-20 md:pb-0">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl transition-colors">
          <Settings className="w-4 h-4" />
          Settings
        </button>
      </header>

      {/* Profile Header */}
      <div className="bg-moye-card border border-moye-border rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-moye-primary/20 to-transparent" />
        
        <div className="relative z-10">
          <div className="w-24 h-24 rounded-full bg-zinc-800 border-4 border-moye-border flex items-center justify-center shadow-xl">
            <User className="w-12 h-12 text-zinc-500" />
          </div>
          <div className="absolute -bottom-2 -right-2 bg-moye-primary text-white text-xs font-bold px-3 py-1 rounded-full border-2 border-moye-card">
            Lvl 12
          </div>
        </div>

        <div className="relative z-10 text-center md:text-left flex-1">
          <h2 className="text-2xl font-bold font-mono">0x1234...5678</h2>
          <p className="text-zinc-400 mt-1 flex items-center justify-center md:justify-start gap-2">
            <Wallet className="w-4 h-4" /> Connected Wallet
          </p>
        </div>

        <div className="relative z-10 flex gap-4 w-full md:w-auto">
          <div className="flex-1 md:flex-none bg-zinc-900/80 border border-zinc-800 rounded-xl p-4 text-center min-w-[120px]">
            <p className="text-zinc-500 text-sm mb-1">Total Points</p>
            <p className="text-2xl font-bold text-moye-primary font-mono">1,240</p>
          </div>
          <div className="flex-1 md:flex-none bg-zinc-900/80 border border-zinc-800 rounded-xl p-4 text-center min-w-[120px]">
            <p className="text-zinc-500 text-sm mb-1">Global Rank</p>
            <p className="text-2xl font-bold text-amber-500 font-mono">#42</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Stats Column */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Target className="w-5 h-5 text-moye-primary" />
            Performance
          </h3>
          
          <div className="bg-moye-card border border-moye-border rounded-2xl p-6 space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-zinc-400">Win Rate</span>
                <span className="font-bold text-moye-moon">68%</span>
              </div>
              <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-moye-moon w-[68%]" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-zinc-900/50 rounded-xl p-3 border border-zinc-800/50 text-center">
                <p className="text-xs text-zinc-500 mb-1">Total Predictions</p>
                <p className="font-mono font-medium text-lg">142</p>
              </div>
              <div className="bg-zinc-900/50 rounded-xl p-3 border border-zinc-800/50 text-center">
                <p className="text-xs text-zinc-500 mb-1">Successful</p>
                <p className="font-mono font-medium text-lg text-moye-moon">96</p>
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-800">
              <h4 className="text-sm font-bold text-zinc-400 mb-3">Badges Earned</h4>
              <div className="flex flex-wrap gap-2">
                <span className="bg-amber-500/10 text-amber-500 border border-amber-500/20 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1">
                  <Trophy className="w-3 h-3" /> Rug Hunter
                </span>
                <span className="bg-moye-primary/10 text-moye-primary border border-moye-primary/20 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1">
                  <Target className="w-3 h-3" /> Early Adopter
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* History Column */}
        <div className="md:col-span-2 space-y-6">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <History className="w-5 h-5 text-moye-primary" />
            Recent Predictions
          </h3>

          <div className="bg-moye-card border border-moye-border rounded-2xl overflow-hidden">
            <div className="divide-y divide-moye-border">
              {PREDICTION_HISTORY.map((item, idx) => (
                <motion.div 
                  key={item.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="p-4 flex items-center justify-between hover:bg-zinc-900/30 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs",
                      item.type === 'rug' ? "bg-moye-rug/10 text-moye-rug border border-moye-rug/20" : "bg-moye-moon/10 text-moye-moon border border-moye-moon/20"
                    )}>
                      {item.type.toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold font-mono">${item.token}</p>
                      <p className="text-xs text-zinc-500">{item.date}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className={cn(
                      "font-bold font-mono",
                      item.result === 'win' ? "text-moye-moon" : 
                      item.result === 'loss' ? "text-moye-rug" : "text-zinc-500"
                    )}>
                      {item.points}
                    </p>
                    <p className="text-xs text-zinc-500 uppercase tracking-wider mt-1">
                      {item.result}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
            <button className="w-full py-4 text-sm text-zinc-400 hover:text-white hover:bg-zinc-900/50 transition-colors border-t border-moye-border">
              View All History
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
