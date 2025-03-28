"use client";

import { useState, useEffect } from "react";
import { fetchStockReport } from "../utils/api";
import Head from 'next/head';

export default function StockReport() {
  const [filename, setFilename] = useState("");
  const [reportHtml, setReportHtml] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFetchReport = async () => {
    setLoading(true);
    setError("");

    try {
      const html = await fetchStockReport(filename);
      setReportHtml(html);
    } catch (err) {
      setError("Failed to load report: " + err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    

    if (reportHtml) {
      const container = document.getElementById("report-container");
      if (!container) return;

      // Remove old scripts
      const oldScripts = container.getElementsByTagName("script");
      for (let i = 0; i < oldScripts.length; i++) {
        oldScripts[i].remove();
      }

      // Extract and execute new scripts
      const scripts = container.getElementsByTagName("script");
      const scriptPromises = [];

      for (let i = 0; i < scripts.length; i++) {
        const newScript = document.createElement("script");
        newScript.type = "text/javascript";

        if (scripts[i].src) {
          newScript.src = scripts[i].src;
          newScript.async = true;
          scriptPromises.push(
            new Promise((resolve) => {
              newScript.onload = resolve;
              document.body.appendChild(newScript);
            })
          );
        } else {
          newScript.textContent = scripts[i].textContent;
          document.body.appendChild(newScript);
        }
      }

      // Ensure charts are re-initialized after script execution
      Promise.all(scriptPromises).then(() => {
        if (window.Plotly) {
          console.log("Re-initializing Plotly charts...");
          window.Plotly.redraw();
        }
      });
    }
  }, [reportHtml]);

  return (
    <div>
      <Head>
        {/* Load Plotly.js */}
        <script src="https://cdn.plot.ly/plotly-latest.min.js"></script>
        <title>NVDA Analysis Report</title>
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

      {reportHtml && (
        <div
          id="report-container"
          dangerouslySetInnerHTML={{ __html: reportHtml }}
        />
      )}
    </div>
  );
}
