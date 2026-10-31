import React, { useState, useEffect } from "react";
import { Play, Pause, RotateCcw, Target } from "lucide-react";

export default function FocusTimer() {
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [sessionCount, setSessionCount] = useState(3);
  const [mode, setMode] = useState("focus");

  useEffect(() => {
    let interval = null;
    if (isActive && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (secondsLeft === 0) {
      if (mode === "focus") {
        setSessionCount((c) => c + 1);
        setMode("break");
        setSecondsLeft(5 * 60);
      } else {
        setMode("focus");
        setSecondsLeft(25 * 60);
      }
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, secondsLeft, mode]);

  const toggle = () => setIsActive(!isActive);

  const reset = () => {
    setIsActive(false);
    setSecondsLeft(mode === "focus" ? 25 * 60 : 5 * 60);
  };

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const progressPct = (((mode === "focus" ? 25 * 60 : 5 * 60) - secondsLeft) / (mode === "focus" ? 25 * 60 : 5 * 60)) * 100;

  return (
    <div className="bg-[#dcd7fa] text-slate-800 rounded-3xl p-5 flex flex-col justify-between shadow-sm relative overflow-hidden h-full">
      <div className="flex justify-between items-center z-10">
        <div>
          <span className="text-[11px] font-bold tracking-wider uppercase text-indigo-700">Sprint Goal</span>
          <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5 mt-0.5">
            <Target className="w-4 h-4 text-indigo-600" />
            Agentrix Focus Sprint
          </h4>
        </div>
        <span className="text-[10px] bg-white/70 backdrop-blur font-bold px-2.5 py-1 rounded-full text-indigo-800">
          {sessionCount} Sprints
        </span>
      </div>

      <div className="my-3 flex items-center justify-between z-10">
        <div>
          <div className="text-3xl font-black tracking-tight text-slate-900 font-mono">
            {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
          </div>
          <p className="text-[11px] font-semibold text-indigo-700 mt-0.5">
            {mode === "focus" ? "🎯 Deep Work Session" : "☕ Break Interval"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggle}
            className="w-10 h-10 bg-slate-900 hover:bg-slate-800 text-white rounded-full flex items-center justify-center transition shadow-md"
            title={isActive ? "Pause" : "Start"}
          >
            {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
          </button>
          <button
            onClick={reset}
            className="w-9 h-9 bg-white/70 hover:bg-white text-slate-700 rounded-full flex items-center justify-center transition"
            title="Reset"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="z-10">
        <div className="flex justify-between text-[11px] font-bold text-slate-700 mb-1">
          <span>Sprint Completion</span>
          <span>{Math.round(progressPct)}%</span>
        </div>
        <div className="w-full bg-white/50 rounded-full h-2 overflow-hidden">
          <div
            className="bg-indigo-600 h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>
    </div>
  );
}
