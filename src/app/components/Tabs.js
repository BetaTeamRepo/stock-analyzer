export default function Tabs({ activeTab, setActiveTab }) {
    const tabs = ["Market Overview", "Watchlist", "Newsfeed"];
  
    return (
      <div className="flex border-b">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`p-2 flex-1 text-center ${
              activeTab === tab ? "border-b-2 border-black font-bold" : ""
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
    );
  }
  