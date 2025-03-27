import Link from "next/link";

type Insight = {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  summary: string;
};

type InsightsListProps = {
  insights: Insight[];
};

const InsightsList: React.FC<InsightsListProps> = ({ insights }) => {
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Insights</h1>
      <div className="grid grid-cols-2 gap-4">
        {insights.map((insight) => (
          <Link key={insight.id} href={`/insightdetails`} className="block p-2 border rounded">
            <div className="w-full h-32 bg-gray-300 rounded mb-2"></div>
            <p className="text-sm font-semibold">{insight.title}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default InsightsList;