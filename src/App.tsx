/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Dashboard from "./pages/Dashboard";
import TokenDetail from "./pages/TokenDetail";
import Leaderboard from "./pages/Leaderboard";
import Scanner from "./pages/Scanner";
import Profile from "./pages/Profile";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="token/:id" element={<TokenDetail />} />
          <Route path="leaderboard" element={<Leaderboard />} />
          <Route path="scanner" element={<Scanner />} />
          <Route path="profile" element={<Profile />} />
          <Route path="trending" element={<div className="p-8 text-center text-zinc-500">Trending Page (Coming Soon)</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
