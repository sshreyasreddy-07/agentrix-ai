import React, { useState } from "react";
import axios from "axios";
import {
  LayoutDashboard,
  Settings,
  LogOut,
  Bell,
  UploadCloud,
  BookOpen,
  FlaskConical,
  FileSearch,
  Briefcase,
  Sparkles,
  ArrowUpRight,
  Layers
} from "lucide-react";

import SmartExamNotes from "./components/SmartExamNotes";
import ResearchAgent from "./components/ResearchAgent";
import DocumentRag from "./components/DocumentRag";
import JobFinder from "./components/JobFinder";
import AiMentor from "./components/AiMentor";
import FocusTimer from "./components/FocusTimer";

const API_BASE = "http://127.0.0.1:8001/api";

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    if (!file) return alert("Please select a PDF document first.");
    const formData = new FormData();
    formData.append("file", file);
    setUploading(true);
    setUploadStatus("Ingesting into vector database...");
    try {
      const res = await axios.post(`${API_BASE}/upload`, formData);
      setUploadStatus(`Indexed ${res.data.chunks} chunks from ${res.data.filename}`);
    } catch (err) {
      setUploadStatus("Upload failed. Verify backend is running on port 8001.");
    }
    setUploading(false);
  };

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "exam", label: "Exam Distillation", icon: BookOpen },
    { id: "research", label: "Research Agent", icon: FlaskConical },
    { id: "rag", label: "Vector Document Q&A", icon: FileSearch },
    { id: "jobs", label: "Career Matchmaker", icon: Briefcase },
    { id: "mentor", label: "AI Viva Mentor", icon: Sparkles },
  ];

  const recentActivities = [
    { title: "Exam Note Distillation", subtitle: "Operating Systems Ch. 4", tag: "3 Points Extracted", type: "academic" },
    { title: "Deep Research Trigger", subtitle: "Quantum OS Architecture", tag: "2 Web Queries", type: "research" },
    { title: "ChromaDB Ingestion", subtitle: "Technical_Resume_2026.pdf", tag: "+12 Chunks", type: "database" },
    { title: "Adzuna Live Query", subtitle: "Bengaluru • Python Developer", tag: "8 Listings", type: "career" },
    { title: "AI Mentor Viva Practice", subtitle: "DBMS B+ Tree Indexing", tag: "Reviewed", type: "mentor" },
  ];

  return (
    <div className="max-w-[1440px] mx-auto bg-white rounded-[38px] shadow-2xl overflow-hidden border border-slate-100 flex flex-col md:flex-row min-h-[900px]">
      
      {/* SIDEBAR */}
      <aside className="w-full md:w-64 bg-white border-r border-slate-100 flex flex-col justify-between p-6 shrink-0">
        <div>
          {/* Logo */}
          <div className="flex items-center gap-3 px-2 py-1 mb-8">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black text-lg shadow-md shadow-indigo-200">
              ⚡
            </div>
            <span className="text-xl font-extrabold tracking-tight text-slate-900">Agentrix</span>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {navItems.map(({ id, label, icon: Icon }) => {
              const isActive = activeTab === id;
              return (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                    isActive
                      ? "bg-slate-900 text-white shadow-md shadow-slate-200"
                      : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400"}`} />
                  {label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer: Document Ingestion */}
        <div className="space-y-4 pt-6 border-t border-slate-100">
          <div className="bg-slate-50 border border-slate-200/70 rounded-2xl p-3.5 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-800 flex items-center gap-1.5">
                <UploadCloud className="w-3.5 h-3.5 text-indigo-600" />
                Document Store
              </span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                Port 8001
              </span>
            </div>
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => setFile(e.target.files[0])}
              className="text-[11px] text-slate-500 file:mr-2 file:py-1 file:px-2.5 file:rounded-xl file:border-0 file:bg-slate-200 file:text-slate-800 hover:file:bg-slate-300 w-full"
            />
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="w-full bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white py-1.5 rounded-xl text-[11px] font-bold transition shadow-sm"
            >
              {uploading ? "Ingesting..." : "Ingest PDF (ChromaDB)"}
            </button>
            {uploadStatus && (
              <p className="text-[10px] text-emerald-600 font-semibold truncate">{uploadStatus}</p>
            )}
          </div>

          <div className="space-y-1">
            <button
              onClick={() => alert("Agentrix AI: Local Engine running on Ollama qwen3:0.6b + ChromaDB")}
              className="w-full flex items-center gap-3 px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-900 transition"
            >
              <Settings className="w-4 h-4 text-slate-400" />
              Engine Config
            </button>
            <button
              onClick={() => window.location.reload()}
              className="w-full flex items-center gap-3 px-4 py-2 text-xs font-semibold text-rose-500 hover:text-rose-700 transition"
            >
              <LogOut className="w-4 h-4" />
              Reset Session
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CANVAS */}
      <main className="flex-1 bg-[#fafafc] p-6 sm:p-9 overflow-y-auto">
        {/* Top Navbar */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between pb-8 gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              {navItems.find((n) => n.id === activeTab)?.label}
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Autonomous Multi-Agent Intelligence Center
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <button className="w-10 h-10 rounded-full bg-white border border-slate-200/80 flex items-center justify-center text-slate-600 hover:text-slate-900 shadow-sm transition">
                <Bell className="w-4 h-4" />
              </button>
              <span className="w-2 h-2 rounded-full bg-indigo-600 absolute top-2 right-2 ring-2 ring-white"></span>
            </div>

            <div className="flex items-center gap-3 bg-white border border-slate-200/80 rounded-full p-1.5 pr-4 shadow-sm">
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                AG
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-slate-900 leading-none">Agentrix Pro</div>
                <div className="text-[10px] text-slate-400 font-medium">Multi-Agent Hub</div>
              </div>
            </div>

            <div className="bg-indigo-600 text-white font-extrabold text-xs px-4 py-2 rounded-2xl shadow-md shadow-indigo-200">
              Pro Hub
            </div>
          </div>
        </header>

        {activeTab === "dashboard" ? (
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 lg:col-span-8 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-500">ChromaDB Vectors</span>
                    <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <ArrowUpRight className="w-3 h-3" /> Ingested
                    </span>
                  </div>
                  <div className="my-3">
                    <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                      all-MiniLM-L6
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">COLLECTION</span>
                      <span className="font-bold text-slate-700">agentrix_collection</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block font-semibold">PERSISTENCE</span>
                      <span className="font-bold text-slate-700">./vector_db</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-500">Local LLM Engine</span>
                    <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <ArrowUpRight className="w-3 h-3" /> Online
                    </span>
                  </div>
                  <div className="my-3">
                    <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-mono">
                      qwen3:0.6b
                    </div>
                  </div>
                  <div className="flex items-end justify-between gap-1.5 h-8">
                    {[35, 55, 40, 70, 85, 60, 95, 75].map((h, i) => (
                      <div
                        key={i}
                        className="flex-1 bg-indigo-100 hover:bg-indigo-600 rounded-t-md transition-all duration-300"
                        style={{ height: `${h}%` }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Dark Statistics Container */}
              <div className="bg-[#181824] text-white rounded-[32px] p-6 sm:p-7 shadow-lg">
                <div className="flex items-center justify-between pb-6">
                  <div>
                    <h3 className="text-base font-bold text-white tracking-tight">
                      Weekly Study & Agent Dispatch Activity
                    </h3>
                    <p className="text-xs text-slate-400">Cognitive workload and agentic queries</p>
                  </div>
                  <div className="flex items-center gap-4 text-xs font-semibold">
                    <span className="flex items-center gap-1.5 text-slate-300">
                      <span className="w-2.5 h-2.5 rounded-full bg-white"></span> RAG Queries
                    </span>
                    <span className="flex items-center gap-1.5 text-slate-300">
                      <span className="w-2.5 h-2.5 rounded-full bg-teal-400"></span> Research Agent
                    </span>
                  </div>
                </div>

                <div className="h-44 flex items-end justify-between gap-3 pt-4 border-t border-slate-800">
                  {[
                    { day: "Mon", h1: 65, h2: 30 },
                    { day: "Tue", h1: 85, h2: 45 },
                    { day: "Wed", h1: 45, h2: 70 },
                    { day: "Thu", h1: 75, h2: 40 },
                    { day: "Fri", h1: 90, h2: 60 },
                    { day: "Sat", h1: 30, h2: 25 },
                    { day: "Sun", h1: 80, h2: 50 },
                  ].map((bar, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                      <div className="w-full flex items-end justify-center gap-1.5 h-full">
                        <div
                          className="w-2 sm:w-3.5 bg-white rounded-t-md transition-all duration-500"
                          style={{ height: `${bar.h1}%` }}
                        />
                        <div
                          className="w-2 sm:w-3.5 bg-teal-400 rounded-t-md transition-all duration-500"
                          style={{ height: `${bar.h2}%` }}
                        />
                      </div>
                      <span className="text-[11px] font-semibold text-slate-400">{bar.day}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Row 3: Focus Timer & Syllabus Mastery */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <FocusTimer />

                <div className="bg-[#ffd9c7] text-slate-900 rounded-3xl p-5 shadow-sm flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] font-bold tracking-wider uppercase text-amber-900">Coverage</span>
                    <h4 className="text-sm font-extrabold text-slate-900 mt-0.5">Syllabus Mastery</h4>
                  </div>

                  <div className="space-y-2.5 my-3">
                    {[
                      { name: "Operating Systems", pct: 78 },
                      { name: "Database Management (DBMS)", pct: 64 },
                      { name: "Computer Networks", pct: 45 },
                      { name: "Machine Learning Foundations", pct: 90 },
                    ].map((item, idx) => (
                      <div key={idx}>
                        <div className="flex justify-between text-[11px] font-bold text-slate-800 mb-0.5">
                          <span>{item.name}</span>
                          <span>{item.pct}%</span>
                        </div>
                        <div className="w-full bg-white/60 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-slate-900 h-full rounded-full"
                            style={{ width: `${item.pct}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="text-[11px] font-bold text-amber-900">
                    Calculated from ingested chunks
                  </div>
                </div>
              </div>
            </div>

            {/* Right 4 Columns */}
            <div className="col-span-12 lg:col-span-4 space-y-6">
              <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
                <div className="flex justify-between items-center mb-5">
                  <h3 className="text-sm font-extrabold text-slate-900">Recent Pipeline Events</h3>
                  <button
                    onClick={() => setActiveTab("rag")}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
                  >
                    View all
                  </button>
                </div>

                <div className="space-y-4">
                  {recentActivities.map((act, i) => (
                    <div key={i} className="flex items-center justify-between pb-3.5 border-b border-slate-100 last:border-0 last:pb-0">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-xs shrink-0">
                          {act.type === "academic" && <BookOpen className="w-4 h-4" />}
                          {act.type === "research" && <FlaskConical className="w-4 h-4" />}
                          {act.type === "database" && <Layers className="w-4 h-4" />}
                          {act.type === "career" && <Briefcase className="w-4 h-4" />}
                          {act.type === "mentor" && <Sparkles className="w-4 h-4" />}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-900">{act.title}</h4>
                          <p className="text-[11px] text-slate-400 font-medium">{act.subtitle}</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-xl">
                        {act.tag}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[#181824] text-white rounded-3xl p-6 shadow-md">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Quick Launch Agent</h4>
                  <span className="text-xs font-bold text-indigo-400">5 Agents</span>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    { id: "exam", label: "3-Pt Notes", icon: BookOpen },
                    { id: "research", label: "Research", icon: FlaskConical },
                    { id: "rag", label: "Doc Q&A", icon: FileSearch },
                    { id: "jobs", label: "Job Finder", icon: Briefcase },
                  ].map(({ id, label, icon: Icon }) => (
                    <button
                      key={id}
                      onClick={() => setActiveTab(id)}
                      className="bg-white/10 hover:bg-white/20 p-3 rounded-2xl text-left transition flex items-center gap-2.5 border border-white/5"
                    >
                      <Icon className="w-4 h-4 text-teal-400" />
                      <span className="text-xs font-bold text-white">{label}</span>
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setActiveTab("mentor")}
                  className="w-full mt-3 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-2xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-md shadow-indigo-600/30"
                >
                  <Sparkles className="w-4 h-4" /> Consult AI Mentor
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-[32px] p-6 sm:p-8 border border-slate-100 shadow-sm min-h-[580px]">
            <div className="mb-4 flex items-center justify-between pb-3 border-b border-slate-100">
              <button
                onClick={() => setActiveTab("dashboard")}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1.5"
              >
                ← Return to Main Dashboard
              </button>
              <span className="text-xs font-semibold text-slate-400">
                Connected to: <span className="font-mono text-slate-700 font-bold">http://127.0.0.1:8001</span>
              </span>
            </div>

            {activeTab === "exam" && <SmartExamNotes apiBase={API_BASE} />}
            {activeTab === "research" && <ResearchAgent apiBase={API_BASE} />}
            {activeTab === "rag" && <DocumentRag apiBase={API_BASE} />}
            {activeTab === "jobs" && <JobFinder apiBase={API_BASE} />}
            {activeTab === "mentor" && <AiMentor apiBase={API_BASE} />}
          </div>
        )}
      </main>
    </div>
  );
}
