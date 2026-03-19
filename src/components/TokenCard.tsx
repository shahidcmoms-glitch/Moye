import { useWallet } from '@solana/wallet-adapter-react';
import React, { useState, useEffect } from 'react';

export default function TokenCard({ token, initialPrediction }: { token: any, initialPrediction?: 'moon' | 'rug', key?: React.Key }) {
  const { connected, publicKey } = useWallet();
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [predicted, setPredicted] = useState<'moon' | 'rug' | null>(initialPrediction || null);

  useEffect(() => {
    if (initialPrediction) setPredicted(initialPrediction);
  }, [initialPrediction]);

  useEffect(() => {
    const updateTimer = () => {
      const remaining = new Date(token.predictableUntil).getTime() - Date.now();
      setTimeLeft(Math.max(0, Math.floor(remaining / 1000)));
    };
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [token.predictableUntil]);

  const handlePredict = async (type: 'moon' | 'rug') => {
    if (!connected) {
      alert('Please connect your wallet to predict.');
      return;
    }
    
    setLoading(true);
    try {
      const res = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          wallet_address: publicKey?.toString(),
          token_address: token.pairAddress,
          prediction: type
        })
      });
      
      const data = await res.json();
      if (data.success) {
        setPredicted(type);
        window.dispatchEvent(new CustomEvent('updatePoints', { detail: { points: data.points } }));
        alert(`Predicted ${type.toUpperCase()} for ${token.baseToken.symbol}. 10 points deducted.`);
      } else {
        alert(data.error || 'Failed to save prediction.');
      }
    } catch (err) {
      console.error(err);
      alert('Error saving prediction.');
    } finally {
      setLoading(false);
    }
  };

  const priceChange = token.priceChange?.h24 || 0;
  const isPositive = priceChange >= 0;
  const canPredict = timeLeft > 0 && token.status === 'active' && !predicted;

  return (
    <div className="bg-[#111111] border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-all duration-300 shadow-sm relative overflow-hidden">
      {token.status === 'resolved' && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-10">
          <div className="text-center">
            <p className="text-2xl font-bold mb-2">
              {token.result === 'moon' ? '🚀 MOONED' : '💥 RUGGED'}
            </p>
            <p className="text-gray-400">Round Ended</p>
          </div>
        </div>
      )}
      
      {token.status === 'resolving' && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-10">
          <div className="text-center">
            <p className="text-xl font-bold text-yellow-500 animate-pulse">Resolving...</p>
          </div>
        </div>
      )}

      <div className="flex justify-between items-start mb-6">
        <div>
          <a href={token.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
            <h3 className="text-lg font-medium text-white flex items-center gap-2">
              {token.baseToken.name}
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
            </h3>
          </a>
          <p className="text-sm text-gray-500 font-mono">${token.baseToken.symbol}</p>
        </div>
        <div className="text-right">
          <p className="font-mono text-lg text-white">${parseFloat(token.priceUsd || '0').toFixed(6)}</p>
          <p className={`text-sm font-mono ${isPositive ? 'text-emerald-500' : 'text-red-500'}`}>
            {isPositive ? '+' : ''}{priceChange}%
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
        <div className="bg-black/50 rounded-xl p-4 border border-white/5">
          <p className="text-gray-500 mb-1">Liquidity</p>
          <p className="font-mono text-white">${token.liquidity?.usd?.toLocaleString() || '0'}</p>
        </div>
        <div className="bg-black/50 rounded-xl p-4 border border-white/5">
          <p className="text-gray-500 mb-1">24h Volume</p>
          <p className="font-mono text-white">${token.volume?.h24?.toLocaleString() || '0'}</p>
        </div>
      </div>

      {predicted ? (
        <div className="py-3 text-center rounded-xl bg-white/5 border border-white/10 text-white font-medium">
          You predicted: <span className={predicted === 'moon' ? 'text-emerald-500' : 'text-red-500'}>{predicted.toUpperCase()}</span>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-3 px-1">
            <span className="text-xs text-gray-500">Prediction Window</span>
            <span className={`text-xs font-mono font-medium ${timeLeft <= 10 ? 'text-red-500' : 'text-emerald-500'}`}>
              {timeLeft > 0 ? `00:${timeLeft.toString().padStart(2, '0')}` : 'Closed'}
            </span>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => handlePredict('rug')}
              disabled={!connected || loading || !canPredict}
              className="flex-1 py-3 rounded-xl bg-red-500/10 text-red-500 font-medium hover:bg-red-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              RUG
            </button>
            <button 
              onClick={() => handlePredict('moon')}
              disabled={!connected || loading || !canPredict}
              className="flex-1 py-3 rounded-xl bg-emerald-500/10 text-emerald-500 font-medium hover:bg-emerald-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              MOON
            </button>
          </div>
        </>
      )}
    </div>
  );
}
