"use client";

import { useState, useEffect, useRef } from "react";
import Head from "next/head";
import StockReportChart from "./stockreport2";
import { Button } from "@/components/ui/button";
import { Send, Mic, StopCircle } from "lucide-react";
// class Section {
//   title: string;
//   content: string;
// };

export default function StockReport() {
  const [query, setQuery] = useState("Analyze GOOG technicals");
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const [reportHtml, setReportHtml] = useState("");
  const [showChart, setShowChart] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [symbol, setSymbol] = useState("");
  const [audioFile, setAudioFile] = useState("");
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const [newMessage, setNewMessage] = useState("");


  const generateReportFilename = (symbol) => {
    const timestamp = new Date().getTime();
    return `${symbol}_report.html`;
  };

  const handleAnalyze = async () => {
    setLoading(true);
    setError("");
    setShowChart(false);
    setReportHtml("");
    setSections([]);

    try {
      // Step 1: Make POST request to process_query
      const analysisResponse = await fetch("http://localhost:8000/process_query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_query: query
        }),
      });

      if (!analysisResponse.ok) {
        throw new Error(`API error: ${analysisResponse.status}`);
      }

      const analysisData = await analysisResponse.json();
      setSymbol(analysisData.symbol);
      setAudioFile(analysisData?.audio_file || "");

      // Step 2: Generate filename and fetch report
      const filename = generateReportFilename(analysisData.symbol);
      const reportResponse = await fetch(`http://localhost:8000/reports/${filename}`);

      if (!reportResponse.ok) {
        throw new Error(`Report not found: ${reportResponse.status}`);
      }

      const html = await reportResponse.text();
      setReportHtml(html);
      processReport(html);

    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load report");
    } finally {
      setLoading(false);
    }
  };

  const processReport = (html) => {
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

  // ✅ Start Recording
  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = handleAudioStop;

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error starting voice recording:", error);
    }
  };

  // ✅ Stop Recording and Send to FastAPI
  const handleStopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

   // ✅ Process Recorded Audio and Send to FastAPI for Transcription
   const handleAudioStop = async () => {
    const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
    const formData = new FormData();
    formData.append("file", audioBlob, "audio.wav");

    try {
      const response = await fetch("https://budgetadvisor.onrender.com/transcribe_audio", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data.transcription) {
        setNewMessage(data.transcription); // ✅ Set recognized speech as input text
      } else {
        console.error("Speech recognition failed:", data);
      }
    } catch (error) {
      console.error("Error converting audio to text:", error);
    }
  };

  return (
    <div>
      <Head>
        <script src="https://cdn.plot.ly/plotly-latest.min.js"></script>
        <title>Stock Analysis Report</title>
      </Head>

      <h1>Stock Report Viewer</h1>
      <Button
          onClick={isRecording ? handleStopRecording : handleStartRecording}
          className={`flex items-center gap-2 ${
            isRecording ? "bg-red-500" : "bg-green-500"
          } text-white`}
        >
          {isRecording ? (
            <>
              <StopCircle className="h-5 w-5" />
              Stop Recording
            </>
          ) : (
            <>
              <Mic className="h-5 w-5" />
              Voice Input
            </>
          )}
        </Button>

      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Enter your analysis query"
        style={{ width: "300px" }}
      />
      <button onClick={handleAnalyze} disabled={loading}>
        {loading ? "Analyzing..." : "Analyze Stock"}
      </button>
       {/* Audio Player */}
       {audioFile ? (
        <div className="mt-4">
          <audio controls className="w-full">
            <source src={`https://localhost:8000/${audioFile}`} type="audio/mp3" />
            Your browser does not support the audio element.
          </audio>
        </div>
      ) : (
        <p className="text-gray-500">Generating summary...</p>
      )}

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
            <button
              onClick={() => setShowChart(true)}
              style={{
                padding: "10px",
                borderBottom: showChart ? "2px solid blue" : "none",
                background: "none",
                cursor: "pointer",
              }}
            >
              Complete Report and Chart
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