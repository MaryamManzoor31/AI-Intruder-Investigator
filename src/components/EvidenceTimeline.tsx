import React from 'react';
import { Clock, CheckCircle, AlertTriangle, AlertCircle, FileText, ChevronRight } from 'lucide-react';
import { TimelineEvent } from '../types';

interface EvidenceTimelineProps {
  events: TimelineEvent[];
  currentTime: number;
  onSelectEvent: (event: TimelineEvent) => void;
  onViewEvidence: (evidenceId: string) => void;
}

export const EvidenceTimeline: React.FC<EvidenceTimelineProps> = ({
  events,
  currentTime,
  onSelectEvent,
  onViewEvidence
}) => {
  return (
    <div id="evidence-timeline-section" className="mt-4 bg-white/80 backdrop-blur-xl border border-slate-200 rounded-2xl p-4 shadow-xs">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-cyan-700" />
          <h3 className="text-sm font-bold text-slate-900">Evidence Timeline</h3>
          <span className="text-[11px] font-mono font-semibold text-cyan-800 bg-cyan-50 px-2.5 py-0.5 rounded-lg border border-cyan-200">
            {events.length} Events Correlated
          </span>
        </div>
        <p className="text-xs text-slate-500 hidden sm:block">
          Click an event to jump video to that moment
        </p>
      </div>

      {/* Horizontal scrollable timeline track */}
      <div className="overflow-x-auto pb-2 -mx-1 px-1">
        <div className="flex items-stretch gap-3 min-w-max">
          {events.map((event, idx) => {
            const isActive = Math.abs(currentTime - event.timeSeconds) < 6;
            const isCritical = event.flag === 'critical';
            const isSuspicious = event.flag === 'suspicious';
            const isCleared = event.flag === 'cleared';

            return (
              <div
                key={event.id}
                id={`timeline-node-${idx}`}
                onClick={() => onSelectEvent(event)}
                className={`relative w-64 rounded-xl p-3 border transition-all cursor-pointer select-none flex flex-col justify-between backdrop-blur-md shadow-2xs ${
                  isActive
                    ? 'bg-cyan-50/95 border-cyan-400 ring-2 ring-cyan-200/50 shadow-sm -translate-y-0.5'
                    : isCritical
                    ? 'bg-rose-50/90 border-rose-200 hover:border-rose-300'
                    : isSuspicious
                    ? 'bg-amber-50/90 border-amber-200 hover:border-amber-300'
                    : isCleared
                    ? 'bg-emerald-50/90 border-emerald-200 hover:border-emerald-300'
                    : 'bg-white/90 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div>
                  {/* Top metadata: timestamp & badge */}
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono text-xs font-bold text-cyan-800">
                      {event.timestamp}
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-lg bg-slate-100 text-slate-600 border border-slate-200 font-medium">
                      T+{Math.floor(event.timeSeconds)}s
                    </span>
                  </div>

                  {/* Event summary text */}
                  <p className="text-xs text-slate-800 font-medium leading-snug line-clamp-2 mb-2">
                    {event.description}
                  </p>
                </div>

                {/* Bottom row: source tag & quick view evidence button */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500 font-mono text-[10px] truncate max-w-[130px]">
                    {event.source}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewEvidence(event.evidenceId);
                    }}
                    className="text-cyan-700 hover:text-cyan-800 font-semibold flex items-center gap-0.5 text-[10px] cursor-pointer"
                  >
                    <span>Source</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
