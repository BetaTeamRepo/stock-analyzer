import Link from "next/link";
//import { useParams } from "react-router-dom";

type Insight = {
  id: string;
  title: string;
  summary: string;
};

type InsightDetailsProps = {
  insights: Insight[];
};

const InsightDetails: React.FC<InsightDetailsProps> = ({ insights }) => {
  //const { id } = useParams<{ id: string }>();
  //const insight2 = insights.find((item) => item.id === id);
  console.log(insights);
  const insight = {
    id: 1,
    title: "Stock Market Trends",
    description: "AI-generated insights on market trends.",
    videoUrl: "https://example.com/video1.mp4",
    summary: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.",
  };

  if (!insight) return <p className="p-4">Insight not found.</p>;
  

  return (
    <div className="p-4">
      <Link href="/insight" className="text-blue-500">&lt; Back</Link>
      <h1 className="text-xl font-bold mb-4">{insight.title}</h1>
      <div className="w-full h-40 bg-gray-300 rounded flex items-center justify-center">
        ▶️ Video Placeholder
      </div>
      <h2 className="text-lg font-semibold mt-4">AI Summary</h2>
      <p className="text-sm mt-2">{insight.summary}</p>
    </div>
  );
};

export default InsightDetails;
