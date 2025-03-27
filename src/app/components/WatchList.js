"use client"

import React from "react";
import { Plus } from "lucide-react";

const WatchList = ({ stocks }) => {
  return (
    <div className="p-4">
      {/* Heading */}
      <h2 className="text-lg font-semibold">My Watchlist</h2>

      {/* Stock List */}
      <ul className="mt-4 space-y-4">
        {stocks.map((stock, index) => (
          <li key={index} className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Stock Icon (Placeholder) */}
              <div className="w-10 h-10 bg-gray-300 rounded-full"></div>

              {/* Stock Name */}
              <span className="font-semibold">{stock.name}</span>
            </div>

            {/* Stock Change Percentage */}
            <span className="text-green-500">{stock.change}%</span>
          </li>
        ))}
      </ul>

      {/* Add Button */}
      <button className="fixed bottom-6 right-6 bg-gray-200 p-4 rounded-full shadow-md">
        <Plus size={24} />
      </button>
    </div>
  );
};

export default WatchList;
