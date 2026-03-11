"use client";

import { useState, useRef } from "react";
import Papa from "papaparse";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const COLORS = ["#6366f1", "#8b5cf6", "#a78bfa", "#c4b5fd", "#ddd6fe"];

const SAMPLE_QUESTIONS = [
  "Which region had the highest revenue?",
  "What is the total sales by product category?",
  "Show me the top 5 performing sales reps.",
  "What was the revenue trend by month?",
];

export default function Home() {
  const [csvData, setCsvData] = useState(null);
  const [headers, setHeaders] = useState([]);
  const [fileName, setFileName] = useState("");
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [history, setHistory] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [autoInsights, setAutoInsights] = useState(null);
  const [insightsLoading, setInsightsLoading] = useState(false);
  const fileRef = useRef();

  // ── Auto-Insights on Upload ──
  async function fetchAutoInsights(parsedHeaders, parsedRows) {
    setInsightsLoading(true);
    try {
      const res = await fetch("/api/insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ headers: parsedHeaders, rows: parsedRows }),
      });
      const data = await res.json();
      if (data.success && data.insights?.length > 0) {
        setAutoInsights(data);
      }
    } catch (err) {
      // Non-critical — silently skip
    } finally {
      setInsightsLoading(false);
    }
  }

  // ── CSV Handling ──
  function handleFile(file) {
    if (!file || !file.name.endsWith(".csv")) {
      setError("Please upload a .csv file");
      return;
    }
    setError("");
    setFileName(file.name);
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const h = results.meta.fields || [];
        const d = results.data;
        setHeaders(h);
        setCsvData(d);
        setResult(null);
        setHistory([]);
        setAutoInsights(null);
        fetchAutoInsights(h, d);
      },
      error: () => setError("Failed to parse CSV file"),
    });
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  }

  function handleDragOver(e) {
    e.preventDefault();
    setDragActive(true);
  }

  function handleDragLeave(e) {
    e.preventDefault();
    setDragActive(false);
  }

  function resetFile() {
    setCsvData(null);
    setHeaders([]);
    setFileName("");
    setQuestion("");
    setResult(null);
    setError("");
    setHistory([]);
    setAutoInsights(null);
    if (fileRef.current) fileRef.current.value = "";
  }

  // ── Query Handling ──
  async function handleQuery(q) {
    const queryText = q || question;
    if (!queryText.trim() || !csvData) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          headers,
          rows: csvData,
          question: queryText,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.error || "Query failed");
        return;
      }

      setResult(data);
      setHistory((prev) => [
        { question: queryText, answer: data.answer },
        ...prev.slice(0, 4),
      ]);
    } catch (err) {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !loading && question.trim()) {
      handleQuery();
    }
  }

  // ── Custom Tooltip ──
  function CustomTooltip({ active, payload, label }) {
    if (!active || !payload?.length) return null;
    return (
      <div className="bg-[#1a1a2e] border border-white/10 rounded-lg px-3 py-2 text-sm">
        <p className="text-white/70">{label}</p>
        <p className="text-indigo-400 font-semibold">
          {payload[0].value?.toLocaleString()}
        </p>
      </div>
    );
  }

  return (
    <main className="min-h-screen px-4 py-6 md:px-8 md:py-10 max-w-4xl mx-auto">
      {/* ── Header ── */}
      <header className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-lg shrink-0">
          R
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold tracking-tight">
              Talking Rabbitt
            </h1>
            <span className="text-[10px] font-medium bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 px-2 py-0.5 rounded-full uppercase tracking-wider">
              MVP
            </span>
          </div>
          <p className="text-white/40 text-xs mt-0.5">
            Own your Data, Own your AI — Conversational Analytics
          </p>
        </div>
      </header>

      {/* ── CSV Upload Zone ── */}
      {!csvData ? (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileRef.current?.click()}
          className={`relative overflow-hidden border border-dashed rounded-2xl p-14 text-center cursor-pointer transition-all duration-300 group ${
            dragActive
              ? "border-indigo-400 bg-indigo-500/10 shadow-[0_0_30px_rgba(99,102,241,0.15)] ring-4 ring-indigo-500/20"
              : "border-white/20 bg-[#12121a] hover:border-indigo-500/50 hover:bg-[#151520] hover:shadow-lg"
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          <input
            ref={fileRef}
            type="file"
            accept=".csv"
            className="hidden"
            onChange={(e) => handleFile(e.target.files[0])}
          />
          <div className="text-4xl mb-3">📊</div>
          <p className="text-white/70 text-sm font-medium">
            Drop your CSV file here, or click to browse
          </p>
          <p className="text-white/30 text-xs mt-2">
            Supports standard sales / analytics CSV files
          </p>
        </div>
      ) : (
        <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-white/90">
              📁 {fileName}
            </p>
            <p className="text-xs text-white/40 mt-0.5">
              {csvData.length} rows · {headers.length} columns:{" "}
              {headers.slice(0, 5).join(", ")}
              {headers.length > 5 && ` +${headers.length - 5} more`}
            </p>
          </div>
          <button
            onClick={resetFile}
            className="text-xs text-white/40 hover:text-white/70 border border-white/10 hover:border-white/20 rounded-lg px-3 py-1.5 transition-colors"
          >
            Change file
          </button>
        </div>
      )}

      {/* ── Auto-Insights (USP) ── */}
      {insightsLoading && csvData && (
        <div className="flex items-center gap-2 mb-5 px-1">
          <div className="w-3.5 h-3.5 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
          <p className="text-white/40 text-xs">Scanning your data for insights...</p>
        </div>
      )}
      {autoInsights && !insightsLoading && csvData && (
        <div className="mb-6">
          {autoInsights.summary && (
            <p className="text-xs text-white/50 mb-3 px-1">
              🔍 {autoInsights.summary}
            </p>
          )}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {autoInsights.insights.map((ins, i) => (
              <div
                key={i}
                className="bg-[#12121a] border border-white/10 rounded-xl px-5 py-4 hover:bg-[#181824] hover:border-white/20 hover:-translate-y-0.5 transition-all duration-300 shadow-md"
              >
                <p className="text-sm mb-1.5 flex items-center gap-2">
                  <span className="text-lg">{ins.icon}</span> 
                  <span className="font-semibold text-white/90">{ins.title}</span>
                </p>
                <p className="text-xs text-white/60 leading-relaxed">{ins.detail}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Sample Questions ── */}
      {csvData && !loading && (
        <div className="flex flex-wrap gap-2 mb-5">
          {SAMPLE_QUESTIONS.map((sq) => (
            <button
              key={sq}
              onClick={() => {
                setQuestion(sq);
                handleQuery(sq);
              }}
              className="text-xs font-medium bg-[#151520] border border-white/10 text-white/60 hover:bg-indigo-500/10 hover:border-indigo-500/40 hover:text-indigo-300 rounded-full px-4 py-2 transition-all cursor-pointer shadow-sm"
            >
              {sq}
            </button>
          ))}
        </div>
      )}

      {/* ── Query Input ── */}
      {csvData && (
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a question about your data (e.g., 'What was the revenue trend?')..."
            disabled={loading}
            className="flex-1 bg-[#12121a] border border-white/10 rounded-xl px-5 py-4 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all disabled:opacity-50 shadow-inner"
          />
          <button
            onClick={() => handleQuery()}
            disabled={loading || !question.trim()}
            className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl px-6 py-4 transition-all hover:shadow-[0_0_15px_rgba(99,102,241,0.4)] shrink-0"
          >
            {loading ? "Analysing..." : "Ask →"}
          </button>
        </div>
      )}

      {/* ── Error ── */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl px-4 py-3 mb-6">
          {error}
        </div>
      )}

      {/* ── Loading ── */}
      {loading && (
        <div className="flex items-center justify-center gap-3 py-12">
          <div className="w-5 h-5 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
          <p className="text-white/50 text-sm">Analysing your data...</p>
        </div>
      )}

      {/* ── Result ── */}
      {result && !loading && (
        <div className="space-y-5 mb-8">
          {/* Answer Card */}
          <div className="relative rounded-xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-xl" />
            <div className="relative bg-white/5 border border-white/10 rounded-xl px-5 py-4">
              <p className="text-sm text-white/90 leading-relaxed">
                {result.answer}
              </p>
              {result.insight && (
                <p className="text-xs text-indigo-400/80 mt-3 pt-3 border-t border-white/5">
                  💡 {result.insight}
                </p>
              )}
            </div>
          </div>

          {/* Chart */}
          {result.chart?.data?.length > 0 && (
            <div className="bg-white/5 border border-white/10 rounded-xl p-5">
              <p className="text-xs text-white/40 font-medium uppercase tracking-wider mb-4">
                {result.chart.title || "Visualization"}
              </p>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart
                  data={result.chart.data}
                  margin={{ top: 5, right: 10, left: 10, bottom: 30 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.05)"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="label"
                    tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }}
                    tickLine={false}
                    axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                    angle={-30}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis
                    tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v) =>
                      v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v
                    }
                  />
                  <Tooltip content={<CustomTooltip />} cursor={false} />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={50}>
                    {result.chart.data.map((_, i) => (
                      <Cell
                        key={`cell-${i}`}
                        fill={COLORS[i % COLORS.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}

      {/* ── Query History ── */}
      {history.length > 0 && !loading && (
        <div className="mt-8">
          <p className="text-xs text-white/30 uppercase tracking-wider font-medium mb-3">
            Recent Queries
          </p>
          <div className="space-y-2">
            {history.map((item, i) => (
              <button
                key={i}
                onClick={() => {
                  setQuestion(item.question);
                  handleQuery(item.question);
                }}
                className="w-full text-left bg-[#12121a] hover:bg-[#181824] border border-white/5 hover:border-white/15 rounded-lg px-5 py-3 transition-all group shadow-sm"
              >
                <p className="text-sm font-medium text-white/70 group-hover:text-white/90 truncate mb-1">
                  {item.question}
                </p>
                <p className="text-xs text-indigo-400/80 truncate">
                  {item.answer}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Footer ── */}
      <footer className="mt-16 pb-6 text-center">
        <p className="text-[11px] text-white/20">
          Rabbitt AI · Private Cloud · Enterprise-Grade Analytics
        </p>
      </footer>
    </main>
  );
}
