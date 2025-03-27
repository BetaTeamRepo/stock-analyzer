import React from "react";

const Newsfeed = () => {
  const articles = [
    {
      title: "NVIDIA Surges 8% on Strong AI Chip Demand",
      date: "March 5, 2025",
      readTime: "4 min read",
      image: "/nvidia-news.jpg",
    },
    {
      title: "Tesla's Stock Dips Amid Concerns Over EV Demand",
      date: "March 5, 2025",
      readTime: "3 min read",
      image: "/tesla-market.jpg",
    },
    {
      title: "Google Announces Major AI Expansion, Stock Rises 5%",
      date: "March 5, 2025",
      readTime: "5 min read",
      image: "/google-ai-news.jpg",
    },
  ];

  return (
    <div className="p-4">
      {/* Top Featured Section */}
      <div className="w-full h-32 bg-gray-300 rounded-lg mb-4"></div>

      {/* Recommended Section */}
      <div>
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <span role="img" aria-label="search">
            🔍
          </span>
          RECOMMENDED FOR YOU
        </h2>

        {/* Articles List */}
        <div className="mt-4 space-y-4">
          {articles.map((article, index) => (
            <div key={index} className="flex gap-4 border-b pb-4">
              <div className="flex-1">
                <h3 className="text-base font-semibold">{article.title}</h3>
                <p className="text-sm text-gray-500">
                  {article.date} • {article.readTime}
                </p>
              </div>
              <div className="w-16 h-16 bg-gray-300 rounded-lg">
                {/* Image placeholder */}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Newsfeed;
