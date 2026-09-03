import React, { useState } from 'react';
import { 
  HelpCircle, 
  ArrowRight, 
  Terminal, 
  CheckCircle2, 
  Loader2, 
  Search, 
  Film, 
  History,
  Check
} from 'lucide-react';
import { Uncertainty, InvestigationToolName } from '../types';

interface UncertaintyCardProps {
  uncertainty?: Uncertainty;
  onExecuteTool: (toolName: InvestigationToolName) => Promise<void>;
  isInvestigating: boolean;
  isResolved: boolean;
  stepCount: number;
}

export const UncertaintyCard: React.FC<UncertaintyCardProps> = ({
  uncertainty,
  onExecuteTool,
  isInvestigating,
  isResolved,
  stepCount
}) => {
  const [selectedTool, setSelectedTool] = useState<InvestigationToolName>(
    uncertainty?.tool || 'query_event_logs'
  );
  const [showToolSelect, setShowToolSelect] = useState<boolean>(false);

  if (!uncertainty && !isResolved) return null;

  return (
    <div 
      id="uncertainty-card"
      className={`rounded-2xl border p-5 transition-all duration-200 backdrop-blur-xl shadow-xs ${
        isResolved 
          ? 'bg-emerald-50/90 border-emerald-200' 
          : 'bg-amber-50/80 border-amber-200'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {isResolved ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <HelpCircle className="w-5 h-5 text-amber-600 shrink-0" />
          )}
          <h3 className="text-sm font-bold text-slate-900">
            {isResolved ? "Uncertainty Resolved" : "We're not sure yet"}
          </h3>
        </div>

        <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-lg border ${
          isResolved 
            ? 'bg-emerald-100 text-emerald-800 border-emerald-200' 
            : 'bg-amber-100 text-amber-900 border-amber-200'
        }`}>
          {isResolved ? "Investigated & Clarified" : "HIGH PRIORITY UNCERTAINTY"}
        </span>
      </div>

      {/* Uncertainty description */}
      <div className="text-xs text-slate-700 leading-relaxed space-y-2">
        <p className="bg-white/90 p-3.5 rounded-xl border border-slate-200 text-slate-800 shadow-2xs">
          {isResolved 
            ? "Authoritative badge credentials and dispatch records have been correlated. Authorization status is now verified."
            : uncertainty?.reason || "From the available video, we cannot confirm whether the person was authorized to enter."}
        </p>

        {!isResolved && (
          <p className="text-slate-700">
            <span className="font-bold text-amber-900">What we should do: </span>
            {uncertainty?.recommendedAction || "Checking the access-control records may help answer this."}
          </p>
        )}
      </div>

      {/* Action / Tool Execution Area */}
      {!isResolved && (
        <div className="mt-4 pt-3 border-t border-amber-200/70">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="text-[11px] text-slate-600 font-mono flex items-center gap-1.5">
              <span>Step {stepCount + 1} of 4 max</span>
              <span className="text-slate-400">•</span>
              <button 
                onClick={() => setShowToolSelect(!showToolSelect)}
                className="text-cyan-800 hover:text-cyan-950 underline cursor-pointer font-semibold"
              >
                {showToolSelect ? "Hide tool selection" : "Change investigation tool"}
              </button>
            </div>

            {/* Primary Action Button */}
            <button
              id="execute-investigation-tool-btn"
              disabled={isInvestigating}
              onClick={() => onExecuteTool(selectedTool)}
              className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-300 disabled:text-slate-500 text-white font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              {isInvestigating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Checking Access Records...</span>
                </>
              ) : (
                <>
                  <span>Check Access Records</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          {/* Optional Tool Selector for Advanced Inspection */}
          {showToolSelect && (
            <div className="mt-3 p-3.5 rounded-xl bg-white/95 border border-slate-200 shadow-xs space-y-2">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Allowlisted Investigation Tools
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <button
                  onClick={() => setSelectedTool('query_event_logs')}
                  className={`p-2 rounded-xl text-left border flex items-center gap-2 cursor-pointer transition-all ${
                    selectedTool === 'query_event_logs'
                      ? 'bg-cyan-50 text-cyan-900 border-cyan-300 font-semibold'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <Terminal className="w-3.5 h-3.5 text-cyan-700" />
                  <div>
                    <div className="font-semibold">query_event_logs()</div>
                    <div className="text-[10px] text-slate-500">Badge & turnstile records</div>
                  </div>
                </button>

                <button
                  onClick={() => setSelectedTool('search_case_evidence')}
                  className={`p-2 rounded-xl text-left border flex items-center gap-2 cursor-pointer transition-all ${
                    selectedTool === 'search_case_evidence'
                      ? 'bg-cyan-50 text-cyan-900 border-cyan-300 font-semibold'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <Search className="w-3.5 h-3.5 text-purple-600" />
                  <div>
                    <div className="font-semibold">search_case_evidence()</div>
                    <div className="text-[10px] text-slate-500">Reports and work orders</div>
                  </div>
                </button>

                <button
                  onClick={() => setSelectedTool('extract_relevant_frames')}
                  className={`p-2 rounded-xl text-left border flex items-center gap-2 cursor-pointer transition-all ${
                    selectedTool === 'extract_relevant_frames'
                      ? 'bg-cyan-50 text-cyan-900 border-cyan-300 font-semibold'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <Film className="w-3.5 h-3.5 text-blue-600" />
                  <div>
                    <div className="font-semibold">extract_relevant_frames()</div>
                    <div className="text-[10px] text-slate-500">High-res optical zoom</div>
                  </div>
                </button>

                <button
                  onClick={() => setSelectedTool('find_related_incidents')}
                  className={`p-2 rounded-xl text-left border flex items-center gap-2 cursor-pointer transition-all ${
                    selectedTool === 'find_related_incidents'
                      ? 'bg-cyan-50 text-cyan-900 border-cyan-300 font-semibold'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <History className="w-3.5 h-3.5 text-emerald-600" />
                  <div>
                    <div className="font-semibold">find_related_incidents()</div>
                    <div className="text-[10px] text-slate-500">Historical case memory</div>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
