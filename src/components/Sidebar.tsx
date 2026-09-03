import React from 'react';
import { 
  ShieldAlert, 
  LayoutDashboard, 
  FolderLock, 
  PlusCircle, 
  BrainCircuit, 
  Settings, 
  Sparkles, 
  CheckCircle2,
  Lock
} from 'lucide-react';

interface SidebarProps {
  currentView: string;
  onNavigate?: (view: any) => void;
  onSelectView?: (view: any) => void;
  activeCaseId?: string;
  onOpenDemo?: () => void;
  activeCaseCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onNavigate,
  onSelectView,
  activeCaseId,
  onOpenDemo,
  activeCaseCount = 3
}) => {
  const handleNav = (view: any) => {
    if (onNavigate) onNavigate(view);
    if (onSelectView) onSelectView(view);
  };

  return (
    <aside 
      id="incidentiq-sidebar" 
      className="w-64 bg-white/80 backdrop-blur-xl border-r border-slate-200 flex flex-col justify-between select-none h-screen sticky top-0 shrink-0 z-30"
    >
      <div>
        {/* Logo and Brand */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleNav('dashboard')}>
            <div className="w-9 h-9 rounded-xl bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-700 backdrop-blur-md shadow-xs">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-semibold tracking-tight text-slate-900 text-base">IncidentIQ</span>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                  MVP
                </span>
              </div>
              <p className="text-xs text-slate-500">From Evidence to Insight</p>
            </div>
          </div>
        </div>

        {/* Primary Action */}
        <div className="p-4">
          <button
            id="sidebar-new-case-btn"
            onClick={() => handleNav('new')}
            className="w-full flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold py-2.5 px-4 rounded-xl transition-all shadow-xs cursor-pointer text-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Investigation</span>
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="px-3 space-y-1">
          <button
            id="nav-dashboard-btn"
            onClick={() => handleNav('dashboard')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
              currentView === 'dashboard'
                ? 'bg-cyan-50 text-cyan-800 border border-cyan-200 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 border border-transparent'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard</span>
          </button>

          <button
            id="nav-cases-btn"
            onClick={() => handleNav('cases')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
              currentView === 'cases'
                ? 'bg-cyan-50 text-cyan-800 border border-cyan-200 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 border border-transparent'
            }`}
          >
            <div className="flex items-center gap-3">
              <FolderLock className="w-4 h-4" />
              <span>My Cases</span>
            </div>
            <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-mono border border-slate-200">{activeCaseCount}</span>
          </button>

          <button
            id="nav-learning-btn"
            onClick={() => handleNav('learning')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
              currentView === 'learning'
                ? 'bg-cyan-50 text-cyan-800 border border-cyan-200 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 border border-transparent'
            }`}
          >
            <BrainCircuit className="w-4 h-4" />
            <span>Learning & Memory</span>
          </button>
        </nav>

        {/* Demo Fast Track Callout */}
        <div className="mx-3 mt-6 p-3.5 rounded-2xl bg-slate-50/90 border border-slate-200/90 shadow-xs">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-cyan-700" />
            <span className="text-xs font-semibold text-cyan-800 uppercase tracking-wider">Demo Investigation</span>
          </div>
          <p className="text-xs text-slate-600 mb-3 leading-relaxed">
            Experience the complete loop: Evidence → Uncertainty → Reassessment → Verification.
          </p>
          <button
            id="sidebar-demo-case-btn"
            onClick={onOpenDemo}
            className="w-full text-xs font-medium py-2 px-3 rounded-xl bg-white hover:bg-slate-100 text-cyan-800 border border-slate-200 flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs"
          >
            <span>Open Demo Case</span>
            <span className="font-mono text-[10px] text-cyan-700 font-bold">#001</span>
          </button>
        </div>
      </div>

      {/* Footer: User & Human Oversight Badge */}
      <div className="p-4 border-t border-slate-200">
        <div className="flex items-center gap-2 mb-3 text-[11px] text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1.5 rounded-xl font-medium">
          <Lock className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
          <span>Human-in-the-Loop Enforced</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-cyan-100 text-cyan-800 font-semibold text-xs flex items-center justify-center border border-cyan-200">
            SV
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-medium text-slate-800 truncate">Sarah Vance</p>
            <p className="text-[11px] text-slate-500 truncate">Senior Incident Analyst</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
