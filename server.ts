import express from 'express';
import cors from 'cors';
import { createServer as createViteServer } from 'vite';
import path from 'path';

// --- In-Memory Database Setup ---
type User = {
  wallet_address: string;
  points: number;
  predictions: string[];
  last_login?: Date;
  streak?: number;
};

type Prediction = {
  id: string;
  wallet_address: string;
  token_address: string;
  prediction: 'moon' | 'rug';
  status: 'pending' | 'won' | 'lost';
  created_at: Date;
  wager: number;
};

type ActiveToken = {
  pairAddress: string;
  baseToken: {
    address: string;
    name: string;
    symbol: string;
  };
  priceUsd: string;
  url: string;
  liquidity: { usd: number };
  volume: { h24: number };
  priceChange: { h24: number };
  createdAt: Date;
  predictableUntil: Date;
  resolvesAt: Date;
  initialPrice: number;
  status: 'active' | 'resolving' | 'resolved';
  result?: 'moon' | 'rug';
};

const db = {
  users: new Map<string, User>(),
  predictions: new Map<string, Prediction>(),
  activeTokens: new Map<string, ActiveToken>()
};

// --- Token Lifecycle Management ---
async function fetchNewToken() {
  try {
    // Search for popular keywords to find active tokens
    const queries = ['solana', 'pump', 'meme', 'cat', 'dog', 'ai'];
    const randomQuery = queries[Math.floor(Math.random() * queries.length)];
    const res = await fetch(`https://api.dexscreener.com/latest/dex/search?q=${randomQuery}`);
    const data = await res.json();
    
    let solanaPairs = data.pairs?.filter((p: any) => 
      p.chainId === 'solana' && 
      p.liquidity?.usd > 20000 && 
      p.volume?.h24 > 50000
    ) || [];
    
    // Sort by 24h volume descending to get the most active/trending coins
    solanaPairs.sort((a: any, b: any) => (b.volume?.h24 || 0) - (a.volume?.h24 || 0));
    
    // Filter out tokens that are already active
    const availablePairs = solanaPairs.filter((p: any) => !db.activeTokens.has(p.pairAddress));
    
    // Pick from the top 10 trending coins from this search
    const topTrending = availablePairs.slice(0, 10);
    
    if (topTrending.length > 0) {
      const randomPair = topTrending[Math.floor(Math.random() * topTrending.length)];
      const now = new Date();
      
      const activeToken: ActiveToken = {
        pairAddress: randomPair.pairAddress,
        baseToken: randomPair.baseToken,
        priceUsd: randomPair.priceUsd,
        url: randomPair.url,
        liquidity: randomPair.liquidity,
        volume: randomPair.volume,
        priceChange: randomPair.priceChange,
        createdAt: now,
        predictableUntil: new Date(now.getTime() + 60 * 1000), // 1 min to predict
        resolvesAt: new Date(now.getTime() + 5 * 60 * 1000), // 5 mins to resolve
        initialPrice: parseFloat(randomPair.priceUsd || '0'),
        status: 'active'
      };
      
      db.activeTokens.set(activeToken.pairAddress, activeToken);
    }
  } catch (err) {
    console.error('Error fetching new token:', err);
  }
}

async function resolveTokens() {
  const now = new Date();
  for (const [pairAddress, token] of db.activeTokens.entries()) {
    if (token.status === 'active' && now > token.resolvesAt) {
      token.status = 'resolving';
      try {
        const res = await fetch(`https://api.dexscreener.com/latest/dex/pairs/solana/${pairAddress}`);
        const data = await res.json();
        const currentPair = data.pairs?.[0];
        
        if (currentPair) {
          const currentPrice = parseFloat(currentPair.priceUsd || '0');
          const result = currentPrice > token.initialPrice ? 'moon' : 'rug';
          token.result = result;
          token.status = 'resolved';
          
          let totalLoserPoints = 0;
          let winners: Prediction[] = [];
          let losers: Prediction[] = [];
          
          for (const pred of db.predictions.values()) {
            if (pred.token_address === pairAddress && pred.status === 'pending') {
              if (pred.prediction === result) {
                pred.status = 'won';
                winners.push(pred);
              } else {
                pred.status = 'lost';
                losers.push(pred);
                totalLoserPoints += pred.wager;
              }
            }
          }
          
          if (winners.length > 0) {
            const pointsPerWinner = Math.floor(totalLoserPoints / winners.length);
            for (const winner of winners) {
              const user = db.users.get(winner.wallet_address);
              if (user) {
                user.points += winner.wager + pointsPerWinner;
              }
            }
          }
          
          // Remove resolved token after 2 minutes
          setTimeout(() => {
            db.activeTokens.delete(pairAddress);
          }, 2 * 60 * 1000);
          
        } else {
          token.status = 'resolved';
          for (const pred of db.predictions.values()) {
            if (pred.token_address === pairAddress && pred.status === 'pending') {
              pred.status = 'won'; // Refund
              const user = db.users.get(pred.wallet_address);
              if (user) user.points += pred.wager;
            }
          }
          setTimeout(() => db.activeTokens.delete(pairAddress), 2 * 60 * 1000);
        }
      } catch (err) {
        console.error('Error resolving token:', err);
        token.status = 'active'; // Try again later
      }
    }
  }
}

setInterval(fetchNewToken, 60 * 1000);
setInterval(resolveTokens, 30 * 1000);
fetchNewToken();
fetchNewToken();
fetchNewToken();

// --- Express Setup ---
async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // --- API Routes ---
  app.post('/api/connect-wallet', async (req, res) => {
    try {
      const { wallet_address } = req.body;
      if (!wallet_address) return res.status(400).json({ error: 'Wallet address required' });

      let user = db.users.get(wallet_address);
      const now = new Date();
      let streakUpdated = false;
      let pointsEarned = 0;

      if (!user) {
        user = { 
          wallet_address, 
          points: 100, 
          predictions: [],
          last_login: now,
          streak: 1
        };
        db.users.set(wallet_address, user);
        streakUpdated = true;
        pointsEarned = 100;
      } else {
        if (!user.last_login) {
          user.streak = 1;
          user.points += 100;
          user.last_login = now;
          streakUpdated = true;
          pointsEarned = 100;
        } else {
          const lastDate = user.last_login.toISOString().split('T')[0];
          const nowDate = now.toISOString().split('T')[0];
          
          if (lastDate !== nowDate) {
            const diffTime = Math.abs(now.getTime() - user.last_login.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
            
            if (diffDays === 1) {
              user.streak = (user.streak || 0) + 1;
            } else {
              user.streak = 1;
            }
            
            pointsEarned = 100 + (user.streak * 10);
            user.points += pointsEarned;
            user.last_login = now;
            streakUpdated = true;
          }
        }
      }
      res.json({ success: true, user, streakUpdated, pointsEarned });
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  });

  app.get('/api/live-tokens', (req, res) => {
    const tokens = Array.from(db.activeTokens.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    res.json({ success: true, tokens });
  });

  app.post('/api/predict', async (req, res) => {
    try {
      const { wallet_address, token_address, prediction } = req.body;
      if (!wallet_address || !token_address || !prediction) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const user = db.users.get(wallet_address);
      if (!user) return res.status(404).json({ error: 'User not found' });

      const token = db.activeTokens.get(token_address);
      if (!token) return res.status(404).json({ error: 'Token not found' });

      if (new Date() > token.predictableUntil) {
        return res.status(400).json({ error: 'Prediction window closed for this token' });
      }

      const wager = 10;
      if (user.points < wager) {
        return res.status(400).json({ error: 'Insufficient points (10 required)' });
      }

      // Check if user already predicted on this token
      for (const predId of user.predictions) {
        const existingPred = db.predictions.get(predId);
        if (existingPred && existingPred.token_address === token_address) {
          return res.status(400).json({ error: 'You have already predicted on this token' });
        }
      }

      user.points -= wager;

      const newPrediction: Prediction = {
        id: Math.random().toString(36).substring(7),
        wallet_address,
        token_address,
        prediction,
        status: 'pending',
        created_at: new Date(),
        wager
      };
      
      db.predictions.set(newPrediction.id, newPrediction);
      user.predictions.push(newPrediction.id);

      res.json({ success: true, prediction: newPrediction, points: user.points });
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  });

  app.get('/api/user/:wallet', async (req, res) => {
    try {
      const user = db.users.get(req.params.wallet);
      if (!user) return res.status(404).json({ error: 'User not found' });
      
      const userPredictions = user.predictions
        .map(id => db.predictions.get(id))
        .filter(Boolean);

      res.json({ success: true, user: { ...user, predictions: userPredictions } });
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  });

  // --- Vite Middleware ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
