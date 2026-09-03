import React, { useState } from 'react';
import { X, Check, AlertTriangle, AlertOctagon, BrainCircuit, ArrowRight } from 'lucide-react';
import { FeedbackRating, LearningRecord } from '../types';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { rating: FeedbackRating; correctionAreas?: string[]; notes?: string }) => Promise<LearningRecord | void>;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const [rating, setRating] = useState<FeedbackRating>('correct');
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [notes, setNotes] = useState<string>('');
  const [submittedLearning, setSubmittedLearning] = useState<LearningRecord | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isOpen) return null;

  const correctionOptions = [
    'Classification',
    'Timeline',
    'Missed evidence',
    'Severity',
    'Recommendation',
    'Other'
  ];

  const toggleArea = (area: string) => {
    setSelectedAreas(prev => 
      prev.includes(area) ? prev.filter(a => a !== area) : [...prev, area]
    );
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const result = await onSubmit({
        rating,
        correctionAreas: selectedAreas,
        notes: notes || undefined
      });
      if (result) {
        setSubmittedLearning(result);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4">
      <div 
        id="feedback-modal"
        className="w-full max-w-lg bg-white/95 backdrop-blur-2xl border border-slate-200 rounded-3xl shadow-xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-800">
              <BrainCircuit className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                {submittedLearning ? "Investigation Learning Updated" : "Does this assessment look correct?"}
              </h3>
              <p className="text-xs text-slate-500">
                {submittedLearning ? "System Adaptation Recorded" : "Human Investigator Feedback"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Learning Confirmation Screen (if already submitted) */}
        {submittedLearning ? (
          <div className="p-6 space-y-4 text-center">
            <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-700 shadow-2xs">
              <Check className="w-7 h-7" />
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-900 mb-1">
                Your feedback has been recorded.
              </h4>
              <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                IncidentIQ will use this feedback to improve how it handles similar investigations in the future.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left text-xs space-y-2 mt-4 shadow-2xs">
              <div className="text-[11px] font-mono text-cyan-800 font-bold uppercase">
                Learned Investigation Strategy
              </div>
              <p className="text-slate-800">
                {submittedLearning.learnedStrategy}
              </p>
              <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-500">
                Impact: {submittedLearning.impact}
              </div>
            </div>

            <div className="pt-4">
              <button
                id="close-learning-success-btn"
                onClick={onClose}
                className="w-full py-2.5 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition-all cursor-pointer shadow-xs"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          /* Rating Screen */
          <div className="p-6 space-y-5">
            {/* 3 Large Choice Buttons */}
            <div className="grid grid-cols-3 gap-3">
              <button
                id="rating-correct-btn"
                onClick={() => setRating('correct')}
                className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs ${
                  rating === 'correct'
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900 ring-1 ring-emerald-300'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
                  <Check className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold">Correct</span>
              </button>

              <button
                id="rating-partially-correct-btn"
                onClick={() => setRating('partially_correct')}
                className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs ${
                  rating === 'partially_correct'
                    ? 'bg-amber-50 border-amber-300 text-amber-900 ring-1 ring-amber-300'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-700">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold">Partially Correct</span>
              </button>

              <button
                id="rating-incorrect-btn"
                onClick={() => setRating('incorrect')}
                className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs ${
                  rating === 'incorrect'
                    ? 'bg-rose-50 border-rose-300 text-rose-900 ring-1 ring-rose-300'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-700">
                  <AlertOctagon className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold">Incorrect</span>
              </button>
            </div>

            {/* Areas to correct if partially or incorrect */}
            {rating !== 'correct' && (
              <div className="space-y-2 animate-in fade-in duration-200">
                <label className="text-xs font-bold text-slate-700">
                  What needs to be corrected?
                </label>
                <div className="flex flex-wrap gap-2">
                  {correctionOptions.map(option => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => toggleArea(option)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer shadow-2xs ${
                        selectedAreas.includes(option)
                          ? 'bg-cyan-50 border-cyan-300 text-cyan-900'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Investigator optional comments */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">
                Investigator Notes (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any additional observations or procedural nuances..."
                className="w-full h-20 bg-white border border-slate-200 rounded-2xl p-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-200 shadow-2xs"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                id="submit-feedback-btn"
                disabled={isSubmitting}
                onClick={handleSubmit}
                className="w-full py-2.5 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <span>Submit Feedback</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
