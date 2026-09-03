import React, { useState, useEffect } from 'react';
import { X, Play, Pause, RotateCcw, ChevronRight, ChevronLeft, CheckCircle2, ShieldAlert, Sparkles, Terminal, RefreshCw, ShieldCheck } from 'lucide-react';

interface CaseReplayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ReplayStep {
  time: string;
  title: string;
  detail: string;
  category: 'evidence' | 'analysis' | 'uncertainty' | 'tool' | 'reassessment' | 'verification';
  findingSnapshot: string;
  riskSnapshot: 'HIGH' | 'MEDIUM' | 'LOW';
  confidenceSnapshot: number;
}

export const CaseReplayModal: React.FC<CaseReplayModalProps> = ({
  isOpen,
  onClose
}) => {
  const steps: ReplayStep[] = [
    {
      time: '10:40:52',
      title: 'Evidence received',
      detail: '5 multimodal evidence items ingested (warehouse_camera.mp4, access_log.csv, security_report.pdf, entrance_photo.jpg).',
      category: 'evidence',
      findingSnapshot: 'Pending AI processing...',
      riskSnapshot: 'MEDIUM',
      confidenceSnapshot: 50
    },
    {
      time: '10:40:56',
      title: 'Evidence analyzed by Gemini',
      detail: 'Gemini analyzed CCTV keyframes, sensor timestamps, and incident supervisor report.',
      category: 'analysis',
      findingSnapshot: 'Possible unauthorized access to restricted warehouse area.',
      riskSnapshot: 'HIGH',
      confidenceSnapshot: 78
    },
    {
      time: '10:41:03',
      title: 'Evidence timeline generated',
      detail: '5 chronological events mapped with source citations and confidence values.',
      category: 'analysis',
      findingSnapshot: 'Possible unauthorized access to restricted warehouse area.',
      riskSnapshot: 'HIGH',
      confidenceSnapshot: 78
    },
    {
      time: '10:41:08',
      title: 'Uncertainty identified',
      detail: 'Authorization status unknown: Video confirms presence, but badge credentials cannot be verified from visual footage.',
      category: 'uncertainty',
      findingSnapshot: 'Possible unauthorized access to restricted warehouse area.',
      riskSnapshot: 'HIGH',
      confidenceSnapshot: 78
    },
    {
      time: '10:41:12',
      title: 'Controlled tool requested: query_event_logs()',
      detail: 'Investigator approved executing allowlisted access-control query for Bay 4 turnstile reader.',
      category: 'tool',
      findingSnapshot: 'Querying external security database...',
      riskSnapshot: 'HIGH',
      confidenceSnapshot: 78
    },
    {
      time: '10:41:17',
      title: 'New authoritative evidence retrieved',
      detail: 'Badge ID 2841 authenticated at 10:41:15 with Emergency Work Permit #WP-9042.',
      category: 'evidence',
      findingSnapshot: 'New badge record retrieved; initiating AI reassessment...',
      riskSnapshot: 'MEDIUM',
      confidenceSnapshot: 85
    },
    {
      time: '10:41:20',
      title: 'Assessment revised (Contradiction resolved)',
      detail: 'Finding changed from "Possible unauthorized access" (78%) to "Unauthorized access is not confirmed" (93%).',
      category: 'reassessment',
      findingSnapshot: 'Unauthorized access is not confirmed.',
      riskSnapshot: 'MEDIUM',
      confidenceSnapshot: 93
    },
    {
      time: '10:41:24',
      title: 'Assessment verified with human oversight',
      detail: 'Checklist completed: PARTIALLY SUPPORTED (Authorized entry confirmed; procedural check-in required).',
      category: 'verification',
      findingSnapshot: 'Unauthorized access is not confirmed (Verified).',
      riskSnapshot: 'MEDIUM',
      confidenceSnapshot: 93
    }
  ];

  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentStepIndex(prev => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 2200);
    }
    return () => clearInterval(interval);
  }, [isPlaying, steps.length]);

  if (!isOpen) return null;

  const activeStep = steps[currentStepIndex];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4">
      <div 
        id="case-replay-modal"
        className="w-full max-w-2xl bg-white/95 backdrop-blur-2xl border border-slate-200 rounded-3xl shadow-xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-800">
              <RotateCcw className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Case Investigation Replay</h3>
              <p className="text-xs text-slate-500">Visual Replay of Observable AI & Human Decision Steps</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current State Indicator Box */}
        <div className="p-5 bg-slate-50/70 border-b border-slate-200">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-mono text-cyan-800 font-bold">{activeStep.time}</span>
            <div className="flex items-center gap-2 font-mono">
              <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold ${
                activeStep.riskSnapshot === 'HIGH' ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-amber-50 text-amber-800 border border-amber-200'
              }`}>
                {activeStep.riskSnapshot} RISK
              </span>
              <span className="text-slate-500 text-[11px] font-medium">AI Confidence: {activeStep.confidenceSnapshot}%</span>
            </div>
          </div>
          <h4 className="text-sm font-bold text-slate-900">{activeStep.findingSnapshot}</h4>
          <p className="text-xs text-slate-700 mt-1 leading-relaxed">{activeStep.detail}</p>
        </div>

        {/* Vertical Step Timeline */}
        <div className="p-5 overflow-y-auto space-y-3 flex-1">
          {steps.map((step, idx) => {
            const isCurrent = idx === currentStepIndex;
            const isPast = idx < currentStepIndex;

            return (
              <div
                key={idx}
                onClick={() => setCurrentStepIndex(idx)}
                className={`p-3.5 rounded-2xl border flex items-start gap-3 cursor-pointer transition-all shadow-2xs ${
                  isCurrent
                    ? 'bg-cyan-50/95 border-cyan-300 ring-2 ring-cyan-200/50'
                    : isPast
                    ? 'bg-slate-50/80 border-slate-200 opacity-90 hover:bg-white'
                    : 'bg-slate-50/30 border-slate-100 opacity-40'
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {isPast || isCurrent ? (
                    <span className="w-5 h-5 rounded-full bg-cyan-100 text-cyan-800 font-bold flex items-center justify-center font-mono text-xs">
                      {idx + 1}
                    </span>
                  ) : (
                    <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center font-mono text-xs">
                      {idx + 1}
                    </span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-slate-900">{step.title}</span>
                    <span className="font-mono text-[10px] text-slate-500 shrink-0">{step.time}</span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-0.5 line-clamp-1">{step.detail}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Controls Footer */}
        <div className="p-4 sm:p-5 bg-slate-50/80 border-t border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentStepIndex(Math.max(0, currentStepIndex - 1))}
              disabled={currentStepIndex === 0}
              className="p-2 rounded-xl bg-white hover:bg-slate-100 disabled:opacity-40 text-slate-700 transition-all cursor-pointer border border-slate-200 shadow-2xs"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              id="case-replay-play-btn"
              onClick={() => setIsPlaying(!isPlaying)}
              className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
              <span>{isPlaying ? "Pause Replay" : "Play Replay"}</span>
            </button>

            <button
              onClick={() => setCurrentStepIndex(Math.min(steps.length - 1, currentStepIndex + 1))}
              disabled={currentStepIndex === steps.length - 1}
              className="p-2 rounded-xl bg-white hover:bg-slate-100 disabled:opacity-40 text-slate-700 transition-all cursor-pointer border border-slate-200 shadow-2xs"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => setCurrentStepIndex(0)}
            className="text-xs font-mono text-slate-500 hover:text-cyan-800 font-semibold transition-colors cursor-pointer flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restart</span>
          </button>
        </div>
      </div>
    </div>
  );
};
