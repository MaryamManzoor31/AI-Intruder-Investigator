import React from 'react';
import { X, FileText, HardDrive, Clock, CheckCircle2, Download } from 'lucide-react';
import { Evidence } from '../types';

interface EvidenceViewerModalProps {
  evidence: Evidence | null;
  onClose: () => void;
}

export const EvidenceViewerModal: React.FC<EvidenceViewerModalProps> = ({
  evidence,
  onClose
}) => {
  if (!evidence) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4">
      <div 
        id="evidence-viewer-modal" 
        className="w-full max-w-2xl bg-white/95 backdrop-blur-2xl border border-slate-200 rounded-3xl shadow-xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-800">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 font-mono">{evidence.name}</h3>
              <p className="text-xs text-slate-500">Type: {evidence.type.toUpperCase()} • Uploaded: {evidence.uploadedAt}</p>
            </div>
          </div>
          <button
            id="close-evidence-modal-btn"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Summary */}
          <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Overview</h4>
            <p className="text-sm text-slate-800 leading-relaxed bg-slate-50/80 p-4 rounded-2xl border border-slate-200 shadow-2xs">
              {evidence.summary}
            </p>
          </div>

          {/* Key Details extracted by Gemini */}
          {evidence.keyDetails && evidence.keyDetails.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Key Extracted Details</h4>
              <div className="space-y-1.5">
                {evidence.keyDetails.map((detail, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-800 font-medium bg-slate-50/80 p-3 rounded-xl border border-slate-200 shadow-2xs">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-700 shrink-0 mt-0.5" />
                    <span>{detail}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Preview or Raw Content */}
          {evidence.previewContent && (
            <div>
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Evidence Content / Raw Payload</h4>
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 font-mono text-xs text-cyan-300 overflow-x-auto whitespace-pre leading-relaxed max-h-60 shadow-inner">
                {evidence.previewContent}
              </div>
            </div>
          )}

          {/* Metadata Footer bar inside modal */}
          <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-200">
            <div className="flex items-center gap-4 font-mono text-[11px]">
              {evidence.timestamp && (
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{evidence.timestamp}</span>
                </span>
              )}
              {evidence.size && (
                <span className="flex items-center gap-1.5">
                  <HardDrive className="w-3.5 h-3.5 text-slate-400" />
                  <span>{evidence.size}</span>
                </span>
              )}
            </div>
            <span className="text-[11px] font-mono text-emerald-800 bg-emerald-50 border border-emerald-200 font-semibold px-2.5 py-0.5 rounded-lg">
              Verified Chain of Custody
            </span>
          </div>
        </div>

        {/* Action Button */}
        <div className="p-4 sm:p-5 bg-slate-50/80 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 rounded-xl transition-all cursor-pointer shadow-2xs"
          >
            Close Viewer
          </button>
        </div>
      </div>
    </div>
  );
};
