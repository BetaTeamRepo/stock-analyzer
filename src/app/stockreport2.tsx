"use client";

import { useState, useEffect } from "react";
import Head from 'next/head';

interface StockReportChartProps {
  reportHtml: string;
}

export default function StockReportChart({ reportHtml }: StockReportChartProps) {
  const [error, setError] = useState("");
  

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
        <script src="https://cdn.plot.ly/plotly-latest.min.js"></script>
        <title>Stock Analysis Chart</title>
      </Head>
      
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