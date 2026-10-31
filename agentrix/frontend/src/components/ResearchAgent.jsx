import React, { useState } from "react";
import axios from "axios";
import { Search, FlaskConical, Globe, Database, ArrowRight } from "lucide-react";

export default function ResearchAgent({ apiBase }) {
  const [topic, setTopic] = useState("Quantum Hardware Operating Systems vs Traditional OS");
  const [report, setReport] = useState("");
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(false);

  const triggerResearch = async () => {
    if (!topic.trim()) return alert("Enter a topic first");
    setLoading(true);
    setReport("");
    setMeta(null);
    try {
      const res = await axios.post(`${apiBase}/research`, { topic });
      setReport(res.data.report);
      setMeta({
        webCount: res.data.web_sources_count,
        localCount: res.data.local_sources_count,
      });
    } catch (err) {
      alert("Research agent failed. Verify backend server is running on port 8001.");
    }
    setLoading(false);
  };

  return (
    <div className="space-y-4 flex flex-col h-full">
      <div className="pb-3 border-b border-slate-100">
        <h3 className="text-lg font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <FlaskConical className="w-5 h-5 text-indigo-600" />
          Agentrix Deep Research Agent
        </h3>
        <p className="text-xs text-slate-500 font-medium">
          Multi-query autonomous engine synthesizing DuckDuckGo live web intelligence with ChromaDB grounding.
        </p>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && triggerResearch()}
            placeholder="Enter research topic, paper subject, or technical problem..."
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition"
          />
        </div>
        <button
          onClick={triggerResearch}
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-5 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2"
        >
          {loading ? "Synthesizing..." : "Dispatch Agent"}
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {meta && (
        <div className="flex gap-3 text-[11px] font-semibold">
          <span className="bg-indigo-50 text-indigo-700 border border-indigo-200/60 px-3 py-1 rounded-xl flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5" /> Web Sources Analyzed: {meta.webCount}
          </span>
          <span className="bg-emerald-50 text-emerald-700 border border-emerald-200/60 px-3 py-1 rounded-xl flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5" /> Local Vector Matches: {meta.localCount}
          </span>
        </div>
      )}

      {report ? (
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 text-xs text-slate-800 whitespace-pre-line leading-relaxed overflow-y-auto max-h-[380px]">
          {report}
        </div>
      ) : (
        <div className="h-64 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-400 gap-2 text-center px-4">
          <FlaskConical className="w-8 h-8 text-slate-300 stroke-[1.5]" />
          <p className="text-xs font-medium text-slate-500">
            Type any technical question above to launch the autonomous research workflow.
          </p>
        </div>
      )}
    </div>
  );
}
