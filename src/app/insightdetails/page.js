"use client"; // Ensures the component only runs on the client

import Navbar from "../components/Navbar";

import BottomNav from "../components/BottomNav";
import InsightDetails from "./InsightDetails";


export default function Home() {
  

  return (
    <div className="flex flex-col h-screen">
      {/* Navbar */}
      <Navbar />
      <InsightDetails />

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
