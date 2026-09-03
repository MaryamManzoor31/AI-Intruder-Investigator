import React, { useState } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Info, 
  ChevronDown, 
  ChevronUp, 
  ArrowRight, 
  History, 
  ShieldQuestion,
  Check
} from 'lucide-react';
import { Assessment, ReassessmentChange, RiskLevel } from '../types';

interface AssessmentPanelProps {
  assessment: Assessment;
  assessmentChange?: ReassessmentChange;
  onViewTriggerEvidence?: (evidenceId?: string) => void;
  onOpenVerification: () => void;
  isVerified?: boolean;
}

export const AssessmentPanel: React.FC<AssessmentPanelProps> = ({
  assessment,
  assessmentChange,
  onViewTriggerEvidence,
  onOpenVerification,
  isVerified = false
}) => {
  const [expandedKey, setExpandedKey] = useState<string | null>(null);

  const getRiskBadge = (risk: RiskLevel) => {
    switch (risk) {
      case 'HIGH':
        return (
          <span className="px-2.5 py-1 text-xs font-bold uppercase rounded-lg bg-rose-50 text-rose-700 border border-rose-200 backdrop-blur-md flex items-center gap-1.5 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            HIGH RISK
          </span>
        );
      case 'MEDIUM':
        return (
          <span className="px-2.5 py-1 text-xs font-bold uppercase rounded-lg bg-amber-50 text-amber-800 border border-amber-200 backdrop-blur-md flex items-center gap-1.5 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            MEDIUM RISK
          </span>
        );
      case 'LOW':
        return (
          <span className="px-2.5 py-1 text-xs font-bold uppercase rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 backdrop-blur-md flex items-center gap-1.5 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            LOW RISK
          </span>
        );
    }
  };

  return (
    <div id="assessment-panel" className="space-y-4">
      {/* Contradiction & Reassessment Change Banner (Highlights when AI modifies its finding) */}
      {assessmentChange?.occurred && (
        <div 
          id="assessment-changed-banner"
          className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-cyan-50 via-white to-blue-50/80 backdrop-blur-2xl border-2 border-cyan-300 shadow-xs animate-in fade-in slide-in-from-top-2 duration-300"
        >
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-cyan-100 text-cyan-800 border border-cyan-200 backdrop-blur-md">
                <History className="w-4 h-4" />
              </span>
              <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-900">
                Assessment Changed
              </h3>
            </div>
            <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-lg bg-cyan-100 text-cyan-800 border border-cyan-200">
              New Evidence Disproved Initial Finding
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 my-3 text-xs">
            {/* Previous */}
            <div className="p-3 rounded-xl bg-white border border-slate-200 opacity-85 shadow-2xs">
              <div className="text-[10px] font-mono text-slate-500 uppercase">Previous Assessment</div>
              <div className="font-semibold text-slate-600 mt-0.5 line-through">
                {assessmentChange.previousFinding}
              </div>
              <div className="text-[11px] text-rose-600 font-mono mt-1 font-semibold">
                Risk: {assessmentChange.previousRisk} • AI Confidence: {assessmentChange.previousConfidence}%
              </div>
            </div>

            {/* New */}
            <div className="p-3 rounded-xl bg-cyan-50/90 border border-cyan-300 shadow-2xs">
              <div className="text-[10px] font-mono text-cyan-800 uppercase font-bold">New Finding</div>
              <div className="font-semibold text-slate-900 mt-0.5">
                {assessmentChange.newFinding}
              </div>
              <div className="text-[11px] text-cyan-800 font-mono mt-1 font-semibold">
                Risk: {assessmentChange.newRisk} • AI Confidence: {assessmentChange.newConfidence}%
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-cyan-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <p className="text-xs text-slate-700 leading-relaxed">
              <span className="font-bold text-cyan-900">Why did this change?</span> {assessmentChange.reason}
            </p>
            {assessmentChange.triggerEvidenceId && (
              <button
                id="view-trigger-evidence-btn"
                onClick={() => onViewTriggerEvidence?.(assessmentChange.triggerEvidenceId)}
                className="shrink-0 text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-500 px-3 py-1.5 rounded-xl transition-all cursor-pointer shadow-xs flex items-center gap-1"
              >
                <span>View new evidence</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Main What We Found Card */}
      <div className="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-cyan-700" />
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">What happened?</span>
          </div>
          <span className="text-[11px] font-mono text-slate-500">Updated {assessment.timestamp}</span>
        </div>

        {/* Primary Finding Headline */}
        <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
          {assessment.finding}
        </h2>

        {/* Risk Level & AI Confidence */}
        <div className="flex flex-wrap items-center gap-3 my-3.5 pt-3 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Risk:</span>
            {getRiskBadge(assessment.risk)}
          </div>

          <div className="flex items-center gap-2 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200">
            <span className="text-xs text-slate-500">AI Confidence:</span>
            <span className="text-xs font-mono font-bold text-cyan-800">{assessment.confidence}%</span>
            <span className="text-[11px] text-slate-500">({assessment.confidenceLabel})</span>
          </div>

          {isVerified && (
            <span className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1 ml-auto">
              <Check className="w-3.5 h-3.5" />
              <span>Verified</span>
            </span>
          )}
        </div>

        {/* Plain-language Summary */}
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200">
          {assessment.summary}
        </p>

        {/* Key Evidence Breakdown */}
        <div className="mt-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Key Evidence Points</div>
          <div className="space-y-2">
            {/* Supporting evidence */}
            {assessment.supportingEvidence.map((item, idx) => (
              <div 
                key={`sup-${idx}`}
                className="text-xs bg-emerald-50/90 border border-emerald-200 rounded-xl p-2.5 flex items-start gap-2 text-emerald-950 font-medium"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span className="leading-snug">{item}</span>
              </div>
            ))}

            {/* Contradictory / Missing items */}
            {assessment.contradictoryOrMissing.map((item, idx) => (
              <div 
                key={`mis-${idx}`}
                className="text-xs bg-amber-50/90 border border-amber-200 rounded-xl p-2.5 flex items-start gap-2 text-amber-950 font-medium"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                <span className="leading-snug">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Verification Trigger Button */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
          <p className="text-xs text-slate-500">
            {isVerified 
              ? "Findings have been verified with human oversight." 
              : "Review checklist to verify final assessment."}
          </p>
          <button
            id="verify-assessment-btn"
            onClick={onOpenVerification}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-xs ${
              isVerified
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                : 'bg-cyan-600 hover:bg-cyan-500 text-white'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{isVerified ? "Review Verification" : "Verify Assessment"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
