import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const { connected, publicKey } = useWallet();
  const [points, setPoints] = useState(0);

  useEffect(() => {
    if (connected && publicKey) {
      const registerUser = async () => {
        try {
          const res = await fetch('/api/connect-wallet', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ wallet_address: publicKey.toString() })
          });
          const data = await res.json();
          if (data.success) {
            setPoints(data.user.points);
            if (data.streakUpdated) {
              alert(`Daily Streak! You earned ${data.pointsEarned} points. Current streak: ${data.user.streak} days.`);
            }
          }
        } catch (err) {
          console.error('Failed to register user', err);
        }
      };
      registerUser();
    }
  }, [connected, publicKey]);

  // Listen for points update from TokenCard
  useEffect(() => {
    const handlePointsUpdate = (e: CustomEvent) => {
      setPoints(e.detail.points);
    };
    window.addEventListener('updatePoints', handlePointsUpdate as EventListener);
    return () => window.removeEventListener('updatePoints', handlePointsUpdate as EventListener);
  }, []);

  return (
    <header className="max-w-5xl mx-auto px-6 py-8 flex justify-between items-center border-b border-white/5">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-semibold tracking-tight text-white">MOYE</h1>
        {connected && (
          <span className="hidden md:inline-flex items-center px-3 py-1 rounded-full bg-white/5 text-sm font-medium text-gray-300 border border-white/10">
            {points} pts
          </span>
        )}
      </div>
      <WalletMultiButton className="!bg-white !text-black !rounded-full !px-6 !py-2 !font-medium hover:!bg-gray-200 transition-colors !h-10" />
    </header>
  );
}
