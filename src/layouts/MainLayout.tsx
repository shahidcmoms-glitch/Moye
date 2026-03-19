import { Outlet, Link } from "react-router-dom";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-white selection:text-black">
      {/* Minimal Header */}
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-5xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-black font-bold text-lg group-hover:scale-105 transition-transform">
              M
            </div>
            <span className="text-xl font-semibold tracking-tight">MOYE</span>
          </Link>

          <div className="flex items-center gap-6">
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-400">
              <Link to="/" className="hover:text-white transition-colors">Dashboard</Link>
              <Link to="/leaderboard" className="hover:text-white transition-colors">Leaderboard</Link>
              <Link to="/scanner" className="hover:text-white transition-colors">Scanner</Link>
            </nav>
            <WalletMultiButton className="!bg-white !text-black !rounded-full !px-6 !py-2 !font-medium hover:!bg-gray-200 transition-colors !h-10" />
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-5xl mx-auto px-6 py-12">
        <Outlet />
      </main>
    </div>
  );
}
