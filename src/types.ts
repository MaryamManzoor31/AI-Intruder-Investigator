/**
 * IncidentIQ Data Types
 * Evidence-Driven Incident Investigation & Decision Support
 */

export type EvidenceType = 'video' | 'image' | 'pdf' | 'log' | 'csv' | 'text';

export interface Evidence {
  id: string;
  name: string;
  type: EvidenceType;
  size?: string;
  timestamp?: string;
  summary: string;
  url?: string;
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
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
  token?: string;
}
