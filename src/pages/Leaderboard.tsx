import { motion } from "motion/react";
import { Trophy, Medal, Target, TrendingUp, User } from "lucide-react";
import { cn } from "@/src/lib/utils";

const LEADERBOARD_DATA = [
  { rank: 1, user: "0x7F...9A2B", points: 15420, winRate: 82, badge: "Moon Sniper" },
  { rank: 2, user: "0x3C...1D4F", points: 12100, winRate: 78, badge: "Rug Hunter" },
  { rank: 3, user: "0x9E...5B8C", points: 9850, winRate: 71, badge: "Whale Watcher" },
  { rank: 4, user: "0x1A...2C3D", points: 8400, winRate: 68, badge: "" },
  { rank: 5, user: "0x4D...5E6F", points: 7200, winRate: 65, badge: "" },
  { rank: 6, user: "0x7G...8H9I", points: 6100, winRate: 62, badge: "" },
  { rank: 7, user: "0x0J...1K2L", points: 5500, winRate: 59, badge: "" },
];

export default function Leaderboard() {
  return (
    <div className="space-y-8 pb-20 md:pb-0">
      <header>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <Trophy className="w-8 h-8 text-amber-500" />
          Leaderboard
        </h1>
        <p className="text-zinc-400 mt-1">Top predictors earning MOYE points</p>
      </header>

      {/* Top 3 Podium */}
      <div className="flex flex-col md:flex-row justify-center items-end gap-4 md:gap-8 mt-12 mb-16 px-4">
        {/* Rank 2 */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="order-2 md:order-1 flex flex-col items-center w-full md:w-48"
        >
          <div className="w-16 h-16 rounded-full bg-zinc-800 border-4 border-zinc-400 flex items-center justify-center mb-4 relative">
            <Medal className="w-8 h-8 text-zinc-400" />
            <span className="absolute -bottom-2 bg-zinc-400 text-black text-xs font-bold px-2 py-0.5 rounded-full">#2</span>
          </div>
          <div className="bg-moye-card border border-moye-border rounded-t-2xl w-full p-4 text-center h-32 flex flex-col justify-end">
            <p className="font-mono text-sm mb-1">{LEADERBOARD_DATA[1].user}</p>
            <p className="text-moye-primary font-bold text-lg">{LEADERBOARD_DATA[1].points} pts</p>
            <p className="text-xs text-zinc-500 mt-1">{LEADERBOARD_DATA[1].winRate}% WR</p>
          </div>
        </motion.div>

        {/* Rank 1 */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="order-1 md:order-2 flex flex-col items-center w-full md:w-56 z-10"
        >
          <div className="w-20 h-20 rounded-full bg-zinc-800 border-4 border-amber-500 flex items-center justify-center mb-4 relative shadow-[0_0_30px_rgba(245,158,11,0.3)]">
            <Trophy className="w-10 h-10 text-amber-500" />
            <span className="absolute -bottom-2 bg-amber-500 text-black text-xs font-bold px-2 py-0.5 rounded-full">#1</span>
          </div>
          <div className="bg-gradient-to-t from-moye-primary/20 to-moye-card border border-moye-primary/50 rounded-t-2xl w-full p-4 text-center h-40 flex flex-col justify-end relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-amber-500" />
            <p className="font-mono text-sm mb-1">{LEADERBOARD_DATA[0].user}</p>
            <p className="text-amber-500 font-bold text-2xl">{LEADERBOARD_DATA[0].points} pts</p>
            <p className="text-xs text-zinc-400 mt-1">{LEADERBOARD_DATA[0].winRate}% WR</p>
          </div>
        </motion.div>

        {/* Rank 3 */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="order-3 flex flex-col items-center w-full md:w-48"
        >
          <div className="w-16 h-16 rounded-full bg-zinc-800 border-4 border-amber-700 flex items-center justify-center mb-4 relative">
            <Medal className="w-8 h-8 text-amber-700" />
            <span className="absolute -bottom-2 bg-amber-700 text-white text-xs font-bold px-2 py-0.5 rounded-full">#3</span>
          </div>
          <div className="bg-moye-card border border-moye-border rounded-t-2xl w-full p-4 text-center h-28 flex flex-col justify-end">
            <p className="font-mono text-sm mb-1">{LEADERBOARD_DATA[2].user}</p>
            <p className="text-moye-primary font-bold text-lg">{LEADERBOARD_DATA[2].points} pts</p>
            <p className="text-xs text-zinc-500 mt-1">{LEADERBOARD_DATA[2].winRate}% WR</p>
          </div>
        </motion.div>
      </div>

      {/* List */}
      <div className="bg-moye-card border border-moye-border rounded-2xl overflow-hidden">
        <div className="grid grid-cols-12 gap-4 p-4 border-b border-moye-border bg-zinc-900/50 text-sm font-medium text-zinc-400">
          <div className="col-span-2 md:col-span-1 text-center">Rank</div>
          <div className="col-span-6 md:col-span-5">User</div>
          <div className="col-span-4 md:col-span-3 text-right">Points</div>
          <div className="hidden md:block col-span-3 text-right">Win Rate</div>
        </div>
        
        <div className="divide-y divide-moye-border">
          {LEADERBOARD_DATA.slice(3).map((user, idx) => (
            <motion.div 
              key={user.rank}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * idx }}
              className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-zinc-900/30 transition-colors"
            >
              <div className="col-span-2 md:col-span-1 text-center font-mono text-zinc-500">
                #{user.rank}
              </div>
              <div className="col-span-6 md:col-span-5 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center">
                  <User className="w-4 h-4 text-zinc-500" />
                </div>
                <span className="font-mono">{user.user}</span>
              </div>
              <div className="col-span-4 md:col-span-3 text-right font-bold text-moye-primary">
                {user.points.toLocaleString()}
              </div>
              <div className="hidden md:flex col-span-3 justify-end items-center gap-2 text-zinc-400">
                <Target className="w-4 h-4" />
                {user.winRate}%
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
