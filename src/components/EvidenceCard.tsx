import React from 'react';
import { 
  Film, 
  FileText, 
  Image as ImageIcon, 
  FileSpreadsheet, 
  Terminal, 
  ArrowRight,
  Clock,
  HardDrive
} from 'lucide-react';
import { Evidence } from '../types';

interface EvidenceCardProps {
  evidence: Evidence;
  onView: (evidence: Evidence) => void;
  isNew?: boolean;
}

export const EvidenceCard: React.FC<EvidenceCardProps> = ({
  evidence,
  onView,
  isNew = false
}) => {
  const getTypeIcon = () => {
    switch (evidence.type) {
      case 'video':
        return <Film className="w-4 h-4 text-cyan-700" />;
      case 'image':
        return <ImageIcon className="w-4 h-4 text-purple-600" />;
      case 'pdf':
        return <FileText className="w-4 h-4 text-rose-600" />;
      case 'csv':
      case 'log':
        return <Terminal className="w-4 h-4 text-amber-700" />;
      default:
        return <FileText className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div 
      id={`evidence-card-${evidence.id}`}
      className={`rounded-2xl border p-4 transition-all duration-200 backdrop-blur-xl ${
        isNew 
          ? 'bg-cyan-50/90 border-cyan-300 ring-1 ring-cyan-200 shadow-xs' 
          : 'bg-white/80 border-slate-200 hover:border-slate-300 hover:bg-white shadow-xs'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 mt-0.5">
            {getTypeIcon()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-xs font-semibold text-slate-900 font-mono">{evidence.name}</h4>
              {isNew && (
                <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-lg bg-cyan-100 text-cyan-800 border border-cyan-200">
                  New Uncovered
                </span>
              )}
            </div>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">{evidence.summary}</p>
          </div>
        </div>

        <button
          id={`view-evidence-btn-${evidence.id}`}
          onClick={() => onView(evidence)}
          className="shrink-0 flex items-center gap-1.5 text-xs font-semibold text-cyan-800 hover:text-cyan-900 bg-cyan-50 hover:bg-cyan-100 px-3 py-1.5 rounded-xl border border-cyan-200 transition-all cursor-pointer shadow-xs"
        >
          <span>View evidence</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Metadata bar */}
      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-mono">
        <div className="flex items-center gap-3">
          {evidence.timestamp && (
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-400" />
              <span>{evidence.timestamp}</span>
            </span>
          )}
          {evidence.size && (
            <span className="flex items-center gap-1">
              <HardDrive className="w-3 h-3 text-slate-400" />
              <span>{evidence.size}</span>
            </span>
          )}
        </div>
        <span className="text-[10px] uppercase text-slate-600 px-2 py-0.5 rounded-lg bg-slate-100 border border-slate-200 font-semibold">
          {evidence.type}
        </span>
      </div>
    </div>
  );
};
