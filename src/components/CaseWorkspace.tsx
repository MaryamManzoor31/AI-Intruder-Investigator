import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldAlert, 
  RotateCcw, 
  PlayCircle, 
  Plus, 
  ArrowLeft, 
  ShieldCheck, 
  Clock, 
  FileText, 
  Activity, 
  AlertTriangle,
  FolderOpen,
  Sparkles,
  Video,
  Loader2,
  Upload
} from 'lucide-react';
import { InvestigationCase, Evidence, TimelineEvent, InvestigationToolName, FeedbackRating, LearningRecord, EvidenceType } from '../types';
import { extractKeyframesFromVideo, fileToBase64 } from '../utils/videoProcessor';
import { VideoPlayer } from './VideoPlayer';
import { EvidenceTimeline } from './EvidenceTimeline';
import { EvidenceCard } from './EvidenceCard';
import { EvidenceViewerModal } from './EvidenceViewerModal';
import { AssessmentPanel } from './AssessmentPanel';
import { UncertaintyCard } from './UncertaintyCard';
import { AIActivityFeed } from './AIActivityFeed';
import { VerificationModal } from './VerificationModal';
import { FeedbackModal } from './FeedbackModal';
import { CaseReplayModal } from './CaseReplayModal';

interface CaseWorkspaceProps {
  caseId: string;
  onBack: () => void;
  onRefreshCases: () => void;
}

export const CaseWorkspace: React.FC<CaseWorkspaceProps> = ({
  caseId,
  onBack,
  onRefreshCases
}) => {
  const [caseData, setCaseData] = useState<InvestigationCase | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'evidence' | 'timeline' | 'activity'>('evidence');
  
  // Video scrubber state
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [selectedCamera, setSelectedCamera] = useState<string>('warehouse_camera.mp4');

  // Modals state
  const [selectedEvidence, setSelectedEvidence] = useState<Evidence | null>(null);
  const [showVerificationModal, setShowVerificationModal] = useState<boolean>(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState<boolean>(false);
  const [showReplayModal, setShowReplayModal] = useState<boolean>(false);

  // Tool execution state
  const [isInvestigating, setIsInvestigating] = useState<boolean>(false);
  const [isUploadingMedia, setIsUploadingMedia] = useState<boolean>(false);
  const [uploadStatusMsg, setUploadStatusMsg] = useState<string>('');
  const uploadFileInputRef = useRef<HTMLInputElement | null>(null);

  const handleCustomMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !caseData) return;

    setIsUploadingMedia(true);
    try {
      const fileList = Array.from(files) as File[];
      for (const file of fileList) {
        const ext = file.name.split('.').pop()?.toLowerCase() || '';
        let type: EvidenceType = 'text';
        if (['mp4', 'mov', 'webm', 'avi'].includes(ext)) type = 'video';
        else if (['jpg', 'jpeg', 'png', 'webp'].includes(ext)) type = 'image';
        else if (['pdf'].includes(ext)) type = 'pdf';
        else if (['csv'].includes(ext)) type = 'csv';
        else if (['log', 'txt', 'json'].includes(ext)) type = 'log';

        let keyframes: any[] = [];
        let duration = 0;
        let videoBase64: string | undefined = undefined;
        let videoUrl: string | undefined = undefined;

        if (type === 'video') {
          setUploadStatusMsg(`Sampling keyframes for AI detection camera...`);
          videoUrl = URL.createObjectURL(file);
          try {
            const extraction = await extractKeyframesFromVideo(file, 4);
            keyframes = extraction.keyframes;
            duration = Math.round(extraction.duration);
          } catch (err) {
            console.warn('Keyframe extraction warning:', err);
          }

          if (file.size <= 3 * 1024 * 1024) {
            try {
              videoBase64 = await fileToBase64(file);
            } catch (err) {}
          }
        }

        setUploadStatusMsg(`Uploading "${file.name}" to case...`);
        await fetch(`/api/cases/${caseData.id}/evidence`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: file.name,
            type,
            size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
            summary: `Custom uploaded ${type} asset: ${file.name}.`,
            videoUrl,
            videoBase64,
            videoMimeType: file.type || 'video/mp4',
            keyframes,
            duration,
            keyDetails: [
              duration ? `Video duration: ${duration}s` : 'Custom evidence',
              keyframes.length ? `${keyframes.length} keyframes extracted (Option A)` : 'Custom asset',
              videoBase64 ? 'Direct video stream attached (Option B)' : 'Analyzed by Gemini'
            ]
          })
        });

        if (type === 'video') {
          setSelectedCamera(file.name);
        }
      }

      setUploadStatusMsg('Running unconstrained multimodal Gemini analysis on video...');
      const analyzeRes = await fetch(`/api/cases/${caseData.id}/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const analyzeData = await analyzeRes.json();
      if (analyzeData.case) {
        setCaseData(analyzeData.case);
      } else {
        await fetchCase();
      }
      setCurrentTime(0);
      onRefreshCases();
    } catch (err) {
      console.error('Custom video upload error:', err);
    } finally {
      setIsUploadingMedia(false);
      setUploadStatusMsg('');
      if (uploadFileInputRef.current) uploadFileInputRef.current.value = '';
    }
  };

  // Fetch case details
  const fetchCase = async () => {
    try {
      const res = await fetch(`/api/cases/${caseId}`);
      if (!res.ok) throw new Error('Failed to load case');
      const data = await res.json();
      setCaseData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCase();
  }, [caseId]);

  // Execute investigation tool
  const handleExecuteTool = async (toolName: InvestigationToolName) => {
    if (!caseData) return;
    setIsInvestigating(true);

    try {
      const res = await fetch(`/api/cases/${caseData.id}/investigate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toolName,
          uncertaintyId: caseData.uncertainties[0]?.id
        })
      });

      if (!res.ok) {
        const errJson = await res.json();
        alert(errJson.error || 'Investigation step failed');
        return;
      }

      const data = await res.json();
      setCaseData(data.case);
      onRefreshCases();
    } catch (err) {
      console.error(err);
    } finally {
      setIsInvestigating(false);
    }
  };

  // Confirm verification
  const handleConfirmVerification = async () => {
    if (!caseData) return;
    try {
      const res = await fetch(`/api/cases/${caseData.id}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          investigator: caseData.investigator
        })
      });
      const data = await res.json();
      setCaseData(data.case);
      setShowVerificationModal(false);
      setShowFeedbackModal(true); // Proceed to investigator feedback
      onRefreshCases();
    } catch (err) {
      console.error(err);
    }
  };

  // Submit Feedback
  const handleSubmitFeedback = async (feedbackPayload: {
    rating: FeedbackRating;
    correctionAreas?: string[];
    notes?: string;
  }): Promise<LearningRecord | void> => {
    if (!caseData) return;
    try {
      const res = await fetch(`/api/cases/${caseData.id}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(feedbackPayload)
      });
      const data = await res.json();
      setCaseData(data.case);
      onRefreshCases();
      return data.learningRecord;
    } catch (err) {
      console.error(err);
    }
  };

  // Reset Demo
  const handleResetDemo = async () => {
    try {
      const res = await fetch('/api/cases/reset-demo', { method: 'POST' });
      const data = await res.json();
      if (caseId === 'CASE-2026-001') {
        setCaseData(data.case);
      } else {
        await fetchCase();
      }
      setCurrentTime(0);
      onRefreshCases();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-cyan-500 border-t-transparent animate-spin" />
          <p className="text-xs font-mono text-slate-400">Loading investigation workspace...</p>
        </div>
      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="p-8 text-center space-y-3">
        <p className="text-sm text-slate-300">Case not found.</p>
        <button
          onClick={onBack}
          className="text-xs text-cyan-400 hover:underline"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const isResolved = caseData.assessmentChange?.occurred || false;
  const isVerified = Boolean(caseData.verification);

  return (
    <div id="case-investigation-workspace" className="p-4 sm:p-6 space-y-5 max-w-7xl mx-auto">
      {/* CASE HEADER */}
      <div className="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div>
          {/* Back button & Case ID */}
          <div className="flex items-center gap-3 mb-1.5">
            <button
              onClick={onBack}
              className="text-slate-500 hover:text-slate-900 flex items-center gap-1 text-xs transition-colors cursor-pointer font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </button>
            <span className="text-slate-300">•</span>
            <span className="font-mono text-xs font-bold text-cyan-800">{caseData.id}</span>
            <span className="text-slate-300">•</span>
            <span className="text-xs text-slate-500 font-mono">Lead: {caseData.investigator}</span>
          </div>

          {/* Title */}
          <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
            {caseData.title}
          </h1>
        </div>

        {/* Header Right Actions */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          {/* Status Badge */}
          <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
            <span className={`w-2 h-2 rounded-full ${
              isVerified 
                ? 'bg-emerald-500 shadow-xs shadow-emerald-500/50' 
                : caseData.status === 'INVESTIGATING' 
                ? 'bg-cyan-600 animate-pulse shadow-xs shadow-cyan-500/50' 
                : 'bg-amber-500 shadow-xs shadow-amber-500/50'
            }`} />
            <span className="text-xs font-mono font-semibold text-slate-800">
              {isVerified ? "STATUS: VERIFIED" : `STATUS: ${caseData.status}`}
            </span>
          </div>

          {/* Case Replay Button */}
          <button
            id="open-case-replay-btn"
            onClick={() => setShowReplayModal(true)}
            className="px-3.5 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 rounded-xl border border-slate-200 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <PlayCircle className="w-3.5 h-3.5 text-cyan-700" />
            <span>Case Replay</span>
          </button>

          {/* Reset Demo State Button */}
          <button
            id="reset-demo-case-btn"
            onClick={handleResetDemo}
            className="px-3.5 py-1.5 text-xs font-medium text-slate-600 hover:text-cyan-800 bg-white hover:bg-slate-50 rounded-xl border border-slate-200 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
            title="Reset to initial state to demonstrate the investigation loop again"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset Demo</span>
          </button>
        </div>
      </div>

      {/* MAIN TWO-COLUMN WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* LEFT COLUMN — EVIDENCE (col-span-7) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Navigation Tabs for Evidence Section */}
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setActiveTab('evidence')}
                className={`text-xs pb-1 cursor-pointer transition-colors ${
                  activeTab === 'evidence'
                    ? 'text-cyan-800 border-b-2 border-cyan-600 font-bold'
                    : 'text-slate-500 hover:text-slate-800 font-medium'
                }`}
              >
                Evidence ({caseData.evidence.length})
              </button>

              <button
                onClick={() => setActiveTab('timeline')}
                className={`text-xs pb-1 cursor-pointer transition-colors ${
                  activeTab === 'timeline'
                    ? 'text-cyan-800 border-b-2 border-cyan-600 font-bold'
                    : 'text-slate-500 hover:text-slate-800 font-medium'
                }`}
              >
                Timeline ({caseData.timeline.length})
              </button>

              <button
                onClick={() => setActiveTab('activity')}
                className={`text-xs pb-1 cursor-pointer transition-colors ${
                  activeTab === 'activity'
                    ? 'text-cyan-800 border-b-2 border-cyan-600 font-bold'
                    : 'text-slate-500 hover:text-slate-800 font-medium'
                }`}
              >
                Activity Feed ({caseData.activityLog.length})
              </button>
            </div>

            <span className="text-[11px] font-mono text-slate-500">
              Multimodal Synchronized
            </span>
          </div>

          {/* Primary CCTV Video Player */}
          <VideoPlayer
            timelineEvents={caseData.timeline}
            currentTime={currentTime}
            onSeek={(t) => setCurrentTime(t)}
            activeCamera={selectedCamera}
            onSelectCamera={(cam) => setSelectedCamera(cam)}
            caseEvidence={caseData.evidence}
          />

          {/* Horizontal Interactive Evidence Timeline */}
          <EvidenceTimeline
            events={caseData.timeline}
            currentTime={currentTime}
            onSelectEvent={(event) => {
              setCurrentTime(event.timeSeconds);
              const found = caseData.evidence.find(e => e.id === event.evidenceId);
              if (found) {
                if (found.type === 'video') {
                  setSelectedCamera(found.name);
                } else {
                  setSelectedEvidence(found);
                }
              }
            }}
            onViewEvidence={(evId) => {
              const ev = caseData.evidence.find(e => e.id === evId);
              if (ev) setSelectedEvidence(ev);
            }}
          />

          {/* Evidence Cards Stack */}
          <div className="mt-5 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Attached Evidence Artifacts ({caseData.evidence.length})
                </h3>
                <span className="text-[11px] text-slate-500 font-mono">Chain-of-Custody Protected</span>
              </div>

              {/* Direct Video / Evidence Upload Action */}
              <div className="flex items-center gap-2">
                <input
                  ref={uploadFileInputRef}
                  type="file"
                  multiple
                  accept=".mp4,.mov,.webm,.jpg,.jpeg,.png,.pdf,.csv,.json,.log,.txt"
                  onChange={handleCustomMediaUpload}
                  className="hidden"
                />
                <button
                  id="workspace-upload-video-btn"
                  onClick={() => uploadFileInputRef.current?.click()}
                  disabled={isUploadingMedia}
                  className="px-3 py-1.5 rounded-xl bg-cyan-50 hover:bg-cyan-100 text-cyan-800 border border-cyan-200 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer disabled:opacity-50"
                  title="Upload custom video footage or log artifacts for multimodal Gemini analysis"
                >
                  {isUploadingMedia ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-700" />
                      <span className="text-[11px] font-mono">{uploadStatusMsg || 'Processing...'}</span>
                    </>
                  ) : (
                    <>
                      <Video className="w-3.5 h-3.5 text-cyan-700" />
                      <span>Upload Video / Artifact</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Media Upload Progress Banner */}
            {isUploadingMedia && (
              <div className="p-3 bg-cyan-50 border border-cyan-200 rounded-2xl flex items-center gap-3 text-xs text-cyan-900 animate-pulse font-mono">
                <Loader2 className="w-4 h-4 animate-spin text-cyan-600 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-bold">Multimodal Ingestion Active</p>
                  <p className="text-[11px] text-cyan-700 truncate">{uploadStatusMsg}</p>
                </div>
              </div>
            )}

            <div className="space-y-2.5">
              {caseData.evidence.map((item) => {
                const isNew = item.id === caseData.assessmentChange?.triggerEvidenceId;
                return (
                  <EvidenceCard
                    key={item.id}
                    evidence={item}
                    isNew={isNew}
                    onView={(ev) => {
                      if (ev.type === 'video') {
                        setSelectedCamera(ev.name);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      } else {
                        setSelectedEvidence(ev);
                      }
                    }}
                  />
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN — WHAT WE FOUND & INVESTIGATION DECISIONS (col-span-5) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Assessment & What We Found Panel */}
          <AssessmentPanel
            assessment={caseData.currentAssessment}
            assessmentChange={caseData.assessmentChange}
            onViewTriggerEvidence={(evId) => {
              const found = caseData.evidence.find(e => e.id === evId);
              if (found) setSelectedEvidence(found);
            }}
            onOpenVerification={() => setShowVerificationModal(true)}
            isVerified={isVerified}
          />

          {/* Uncertainty Card (The Core Intelligence & Action Feature) */}
          <UncertaintyCard
            uncertainty={caseData.uncertainties[0]}
            onExecuteTool={handleExecuteTool}
            isInvestigating={isInvestigating}
            isResolved={isResolved}
            stepCount={caseData.investigationSteps.length}
          />

          {/* AI Investigation Activity Feed */}
          <AIActivityFeed
            activities={caseData.activityLog}
            isInvestigating={isInvestigating}
          />
        </div>
      </div>

      {/* MODALS */}
      {/* Evidence Viewer Modal */}
      <EvidenceViewerModal
        evidence={selectedEvidence}
        onClose={() => setSelectedEvidence(null)}
      />

      {/* Human Verification Modal */}
      <VerificationModal
        isOpen={showVerificationModal}
        onClose={() => setShowVerificationModal(false)}
        onConfirm={handleConfirmVerification}
        verification={caseData.verification}
        onReviewEvidence={() => {
          setShowVerificationModal(false);
          if (caseData.evidence.length > 0) {
            setSelectedEvidence(caseData.evidence[0]);
          }
        }}
      />

      {/* Human Feedback Modal */}
      <FeedbackModal
        isOpen={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
        onSubmit={handleSubmitFeedback}
      />

      {/* Case Replay Modal */}
      <CaseReplayModal
        isOpen={showReplayModal}
        onClose={() => setShowReplayModal(false)}
      />
    </div>
  );
};
