"use client";

import { useState, useEffect, useRef } from "react";
import Head from "next/head";
import StockReportChart from "./stockreport2";
import { Button } from "@/components/ui/button";
import { Send, Mic, StopCircle, Loader2 } from "lucide-react";

export default function StockReport() {
  // State management
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

  // ... (keep all your existing functions like generateReportFilename, handleAnalyze, processReport, etc.)

  
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
        throw new Error(`API error: ${analysisResponse.error}`);
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
    <div className="min-h-screen bg-gray-50">
      <Head>
        <script src="https://cdn.plot.ly/plotly-latest.min.js"></script>
        <title>Stock Analysis Report</title>
      </Head>

      <header className="bg-indigo-600 text-white py-6 shadow-md">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold">Stock Analysis Dashboard</h1>
          <p className="mt-2 text-indigo-100">Get comprehensive stock insights with AI-powered analysis</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Input Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter your analysis query (e.g., 'Analyze NVDA fundamentals')"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
            
            <div className="flex gap-2">
              <Button
                onClick={handleAnalyze}
                disabled={loading}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5" />
                    Analyze
                  </>
                )}
              </Button>
              
              <Button
                onClick={isRecording ? handleStopRecording : handleStartRecording}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-colors ${
                  isRecording 
                    ? "bg-red-600 hover:bg-red-700 text-white" 
                    : "bg-emerald-600 hover:bg-emerald-700 text-white"
                }`}
              >
                {isRecording ? (
                  <>
                    <StopCircle className="h-5 w-5" />
                    Stop
                  </>
                ) : (
                  <>
                    <Mic className="h-5 w-5" />
                    Voice
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Audio Player */}
          {audioFile && (
            <div className="mt-4 bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-800 mb-2">Audio Summary</h3>
              <audio controls className="w-full">
                <source src={`https://localhost:8000/${audioFile}`} type="audio/mp3" />
                Your browser does not support the audio element.
              </audio>
            </div>
          )}

          {error && (
            <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
              <p>{error}</p>
            </div>
          )}
        </div>

        {/* Results Section */}
        {sections.length > 0 && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Tab Navigation */}
            <div className="border-b border-gray-200">
              <nav className="flex overflow-x-auto">
                {sections.map((section, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setActiveTab(index);
                      setShowChart(false);
                    }}
                    className={`px-6 py-4 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${
                      activeTab === index && !showChart
                        ? "border-indigo-600 text-indigo-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    {section.title}
                  </button>
                ))}
                <button
                  onClick={() => setShowChart(true)}
                  className={`px-6 py-4 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${
                    showChart
                      ? "border-indigo-600 text-indigo-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Complete Analysis
                </button>
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {showChart ? (
                <StockReportChart reportHtml={reportHtml} />
              ) : (
                <div 
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: sections[activeTab].content }}
                />
              )}
            </div>
          </div>
        )}
      </main>

      <footer className="bg-gray-100 py-6 border-t border-gray-200">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>© {new Date().getFullYear()} Stock Analysis AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}