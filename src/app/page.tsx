"use client"; // Ensures the component only runs on the client

import { useState } from "react";
import Navbar from "./components/Navbar";
import Tabs from "./components/Tabs";
import TrendingStocks from "./components/TrendingStocks";
import BottomNav from "./components/BottomNav";
import WatchList from "./components/WatchList";
import Newsfeed from "./components/Newsfeed";

export default function Home() {
  const [activeTab, setActiveTab] = useState("Market Overview");
  const watchlistData = [
    { name: "NVDA", change: "+0.43" },
    { name: "Tesla", change: "+0.24" },
    { name: "GOOG", change: "+0.15" },
  ];

  return (
    
    <div className="flex flex-col h-screen">
      {/* Navbar */}
      <Navbar />

      {/* Tabs */}
      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Page Content */}
      <div className="p-4">
        {activeTab === "Market Overview" && <TrendingStocks />}
        {activeTab === "Watchlist" && <WatchList stocks={watchlistData} />}
        {activeTab === "Newsfeed" && <Newsfeed />}
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
    
  );
}
