import React, { useState } from "react";
import axios from "axios";
import { BookOpen, Sparkles, Zap } from "lucide-react";

export default function SmartExamNotes({ apiBase }) {
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchSummary = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`${apiBase}/summarize`, { mode: "exam_3_points" });
      setSummary(res.data.summary);
    } catch (err) {
      alert("Error summarizing. Ensure a PDF document has been uploaded in the sidebar.");
    }
    setLoading(false);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
        <div>
          <h3 className="text-lg font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-600" />
            Agentrix Exam Distillation Engine
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            Distills documents into exactly 3 high-yield examination vectors with formulas and key cues.
          </p>
        </div>
        <button
          onClick={fetchSummary}
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-5 py-2.5 rounded-2xl text-xs font-bold transition shadow-sm flex items-center justify-center gap-2"
        >
          <Zap className="w-3.5 h-3.5" />
          {loading ? "Distilling..." : "Extract 3-Point Revision"}
        </button>
      </div>

      {summary ? (
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 text-sm text-slate-800 whitespace-pre-line leading-relaxed shadow-inner font-normal">
          {summary}
        </div>
      ) : (
        <div className="h-64 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-400 gap-3 text-center px-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-500">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-600">No distilled notes generated yet</p>
            <p className="text-xs text-slate-400 max-w-sm mt-0.5">
              Upload course material or notes in the sidebar and click "Extract 3-Point Revision".
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
