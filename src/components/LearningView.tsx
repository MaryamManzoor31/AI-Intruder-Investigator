import React, { useEffect, useState } from 'react';
import { BrainCircuit, CheckCircle2, ShieldAlert, History, ArrowRight, Lightbulb, Sparkles } from 'lucide-react';
import { LearningRecord, CaseMemory } from '../types';

interface LearningViewProps {
  onOpenDemoCase: () => void;
}

export const LearningView: React.FC<LearningViewProps> = ({
  onOpenDemoCase
}) => {
  const [learningRecords, setLearningRecords] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/learning')
      .then(res => res.json())
      .then(data => setLearningRecords(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div id="learning-view" className="max-w-5xl mx-auto py-6 px-4 space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2.5 mb-1.5">
          <div className="w-8 h-8 rounded-xl bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-800">
            <BrainCircuit className="w-4 h-4" />
          </div>
          <h1 className="text-xl font-bold text-slate-900">
            Investigation Learning & Historical Memory
          </h1>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
          IncidentIQ retains verified investigator decisions to prioritize future investigation tools and recognize recurring incident uncertainties.
        </p>
      </div>

      {/* Learning Concept Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-cyan-50/80 border border-cyan-200 backdrop-blur-xl flex items-start gap-3.5 shadow-xs">
        <Lightbulb className="w-5 h-5 text-cyan-700 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-700 leading-relaxed">
          <span className="font-bold text-cyan-900">How application learning works: </span>
          When an investigator confirms that a controlled tool (like querying badge logs) resolved an uncertainty, the system records that strategy. Future incidents with matching uncertainties prioritize that proven path first.
        </div>
      </div>

      {/* Active Learned Strategies */}
      <div>
        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
          Learned Investigation Strategies ({learningRecords.length})
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {learningRecords.map((item) => (
            <div 
              key={item.id}
              className="p-5 rounded-2xl bg-white/80 border border-slate-200 hover:border-cyan-400 backdrop-blur-xl transition-all space-y-3 shadow-xs"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-cyan-800 font-mono">
                  UNCERTAINTY: {item.uncertaintyType}
                </span>
                <span className="text-[10px] font-mono font-semibold text-cyan-900 bg-cyan-50 border border-cyan-200 px-2 py-0.5 rounded-lg">
                  Tool: {item.pastSuccessfulAction}()
                </span>
              </div>

              <div>
                <div className="text-[10px] font-mono uppercase font-bold text-slate-400 mb-0.5">Learned Strategy</div>
                <p className="text-xs font-semibold text-slate-800 leading-relaxed">
                  {item.learnedStrategy}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-700 font-medium">
                <span className="text-emerald-700 font-bold">Outcome: </span>
                {item.outcome}
              </div>

              <div className="text-[11px] text-slate-500 flex items-center justify-between pt-2 border-t border-slate-200">
                <span>Impact: {item.impact}</span>
                <span className="font-mono text-cyan-800 font-bold">{item.caseId}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Historical Case Memory Bank */}
      <div className="bg-white/80 border border-slate-200 backdrop-blur-xl rounded-2xl p-5 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-cyan-700" />
            <h3 className="text-sm font-bold text-slate-900">Historical Case Memory Bank</h3>
          </div>
          <button
            onClick={onOpenDemoCase}
            className="text-xs font-bold text-cyan-800 hover:text-cyan-900 flex items-center gap-1 cursor-pointer"
          >
            <span>Test Active Demo Case</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200 shadow-2xs space-y-1">
            <div className="flex items-center justify-between font-mono text-[11px]">
              <span className="text-cyan-800 font-bold">CASE-2025-089</span>
              <span className="text-slate-500 font-medium">Loading Dock Door Breach</span>
            </div>
            <p className="text-slate-600 text-[11px]">
              Same uncertainty: Authorization status • Queried centralized badge event logs • Reassessed as authorized HVAC contractor.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200 shadow-2xs space-y-1">
            <div className="flex items-center justify-between font-mono text-[11px]">
              <span className="text-cyan-800 font-bold">CASE-2025-064</span>
              <span className="text-slate-500 font-medium">Server Annex Night Access</span>
            </div>
            <p className="text-slate-600 text-[11px]">
              Same uncertainty: Credential verification • Correlated secondary turnstile logs with shift roster • Identified off-shift engineer.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
