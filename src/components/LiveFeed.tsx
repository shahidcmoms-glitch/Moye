import useSWR from 'swr';
import TokenCard from './TokenCard';
import { useWallet } from '@solana/wallet-adapter-react';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function LiveFeed() {
  const { publicKey } = useWallet();
  const { data, error, isLoading } = useSWR(
    '/api/live-tokens',
    fetcher,
    { refreshInterval: 5000 }
  );

  const { data: userData } = useSWR(
    publicKey ? `/api/user/${publicKey.toString()}` : null,
    fetcher,
    { refreshInterval: 5000 }
  );

  if (error) {
    return (
      <div className="p-8 text-center text-red-500 bg-red-500/10 rounded-2xl border border-red-500/20">
        Failed to load live tokens. Please try again later.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-64 bg-[#111111] animate-pulse rounded-2xl border border-white/5"></div>
        ))}
      </div>
    );
  }

  const tokens = data?.tokens || [];
  const userPredictions = userData?.user?.predictions || [];

  if (tokens.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500 bg-[#111111] rounded-2xl border border-white/5">
        No active tokens found. New tokens appear every minute.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tokens.map((token: any) => {
        const existingPrediction = userPredictions.find((p: any) => p.token_address === token.pairAddress);
        return (
          <TokenCard 
            key={token.pairAddress} 
            token={token} 
            initialPrediction={existingPrediction?.prediction} 
          />
        );
      })}
    </div>
  );
}
