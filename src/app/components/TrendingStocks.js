"use client";

export default function TrendingStocks() {
  return (
    <div>
      <h2 className="text-lg font-bold mt-4">Trending Stocks</h2>
      <div className="flex gap-4 mt-2">
        <img src="/tesla_logo.jpeg" alt="Tesla Logo" className="w-24 h-32 rounded" />
        <img src="/google-logo.jpeg" alt="Google Logo" className="w-24 h-32 rounded" />
        <img src="/nvidia-logo.jpeg" alt="NVIDIA Logo" className="w-24 h-32 rounded" />
      </div>
    </div>
  );
}
