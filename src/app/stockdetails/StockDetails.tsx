import  Link from "next/link";
import { useParams } from "next/navigation";

const StockDetails = () => {
  const { id } = useParams();
  const stock = {
    id: id,
    name: "Tesla",
    price: 234.67,
    change: 0.24,
    profit: 15000,
    status: "Market Open",
  };

  return (
    <div className="p-4">
      <Link href="/stockprofile" className="text-blue-500">&lt; Back</Link>
      <h1 className="text-xl font-bold text-center">{stock.name}</h1>
      <p className="text-center">{stock.status}</p>
      <div className="mt-4 p-4 border rounded">
        <h2 className="text-lg font-bold">${stock.price}</h2>
        <p className="text-gray-500">+${stock.profit} ({stock.change}%)</p>
        <div className="mt-4">
          <button className="bg-black text-white px-4 py-2 rounded mr-2">Buy</button>
          <button className="bg-black text-white px-4 py-2 rounded">Sell</button>
        </div>
      </div>
    </div>
  );
};

export default StockDetails;
