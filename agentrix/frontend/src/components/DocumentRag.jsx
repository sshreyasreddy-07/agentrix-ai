import React, { useState } from "react";
import axios from "axios";
import { FileSearch, Send, Bot, User } from "lucide-react";

export default function DocumentRag({ apiBase }) {
  const [ragQuery, setRagQuery] = useState("");
  const [ragHistory, setRagHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendRagChat = async () => {
    if (!ragQuery.trim()) return;
    const userMsg = ragQuery;
    setRagQuery("");
    setRagHistory((prev) => [...prev, { role: "user", text: userMsg }]);
    setLoading(true);
    try {
      const res = await axios.post(`${apiBase}/rag`, { query: userMsg });
      setRagHistory((prev) => [
        ...prev,
        { role: "assistant", text: res.data.answer, sources: res.data.sources },
      ]);
    } catch (err) {
      setRagHistory((prev) => [
        ...prev,
        { role: "assistant", text: "Error querying RAG engine. Check if vector store is initialized." },
      ]);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="pb-3 border-b border-slate-100">
        <h3 className="text-lg font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <FileSearch className="w-5 h-5 text-indigo-600" />
          Agentrix Vector Q&A (RAG)
        </h3>
        <p className="text-xs text-slate-500 font-medium">
          Grounded similarity search over ChromaDB knowledge chunks with source citation verification.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-2 max-h-[380px] min-h-[260px]">
        {ragHistory.length === 0 && (
          <div className="h-60 flex flex-col items-center justify-center text-slate-400 text-xs gap-2 border-2 border-dashed border-slate-200 rounded-2xl">
            <FileSearch className="w-8 h-8 text-slate-300 stroke-[1.5]" />
            <span>Ask any question strictly based on your uploaded document.</span>
          </div>
        )}
        {ragHistory.map((m, i) => (
          <div
            key={i}
            className={`flex items-start gap-2.5 max-w-[85%] ${
              m.role === "user" ? "ml-auto flex-row-reverse" : ""
            }`}
          >
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0 ${
                m.role === "user"
                  ? "bg-slate-900 text-white"
                  : "bg-indigo-600 text-white"
              }`}
            >
              {m.role === "user" ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
            </div>
            <div
              className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                m.role === "user"
                  ? "bg-slate-900 text-white rounded-tr-none"
                  : "bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200/80"
              }`}
            >
              <p>{m.text}</p>
              {m.sources && m.sources.length > 0 && (
                <div className="mt-2.5 pt-2 border-t border-slate-200 text-[10px] text-slate-500 font-semibold">
                  Verified against {m.sources.length} document chunk(s)
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2 pt-2 border-t border-slate-100">
        <input
          type="text"
          value={ragQuery}
          onChange={(e) => setRagQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendRagChat()}
          placeholder="Ask something about the uploaded material..."
          className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white"
        />
        <button
          onClick={sendRagChat}
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-5 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition"
        >
          <Send className="w-3.5 h-3.5" />
          {loading ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
}
