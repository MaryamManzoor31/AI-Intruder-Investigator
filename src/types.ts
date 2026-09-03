/**
 * IncidentIQ Data Types
 * Evidence-Driven Incident Investigation & Decision Support
 */

export type EvidenceType = 'video' | 'image' | 'pdf' | 'log' | 'csv' | 'text';

export interface VideoFrameSample {
  timestamp: string; // e.g. "00:04"
  timeSeconds: number; // e.g. 4
  dataUrl: string; // "data:image/jpeg;base64,..."
  base64Data?: string; // raw base64 string
}

export interface Evidence {
  id: string;
  name: string;
  type: EvidenceType;
  size?: string;
  timestamp?: string;
  summary: string;
  url?: string;
  videoUrl?: string; // Direct or Object URL for browser video playback
  videoBase64?: string; // Option B: Full video base64
  videoMimeType?: string; // Option B: e.g. "video/mp4", "video/webm"
  keyframes?: VideoFrameSample[]; // Option A: Extracted video keyframes
  duration?: number; // Video duration in seconds
  previewContent?: string; // Text snippet, log sample, or SVG/base64 preview
  keyDetails?: string[];
  uploadedAt: string;
}

export interface TimelineEvent {
  id: string;
  timestamp: string; // e.g. "10:41:02"
  timeSeconds: number; // Video scrub position in seconds (e.g. 12s)
  description: string;
  source: string; // e.g. "CCTV Camera 01", "Access Log"
  evidenceId: string;
  confidence?: number;
  flag?: 'neutral' | 'suspicious' | 'critical' | 'cleared';
}

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';
export type CaseStatus = 'NEW' | 'INVESTIGATING' | 'AWAITING_REVIEW' | 'VERIFIED' | 'CLOSED';

export interface Assessment {
  finding: string;
  risk: RiskLevel;
  confidence: number; // 0-99 (never 100%)
  confidenceLabel: string; // e.g. "Medium confidence"
  status: CaseStatus;
  summary: string;
  supportingEvidence: string[];
  contradictoryOrMissing: string[];
  timestamp: string;
}

export type UncertaintyPriority = 'LOW' | 'MEDIUM' | 'HIGH';
export type InvestigationToolName = 
  | 'query_event_logs' 
  | 'search_case_evidence' 
  | 'extract_relevant_frames' 
  | 'find_related_incidents';

export interface Uncertainty {
  id: string;
  title: string;
  priority: UncertaintyPriority;
  reason: string;
  recommendedAction: string;
  tool: InvestigationToolName;
  status: 'OPEN' | 'INVESTIGATING' | 'RESOLVED';
}

export interface ToolResult {
  title: string;
  summary: string;
  data: Record<string, any> | Array<Record<string, any>> | string;
  evidenceGenerated?: Evidence;
}

export interface InvestigationStep {
  id: string;
  stepNumber: number; // 1 to 4
  toolName: InvestigationToolName;
  toolLabel: string;
  description: string;
  startedAt: string;
  completedAt?: string;
  toolInput: Record<string, any>;
  toolResult?: ToolResult;
  explanation: string;
}

export interface ReassessmentChange {
  occurred: boolean;
  previousFinding: string;
  previousRisk: RiskLevel;
  previousConfidence: number;
  newFinding: string;
  newRisk: RiskLevel;
  newConfidence: number;
  reason: string;
  triggerEvidenceId?: string;
  triggerEvidenceName?: string;
}

export type VerificationResult = 
  | 'SUPPORTED' 
  | 'PARTIALLY SUPPORTED' 
  | 'INSUFFICIENT EVIDENCE' 
  | 'CONTRADICTED';

export interface VerificationChecklist {
  supportingEvidenceFound: boolean;
  timelineConsistent: boolean;
  newEvidenceChecked: boolean;
  contradictoryChecked: boolean;
  evidenceSufficient: boolean;
  result: VerificationResult;
  explanation: string;
  verifiedBy?: string;
  verifiedAt?: string;
}

export type FeedbackRating = 'correct' | 'partially_correct' | 'incorrect';

export interface HumanFeedback {
  rating: FeedbackRating;
  correctionAreas?: string[];
  notes?: string;
  submittedAt: string;
  investigator: string;
}

export interface LearningRecord {
  id: string;
  caseId: string;
  uncertaintyType: string;
  pastSuccessfulAction: string;
  learnedStrategy: string;
  outcome: string;
  impact: string;
  createdAt: string;
}

export type DetectionCategory = 
  | 'person' 
  | 'unidentified_object' 
  | 'vehicle' 
  | 'access_terminal' 
  | 'tool_equipment' 
  | 'door_portal';

export type ThreatStatus = 'CLEAR' | 'SUSPICIOUS' | 'ANOMALOUS' | 'RESTRICTED';

export interface DetectedEntity {
  id: string;
  trackId: string; // e.g. "TRK-0842"
  label: string; // e.g. "Person (Suspicious Movement)" or "Unidentified Object"
  category: DetectionCategory;
  confidence: number; // 0-99
  threatStatus: ThreatStatus;
  timestamp: string; // "10:41:18" or "00:15"
  timeSeconds: number; // For scrub synchronization
  // Normalized bounding box [top, left, width, height] in percentages (0 to 100)
  box: {
    top: number;
    left: number;
    width: number;
    height: number;
  };
  attributes?: string[];
  behaviorFlags?: string[];
  notes?: string;
  isSuspicious?: boolean;
}

export interface ActivityLogItem {
  id: string;
  timestamp: string;
  action: string;
  detail: string;
  type: 'upload' | 'ai_analysis' | 'timeline' | 'uncertainty' | 'tool_call' | 'reassessment' | 'verification' | 'feedback';
}

export interface CaseMemory {
  caseId: string;
  title: string;
  uncertainty: string;
  successfulAction: string;
  outcome: string;
}

export interface InvestigationCase {
  id: string;
  title: string;
  description: string;
  investigator: string;
  status: CaseStatus;
  risk: RiskLevel;
  createdAt: string;
  lastUpdated: string;
  evidence: Evidence[];
  timeline: TimelineEvent[];
  currentAssessment: Assessment;
  assessmentHistory: Assessment[];
  uncertainties: Uncertainty[];
  investigationSteps: InvestigationStep[];
  assessmentChange?: ReassessmentChange;
  verification?: VerificationChecklist;
  feedback?: HumanFeedback;
  activityLog: ActivityLogItem[];
  learningRecord?: LearningRecord;
  similarCases?: CaseMemory[];
  detectedEntities?: DetectedEntity[];
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
  token?: string;
}
