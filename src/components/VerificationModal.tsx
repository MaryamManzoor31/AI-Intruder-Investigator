import React, { useState } from 'react';
import { X, ShieldCheck, Check, AlertCircle, ArrowRight } from 'lucide-react';
import { VerificationChecklist } from '../types';

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  verification?: VerificationChecklist;
  onReviewEvidence: () => void;
}

export const VerificationModal: React.FC<VerificationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  verification,
  onReviewEvidence
}) => {
  if (!isOpen) return null;

  const defaultChecklist: VerificationChecklist = verification || {
    supportingEvidenceFound: true,
    timelineConsistent: true,
    newEvidenceChecked: true,
    contradictoryChecked: true,
    evidenceSufficient: true,
    result: 'PARTIALLY SUPPORTED',
    explanation: 'The evidence confirms Person A entered the restricted area, but authoritative badge records show the access was authenticated with an active work permit. It does not prove unauthorized access.'
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4">
      <div 
        id="verification-modal"
        className="w-full max-w-xl bg-white/95 backdrop-blur-2xl border border-slate-200 rounded-3xl shadow-xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-800">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Verify What We Found</h3>
              <p className="text-xs text-slate-500">Human-in-the-Loop Investigation Verification</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Verification Checklist */}
        <div className="p-6 space-y-5">
          <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">
              Verification Checklist
            </h4>
            <div className="space-y-2">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/80 border border-slate-200 text-xs text-slate-800 font-medium shadow-2xs">
                <span className="w-5 h-5 rounded-lg bg-cyan-100 text-cyan-800 flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </span>
                <span>Supporting evidence found and correlated with CCTV timecode</span>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/80 border border-slate-200 text-xs text-slate-800 font-medium shadow-2xs">
                <span className="w-5 h-5 rounded-lg bg-cyan-100 text-cyan-800 flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </span>
                <span>Timeline sequence is consistent across physical & digital sensors</span>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/80 border border-slate-200 text-xs text-slate-800 font-medium shadow-2xs">
                <span className="w-5 h-5 rounded-lg bg-cyan-100 text-cyan-800 flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </span>
                <span>New evidence retrieved via access-control verification tools</span>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/80 border border-slate-200 text-xs text-slate-800 font-medium shadow-2xs">
                <span className="w-5 h-5 rounded-lg bg-cyan-100 text-cyan-800 flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </span>
                <span>Contradictory evidence weighed against initial supervisor dispatch</span>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/80 border border-slate-200 text-xs text-slate-800 font-medium shadow-2xs">
                <span className="w-5 h-5 rounded-lg bg-cyan-100 text-cyan-800 flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </span>
                <span>Evidence is sufficient for this conclusion</span>
              </div>
            </div>
          </div>

          {/* Verification Result Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-cyan-50/90 border border-cyan-200 shadow-2xs">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-900">
                Verification Result
              </span>
              <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold font-mono bg-cyan-100 text-cyan-800 border border-cyan-200">
                {defaultChecklist.result}
              </span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed mt-2">
              {defaultChecklist.explanation}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 sm:p-5 bg-slate-50/80 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={() => {
              onClose();
              onReviewEvidence();
            }}
            className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 rounded-xl transition-all border border-slate-200 cursor-pointer shadow-xs"
          >
            Review Evidence
          </button>

          <button
            id="confirm-assessment-btn"
            onClick={onConfirm}
            className="px-5 py-2 text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <span>Confirm Assessment</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
