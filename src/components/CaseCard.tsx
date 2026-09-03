import React from 'react';
import { ShieldAlert, Clock, ArrowRight, FolderLock, FileCheck } from 'lucide-react';
import { InvestigationCase, RiskLevel, CaseStatus } from '../types';

interface CaseCardProps {
  caseData: InvestigationCase;
  onOpen: (id: string) => void;
}

export const CaseCard: React.FC<CaseCardProps> = ({
  caseData,
  onOpen
}) => {
  const getRiskBadge = (risk: RiskLevel) => {
    switch (risk) {
      case 'HIGH':
        return (
          <span className="px-2 py-0.5 text-[11px] font-mono font-bold uppercase rounded-lg bg-rose-50 text-rose-700 border border-rose-200 backdrop-blur-md flex items-center gap-1.5 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            High Risk
          </span>
        );
      case 'MEDIUM':
        return (
          <span className="px-2 py-0.5 text-[11px] font-mono font-bold uppercase rounded-lg bg-amber-50 text-amber-800 border border-amber-200 backdrop-blur-md flex items-center gap-1.5 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Medium Risk
          </span>
        );
      case 'LOW':
        return (
          <span className="px-2 py-0.5 text-[11px] font-mono font-bold uppercase rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 backdrop-blur-md flex items-center gap-1.5 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Low Risk
          </span>
        );
    }
  };

  const getStatusBadge = (status: CaseStatus) => {
    switch (status) {
      case 'INVESTIGATING':
        return (
          <span className="px-2 py-0.5 text-[10px] font-mono font-semibold uppercase rounded-lg bg-cyan-50 text-cyan-800 border border-cyan-200 backdrop-blur-md">
            Investigating
          </span>
        );
      case 'AWAITING_REVIEW':
        return (
          <span className="px-2 py-0.5 text-[10px] font-mono font-semibold uppercase rounded-lg bg-amber-50 text-amber-800 border border-amber-200 backdrop-blur-md">
            Awaiting Review
          </span>
        );
      case 'VERIFIED':
        return (
          <span className="px-2 py-0.5 text-[10px] font-mono font-semibold uppercase rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 backdrop-blur-md">
            Verified
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 text-[10px] font-mono uppercase rounded-lg bg-slate-100 border border-slate-200 text-slate-700 backdrop-blur-md">
            {status}
          </span>
        );
    }
  };

  return (
    <div 
      id={`case-card-${caseData.id}`}
      onClick={() => onOpen(caseData.id)}
      className="p-4 rounded-2xl bg-white/80 hover:bg-white backdrop-blur-xl border border-slate-200 hover:border-cyan-400 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer group flex flex-col justify-between"
    >
      <div>
        {/* Top bar: Case ID, Status, Risk */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-cyan-800 font-bold">{caseData.id}</span>
            {getStatusBadge(caseData.status)}
          </div>
          {getRiskBadge(caseData.risk)}
        </div>

        {/* Title & Description */}
        <h3 className="text-sm font-semibold text-slate-900 group-hover:text-cyan-700 transition-colors leading-snug">
          {caseData.title}
        </h3>
        <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
          {caseData.description}
        </p>
      </div>

      {/* Footer bar */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 font-mono text-slate-500">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{caseData.lastUpdated}</span>
          </span>
          <span className="flex items-center gap-1 font-mono text-slate-500">
            <FileCheck className="w-3.5 h-3.5 text-slate-400" />
            <span>{caseData.evidence.length} files</span>
          </span>
        </div>

        <span className="text-cyan-700 group-hover:translate-x-0.5 transition-transform flex items-center gap-1 font-semibold">
          <span>Open Case</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </div>
  );
};
