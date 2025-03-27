"use client"; // Ensures the component only runs on the client

import Navbar from "../components/Navbar";

import BottomNav from "../components/BottomNav";
import StockInvestedIn from "./StockInvestedIn";


export default function Home() {
  

  return (
    <div className="flex flex-col h-screen">
      {/* Navbar */}
      <Navbar />
      <StockInvestedIn />

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
