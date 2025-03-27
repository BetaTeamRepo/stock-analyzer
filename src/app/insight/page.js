"use client"; // Ensures the component only runs on the client

import Navbar from "../components/Navbar";

import BottomNav from "../components/BottomNav";

import InsightsList from "./InsightsList";

const insightsData = [
  {
    id: 1,
    title: "Stock Market Trends",
    description: "AI-generated insights on market trends.",
    videoUrl: "https://example.com/video1.mp4",
    summary: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.",
  },
  {
    id: 2,
    title: "Tech Stocks Analysis",
    description: "Deep dive into the latest in tech stocks.",
    videoUrl: "https://example.com/video2.mp4",
    summary: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.",
  },
  {
    id: 3,
    title: "AI in Finance",
    description: "How AI is shaping the future of finance.",
    videoUrl: "https://example.com/video3.mp4",
    summary: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.",
  },
];

export default function Home() {
  
  return (
    <div className="flex flex-col h-screen">
      {/* Navbar */}
      <Navbar />
      <InsightsList insights={insightsData} />

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
