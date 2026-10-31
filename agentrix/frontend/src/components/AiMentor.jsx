import React, { useState } from "react";
import axios from "axios";
import { Sparkles, Send, Bot, User } from "lucide-react";

export default function AiMentor({ apiBase }) {
  const [mentorQuery, setMentorQuery] = useState("");
  const [mentorHistory, setMentorHistory] = useState([
    {
      role: "assistant",
      text: "Hello! I am your Agentrix AI Mentor. Ask me for viva drills, interview simulations, or technical concept clarifications."
    }
  ]);
  const [loading, setLoading] = useState(false);

  const sendMentorChat = async () => {
    if (!mentorQuery.trim()) return;
    const userMsg = mentorQuery;
    setMentorQuery("");
    setMentorHistory((prev) => [...prev, { role: "user", text: userMsg }]);
    setLoading(true);
    try {
      const res = await axios.post(`${apiBase}/mentor`, { query: userMsg });
      setMentorHistory((prev) => [...prev, { role: "assistant", text: res.data.reply }]);
    } catch (err) {
      setMentorHistory((prev) => [
        ...prev,
        { role: "assistant", text: "Error contacting Agentrix AI mentor service." },
      ]);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="pb-3 border-b border-slate-100">
        <h3 className="text-lg font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-600" />
          Agentrix Viva & Technical Placement Mentor
        </h3>
        <p className="text-xs text-slate-500 font-medium">
          Interactive pedagogical companion providing exam questions, interview evaluation, and architectural guidance.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-2 max-h-[380px] min-h-[260px]">
        {mentorHistory.map((m, i) => (
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
              className={`p-3.5 rounded-2xl text-xs leading-relaxed whitespace-pre-line ${
                m.role === "user"
                  ? "bg-slate-900 text-white rounded-tr-none"
                  : "bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200/80"
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2 pt-2 border-t border-slate-100">
        <input
          type="text"
          value={mentorQuery}
          onChange={(e) => setMentorQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMentorChat()}
          placeholder="Ask for interview prep, viva questions on OS/DBMS, or career advice..."
          className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white"
        />
        <button
          onClick={sendMentorChat}
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-5 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition"
        >
          <Send className="w-3.5 h-3.5" />
          {loading ? "..." : "Consult"}
        </button>
      </div>
    </div>
  );
}
