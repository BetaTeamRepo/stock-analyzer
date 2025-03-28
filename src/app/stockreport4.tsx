"use client";

import { useState, useEffect } from "react";
import { fetchStockReport } from "../utils/api";
import Head from "next/head";
import StockReportChart from "./stockreport2"; // Import the chart component

type Section = {
  title: string;
  content: string;
};

export default function StockReport() {
  const [filename, setFilename] = useState("NVDA_report.html");
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const [reportHtml, setReportHtml] = useState("");
  const [showChart, setShowChart] = useState(false); // New state for chart visibility

  const generateReportFilename = (symbol: string): string => {
    return `reports/${symbol}_report.html`;
  };

  const handleFetchReport = async () => {
    setLoading(true);
    setError("");
    setShowChart(false); // Reset chart visibility when loading new report

    try {
      const html = await fetchStockReport(filename);
      setReportHtml(html);
      processReport(html);
    } catch (err) {
      setError("Failed to load report: " + err);
    } finally {
      setLoading(false);
    }
  };

  const processReport = (html: string) => {
    const headings = [
      "Technical Analysis",
      "Fundamental Analysis",
      "Valuation",
      "Recommendations",
      "Target Price",
      "Stop-Loss"
    ];
    
    const headingPattern = headings.map(h => `\\*\\*${h}:\\*\\*`).join('|');
    const regex = new RegExp(`(${headingPattern})(.*?)(?=(${headingPattern}|$))`, "gs");

    const matches = [...html.matchAll(regex)];
    const extractedSections = matches.map(match => ({
      title: match[1].replace(/\*\*/g, "").replace(/:/g, "").trim(),
      content: match[2].trim(),
    }));

    setSections(extractedSections);
  };

  useEffect(() => {
    if (sections.length > 0) {
      setActiveTab(0);
    }
  }, [sections]);

  return (
    <div>
      <Head>
        <script src="https://cdn.plot.ly/plotly-latest.min.js"></script>
        <title>Stock Analysis Report</title>
      </Head>

      <h1>Stock Report Viewer</h1>

      <input
        type="text"
        value={filename}
        onChange={(e) => setFilename(e.target.value)}
        placeholder="Enter report filename (e.g. NVDA_report.html)"
      />
      <button onClick={handleFetchReport} disabled={loading}>
        {loading ? "Loading..." : "Load Report"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {sections.length > 0 && (
        <div>
          <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
            {sections.map((section, index) => (
              <button
                key={index}
                onClick={() => {
                  setActiveTab(index);
                  setShowChart(false);
                }}
                style={{
                  padding: "10px",
                  borderBottom: activeTab === index && !showChart ? "2px solid blue" : "none",
                  background: "none",
                  cursor: "pointer",
                }}
              >
                {section.title}
              </button>
            ))}
            {/* Chart button */}
            <button
              onClick={() => setShowChart(true)}
              style={{
                padding: "10px",
                borderBottom: showChart ? "2px solid blue" : "none",
                background: "none",
                cursor: "pointer",
              }}
            >
              Complete report and Chart
            </button>
          </div>

          <div style={{ marginTop: "20px" }}>
            {showChart ? (
              <StockReportChart reportHtml={reportHtml} />
            ) : (
              <div dangerouslySetInnerHTML={{ __html: sections[activeTab].content }} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}