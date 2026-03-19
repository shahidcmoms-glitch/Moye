import { useParams } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowLeft, ExternalLink, ShieldAlert, TrendingUp, Users, Activity, Skull, Rocket, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { time: '10:00', price: 0.00010 },
  { time: '10:05', price: 0.00012 },
  { time: '10:10', price: 0.00015 },
  { time: '10:15', price: 0.00011 },
  { time: '10:20', price: 0.00008 },
  { time: '10:25', price: 0.00005 },
  { time: '10:30', price: 0.00002 },
];

export default function TokenDetail() {
  const { id } = useParams();

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      <Link to="/" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to Feed
      </Link>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Column: Chart & Stats */}
        <div className="flex-1 space-y-6">
          <div className="bg-moye-card border border-moye-border rounded-2xl p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-3xl font-bold flex items-center gap-3">
                  DOGE2.0
                  <span className="text-sm font-mono bg-zinc-800 text-zinc-300 px-2 py-1 rounded-md">
                    $DOGE2
                  </span>
                </h1>
                <p className="text-zinc-400 font-mono mt-2 flex items-center gap-2">
                  Token: 0x1234...abcd
                  <ExternalLink className="w-3 h-3 cursor-pointer hover:text-white" />
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-mono font-bold text-moye-rug">$0.00002</p>
                <p className="text-sm text-moye-rug">-80% (1h)</p>
              </div>
            </div>

            {/* Chart Area */}
            <div className="h-[400px] w-full bg-zinc-900/50 rounded-xl border border-zinc-800/50 p-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                  <XAxis dataKey="time" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} domain={['auto', 'auto']} tickFormatter={(val) => `$${val}`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#121212', border: '1px solid #27272a', borderRadius: '8px' }}
                    itemStyle={{ color: '#ef4444' }}
                  />
                  <Line type="monotone" dataKey="price" stroke="#ef4444" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-moye-card border border-moye-border rounded-xl p-4">
              <div className="flex items-center gap-2 text-zinc-400 mb-2">
                <Activity className="w-4 h-4" />
                <span className="text-sm">Liquidity</span>
              </div>
              <p className="text-xl font-mono font-bold">$45,230</p>
            </div>
            <div className="bg-moye-card border border-moye-border rounded-xl p-4">
              <div className="flex items-center gap-2 text-zinc-400 mb-2">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm">Volume (24h)</span>
              </div>
              <p className="text-xl font-mono font-bold">$120,450</p>
            </div>
            <div className="bg-moye-card border border-moye-border rounded-xl p-4">
              <div className="flex items-center gap-2 text-zinc-400 mb-2">
                <Users className="w-4 h-4" />
                <span className="text-sm">Holders</span>
              </div>
              <p className="text-xl font-mono font-bold">1,204</p>
            </div>
            <div className="bg-moye-card border border-moye-border rounded-xl p-4">
              <div className="flex items-center gap-2 text-zinc-400 mb-2">
                <ShieldAlert className="w-4 h-4" />
                <span className="text-sm">Contract</span>
              </div>
              <p className="text-xl font-mono font-bold text-moye-rug">Unrenounced</p>
            </div>
          </div>
        </div>

        {/* Right Column: AI Analysis & Predictions */}
        <div className="w-full lg:w-[400px] space-y-6">
          {/* AI Analysis Card */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-moye-card border border-moye-border rounded-2xl p-6 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-moye-rug to-amber-500" />
            
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="bg-moye-primary/20 text-moye-primary p-1.5 rounded-lg">
                <Activity className="w-5 h-5" />
              </span>
              AI Risk Analysis
            </h3>

            <div className="flex items-center justify-between mb-6">
              <span className="text-zinc-400">Rug Probability</span>
              <span className="text-3xl font-mono font-bold text-moye-rug">85%</span>
            </div>

            <div className="space-y-4">
              <div className="bg-moye-rug/10 border border-moye-rug/20 rounded-xl p-4 text-sm text-moye-rug-muted">
                <p className="font-bold mb-1 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" /> Critical Warning
                </p>
                <p>Top 10 wallets hold 65% of supply. Liquidity is unlocked. Developer wallet has history of rug pulls.</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">Contract Safety</span>
                  <span className="text-moye-rug">Failed</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">Liquidity Lock</span>
                  <span className="text-moye-rug">0% Locked</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">Honeypot Risk</span>
                  <span className="text-amber-500">Medium</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Community Predictions */}
          <div className="bg-moye-card border border-moye-border rounded-2xl p-6">
            <h3 className="text-lg font-bold mb-4">Community Prediction</h3>
            
            <div className="flex h-4 rounded-full overflow-hidden mb-4">
              <div className="bg-moye-rug w-[80%]" />
              <div className="bg-moye-moon w-[20%]" />
            </div>
            
            <div className="flex justify-between text-sm font-mono mb-6">
              <span className="text-moye-rug">80% RUG</span>
              <span className="text-moye-moon">20% MOON</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center gap-2 py-3 bg-moye-rug/10 text-moye-rug hover:bg-moye-rug/20 border border-moye-rug/20 rounded-xl font-bold transition-colors">
                <Skull className="w-5 h-5" /> RUG
              </button>
              <button className="flex items-center justify-center gap-2 py-3 bg-moye-moon/10 text-moye-moon hover:bg-moye-moon/20 border border-moye-moon/20 rounded-xl font-bold transition-colors">
                <Rocket className="w-5 h-5" /> MOON
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
