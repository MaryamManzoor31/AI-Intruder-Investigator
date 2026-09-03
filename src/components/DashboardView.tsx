import React from 'react';
import { 
  FolderLock, 
  ShieldAlert, 
  Activity, 
  PlusCircle, 
  Sparkles, 
  ArrowRight,
  Clock,
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';
import { InvestigationCase } from '../types';
import { CaseCard } from './CaseCard';

interface DashboardViewProps {
  cases: InvestigationCase[];
  onOpenCase: (caseId: string) => void;
  onNewCase: () => void;
  onOpenDemo: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  cases,
  onOpenCase,
  onNewCase,
  onOpenDemo
}) => {
  const totalCases = cases.length;
  const investigatingCount = cases.filter(c => c.status === 'INVESTIGATING').length;
  const highRiskCount = cases.filter(c => c.risk === 'HIGH').length;

  return (
    <div id="dashboard-view" className="p-4 sm:p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Good morning, Investigator
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Review your investigations and continue where you left off.
          </p>
        </div>

        <button
          id="dashboard-new-investigation-btn"
          onClick={onNewCase}
          className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Investigation</span>
        </button>
      </div>

      {/* 3 Simple Metrics with Frosted Glass Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white/80 backdrop-blur-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-1">
            <span>Total Cases</span>
            <FolderLock className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono">{totalCases}</div>
          <p className="text-[11px] text-slate-500 mt-1">Active within workspace</p>
        </div>

        <div className="p-4 rounded-2xl bg-white/80 backdrop-blur-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-cyan-800 text-xs font-medium mb-1">
            <span>Investigating</span>
            <Activity className="w-4 h-4 text-cyan-600" />
          </div>
          <div className="text-2xl font-bold text-cyan-700 font-mono">{investigatingCount}</div>
          <p className="text-[11px] text-slate-500 mt-1">Pending tool correlation</p>
        </div>

        <div className="p-4 rounded-2xl bg-white/80 backdrop-blur-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-rose-800 text-xs font-medium mb-1">
            <span>High Risk</span>
            <ShieldAlert className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-bold text-rose-600 font-mono">{highRiskCount}</div>
          <p className="text-[11px] text-slate-500 mt-1">Requires immediate review</p>
        </div>
      </div>

      {/* Demo Fast-Track Hero Banner with Frosted Glass Styling */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-cyan-50 via-white to-blue-50/70 backdrop-blur-xl border border-cyan-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-cyan-100 border border-cyan-300 flex items-center justify-center text-cyan-800 shrink-0 mt-0.5 shadow-xs">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-slate-900">
                Hackathon Showcase: Warehouse Restricted Area Incident
              </h2>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-lg bg-cyan-100 text-cyan-800 border border-cyan-300">
                Recommended
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed max-w-2xl">
              Experience the end-to-end intelligence loop: Multimodal CCTV & telemetry analysis → Uncertainty identified → Allowlisted access-log query → Contradiction detected & assessment updated → Human verification → System learning.
            </p>
          </div>
        </div>

        <button
          id="hero-open-demo-btn"
          onClick={onOpenDemo}
          className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs shrink-0"
        >
          <span>Launch Showcase Case</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Recent Investigations List */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Recent Investigations
          </h2>
          <span className="text-xs text-slate-500 font-mono">3 active cases</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {cases.map((c) => (
            <CaseCard
              key={c.id}
              caseData={c}
              onOpen={onOpenCase}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
