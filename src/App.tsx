import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { CaseWorkspace } from './components/CaseWorkspace';
import { NewCaseWizard } from './components/NewCaseWizard';
import { LearningView } from './components/LearningView';
import { CaseCard } from './components/CaseCard';
import { InvestigationCase } from './types';
import { Search, Bell, Shield, Filter, PlusCircle, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<'dashboard' | 'cases' | 'new_case' | 'learning'>('dashboard');
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>('CASE-2026-001'); // Default to demo showcase or dashboard
  const [inWorkspace, setInWorkspace] = useState<boolean>(true); // start in showcase case for instant wow-factor, or switch to dashboard
  const [cases, setCases] = useState<InvestigationCase[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterRisk, setFilterRisk] = useState<string>('ALL');
  const [hasGeminiKey, setHasGeminiKey] = useState<boolean>(true);

  // Load all cases and health status from server
  const loadCases = async () => {
    try {
      const res = await fetch('/api/cases');
      if (res.ok) {
        const data = await res.json();
        setCases(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const checkHealth = async () => {
    try {
      const res = await fetch('/api/health');
      if (res.ok) {
        const data = await res.json();
        setHasGeminiKey(Boolean(data.hasGeminiKey));
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadCases();
    checkHealth();
  }, []);

  // Handlers
  const handleOpenCase = (caseId: string) => {
    setSelectedCaseId(caseId);
    setInWorkspace(true);
  };

  const handleBackToDashboard = () => {
    setInWorkspace(false);
    setCurrentView('dashboard');
  };

  const handleCaseCreated = (newCaseId: string) => {
    loadCases();
    setSelectedCaseId(newCaseId);
    setInWorkspace(true);
  };

  // Filtered cases for the "My Cases" view
  const filteredCases = cases.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRisk = filterRisk === 'ALL' || c.risk === filterRisk;
    return matchesSearch && matchesRisk;
  });

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans antialiased overflow-hidden relative selection:bg-cyan-500/20 selection:text-cyan-900">
      {/* Frosted Glass Ambient Luminous Light Orbs in Background */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-purple-200/40 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute top-1/3 -right-32 w-96 h-96 bg-cyan-200/40 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-emerald-200/30 rounded-full blur-[128px] pointer-events-none" />

      {/* Left Navigation Sidebar */}
      <Sidebar
        currentView={currentView}
        onNavigate={(view) => {
          if (view === 'new') setCurrentView('new_case');
          else setCurrentView(view as any);
          setInWorkspace(false);
        }}
        onSelectView={(view) => {
          if (view === 'new') setCurrentView('new_case');
          else setCurrentView(view as any);
          setInWorkspace(false);
        }}
        onOpenDemo={() => handleOpenCase('CASE-2026-001')}
        activeCaseCount={cases.filter(c => c.status === 'INVESTIGATING').length}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10">
        {/* Global Frosted Top Navbar */}
        <header className="h-14 bg-white/80 backdrop-blur-xl border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between shrink-0 z-20">
          <div className="flex items-center gap-3 min-w-0">
            {inWorkspace ? (
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-semibold text-cyan-800 bg-cyan-50 border border-cyan-200 px-2.5 py-0.5 rounded-lg shadow-xs">
                  CASE WORKSPACE
                </span>
                <span className="text-xs text-slate-500 font-mono hidden sm:inline">
                  {selectedCaseId}
                </span>
              </div>
            ) : (
              <div className="relative w-64 sm:w-80">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search cases, evidence, logs..."
                  className="w-full bg-slate-100/80 border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:bg-white backdrop-blur-md transition-all"
                />
              </div>
            )}
          </div>

          {/* Right Header Badges */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-slate-100/80 px-3 py-1 rounded-xl border border-slate-200 backdrop-blur-md">
              <span className={`w-2 h-2 rounded-full ${hasGeminiKey ? 'bg-emerald-500 shadow-xs shadow-emerald-500/50' : 'bg-amber-500 shadow-xs shadow-amber-500/50'}`} />
              <span className="text-[11px] font-mono text-slate-700">
                {hasGeminiKey ? 'Gemini 3.8 Flash Active' : 'Gemini Fallback Mode'}
              </span>
            </div>

            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <div className="w-7 h-7 rounded-full bg-cyan-100 border border-cyan-300 flex items-center justify-center font-bold text-xs text-cyan-800">
                SV
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-xs font-semibold text-slate-800 leading-none">S. Vance</div>
                <div className="text-[10px] text-slate-500 font-mono">Lead Investigator</div>
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Viewport */}
        <main className="flex-1 overflow-y-auto">
          {inWorkspace && selectedCaseId ? (
            <CaseWorkspace
              caseId={selectedCaseId}
              onBack={handleBackToDashboard}
              onRefreshCases={loadCases}
            />
          ) : currentView === 'dashboard' ? (
            <DashboardView
              cases={cases}
              onOpenCase={handleOpenCase}
              onNewCase={() => {
                setCurrentView('new_case');
              }}
              onOpenDemo={() => {
                handleOpenCase('CASE-2026-001');
              }}
            />
          ) : currentView === 'cases' ? (
            <div className="p-4 sm:p-6 max-w-6xl mx-auto space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h1 className="text-xl font-bold text-slate-900">All Investigations</h1>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Filter by severity and inspect case audit logs.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1 text-xs shadow-xs">
                    {(['ALL', 'HIGH', 'MEDIUM', 'LOW'] as const).map(level => (
                      <button
                        key={level}
                        onClick={() => setFilterRisk(level)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-mono cursor-pointer transition-all ${
                          filterRisk === level 
                            ? 'bg-cyan-100 text-cyan-800 font-bold border border-cyan-200 shadow-xs' 
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => setCurrentView('new_case')}
                    className="px-3.5 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>New</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {filteredCases.map(c => (
                  <CaseCard
                    key={c.id}
                    caseData={c}
                    onOpen={handleOpenCase}
                  />
                ))}
              </div>
            </div>
          ) : currentView === 'new_case' ? (
            <NewCaseWizard
              onCaseCreated={handleCaseCreated}
              onCancel={handleBackToDashboard}
            />
          ) : currentView === 'learning' ? (
            <LearningView
              onOpenDemoCase={() => handleOpenCase('CASE-2026-001')}
            />
          ) : null}
        </main>
      </div>
    </div>
  );
}
