import React, { useState } from "react";
import axios from "axios";
import { Briefcase, ExternalLink, MapPin, Building, Search } from "lucide-react";

export default function JobFinder({ apiBase }) {
  const [jobs, setJobs] = useState([]);
  const [jobKw, setJobKw] = useState("python");
  const [jobLoc, setJobLoc] = useState("Bengaluru");
  const [loading, setLoading] = useState(false);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`${apiBase}/jobs`, {
        what: jobKw,
        location: jobLoc,
        salary_min: 0,
      });
      setJobs(res.data.results || []);
    } catch (err) {
      alert("Error querying Adzuna Job API.");
    }
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      <div className="pb-3 border-b border-slate-100">
        <h3 className="text-lg font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-indigo-600" />
          Agentrix Career Matchmaker (Adzuna India)
        </h3>
        <p className="text-xs text-slate-500 font-medium">
          Query live tech openings across top hubs directly matched to your skills.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          value={jobKw}
          onChange={(e) => setJobKw(e.target.value)}
          placeholder="Keywords (e.g. python, react, ml)"
          className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white flex-1"
        />
        <input
          type="text"
          value={jobLoc}
          onChange={(e) => setJobLoc(e.target.value)}
          placeholder="Location (e.g. Bengaluru, Hyderabad, India)"
          className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white flex-1"
        />
        <button
          onClick={fetchJobs}
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-6 py-2.5 rounded-2xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm"
        >
          <Search className="w-3.5 h-3.5" />
          {loading ? "Searching..." : "Find Openings"}
        </button>
      </div>

      <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
        {jobs.length === 0 && (
          <div className="h-60 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-400 text-xs gap-2">
            <Briefcase className="w-8 h-8 text-slate-300 stroke-[1.5]" />
            <span>Search for a tech role to inspect live job cards.</span>
          </div>
        )}
        {jobs.map((job) => (
          <div
            key={job.id}
            className="p-4 bg-white border border-slate-200/90 rounded-2xl hover:border-indigo-300 transition shadow-sm hover:shadow"
          >
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-bold text-slate-900 text-sm">{job.title}</h4>
                <div className="flex items-center gap-3 text-xs text-slate-500 font-medium mt-1">
                  <span className="flex items-center gap-1">
                    <Building className="w-3 h-3 text-slate-400" />
                    {job.company?.display_name || "Confidential"}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    {job.location?.display_name || "India"}
                  </span>
                </div>
              </div>
              <a
                href={job.redirect_url}
                target="_blank"
                rel="noreferrer"
                className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 bg-indigo-50 px-3 py-1.5 rounded-xl border border-indigo-100"
              >
                Apply <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
              {job.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
