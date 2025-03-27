"use client";
import Link from "next/link";

const StockInvestedIn = () => {
  const stocks = [
    { id: 1, name: "Tesla", price: 234.67, change: 0.24, profit: 15000 },
    { id: 2, name: "Apple", price: 145.32, change: -0.15, profit: 5000 },
  ];

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Stock</h1>
      <div className="mt-4">
        {stocks.map((stock) => (
          <Link key={stock.id} href={`/stockdetails`} className="block p-2 border rounded mb-2">
            <div className="flex justify-between items-center">
              <span>{stock.name}</span>
              <span className="bg-gray-300 p-1 rounded">${stock.price}</span>
            </div>
            <span className={stock.change >= 0 ? "text-green-500" : "text-red-500"}>
              {stock.change}%
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default StockInvestedIn;