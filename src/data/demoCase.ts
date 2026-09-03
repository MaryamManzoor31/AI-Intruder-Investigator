import { InvestigationCase } from '../types';

export const INITIAL_DEMO_CASE: InvestigationCase = {
  id: 'CASE-2026-001',
  title: 'Warehouse Restricted Area Incident',
  description: 'Unidentified individual observed entering Secure Bay 4 at North Warehouse during off-peak logistics window.',
  investigator: 'Investigator Sarah Vance',
  status: 'INVESTIGATING',
  risk: 'HIGH',
  createdAt: '2026-09-02T10:40:00Z',
  lastUpdated: '2 minutes ago',
  evidence: [
    {
      id: 'ev-01',
      name: 'warehouse_camera.mp4',
      type: 'video',
      size: '24.2 MB',
      timestamp: '10:41:00 - 10:42:30',
      summary: 'High-definition CCTV clip capturing Secure Bay 4 corridor and interior entryway.',
      url: '/assets/warehouse_camera.mp4',
      keyDetails: [
        'Camera ID: CAM-WH-04 (Restricted Bay)',
        'Resolution: 1080p @ 30fps',
        'Person A observed in dark maintenance attire carrying diagnostic equipment',
        'Door opened at 10:41:18, entered 10:41:34, departed 10:42:10'
      ],
      uploadedAt: '10:40:52'
    },
    {
      id: 'ev-02',
      name: 'entrance_camera.mp4',
      type: 'video',
      size: '18.6 MB',
      timestamp: '10:40:30 - 10:41:45',
      summary: 'Perimeter turnstile angle showing arrival and door contact.',
      url: '/assets/entrance_camera.mp4',
      keyDetails: [
        'Camera ID: CAM-EXT-02 (North Turnstile)',
        'Shows individual interacting with reader panel at 10:41:14',
        'Turnstile green indicator pulsed once'
      ],
      uploadedAt: '10:40:54'
    },
    {
      id: 'ev-03',
      name: 'access_log.csv',
      type: 'csv',
      size: '124 KB',
      timestamp: '10:30:00 - 10:50:00',
      summary: 'Initial raw door sensor telemetry without badge identity resolution.',
      previewContent: `Timestamp,DoorID,SensorState,AlertFlag
10:41:14,DOOR-WH-N04,RFID_PULSE,NORMAL
10:41:18,DOOR-WH-N04,CONTACT_OPEN,INFO
10:41:34,ZONE-BAY4-PIR,MOTION_DETECTED,ALERT_RESTRICTED
10:42:10,DOOR-WH-N04,CONTACT_CLOSED,INFO`,
      keyDetails: [
        'RFID pulse registered 4 seconds prior to door opening',
        'Zone PIR sensor triggered restricted alert due to off-hours schedule'
      ],
      uploadedAt: '10:40:58'
    },
    {
      id: 'ev-04',
      name: 'security_report.pdf',
      type: 'pdf',
      size: '1.4 MB',
      timestamp: '10:43:00',
      summary: 'Shift supervisor dispatch note reporting off-hours alarm.',
      previewContent: `INCIDENT PRELIMINARY DISPATCH
Reported By: Floor Supervisor M. Chen
Location: Warehouse North - Bay 4 (Level 2 Secure)
Observation: Alarm tripped by motion sensor in Zone B. Person on camera not recognized by dispatch team on duty.
Action Taken: Incident flagged for AI investigation workstation.`,
      keyDetails: [
        'Initial report assumes unauthorized entry due to unrecognized personnel',
        'No physical damage or forced entry reported'
      ],
      uploadedAt: '10:41:01'
    },
    {
      id: 'ev-05',
      name: 'entrance_photo.jpg',
      type: 'image',
      size: '3.8 MB',
      timestamp: '10:41:15',
      summary: 'High-resolution still frame of the biometric reader and access handle.',
      keyDetails: [
        'Card proximity reader illuminated cyan',
        'Physical lock mechanism intact'
      ],
      uploadedAt: '10:41:03'
    }
  ],
  timeline: [
    {
      id: 'tl-1',
      timestamp: '10:41:02',
      timeSeconds: 2,
      description: 'Person A approaches the warehouse exterior entrance corridor.',
      source: 'CCTV Camera 01',
      evidenceId: 'ev-01',
      confidence: 94,
      flag: 'neutral'
    },
    {
      id: 'tl-2',
      timestamp: '10:41:14',
      timeSeconds: 14,
      description: 'RFID reader interface contact observed at turnstile.',
      source: 'Entrance Camera',
      evidenceId: 'ev-02',
      confidence: 88,
      flag: 'neutral'
    },
    {
      id: 'tl-3',
      timestamp: '10:41:18',
      timeSeconds: 18,
      description: 'Bay 4 secure access door magnetic lock disengaged.',
      source: 'Access Log CSV',
      evidenceId: 'ev-03',
      confidence: 96,
      flag: 'suspicious'
    },
    {
      id: 'tl-4',
      timestamp: '10:41:34',
      timeSeconds: 34,
      description: 'Person A enters restricted bay interior with diagnostic case.',
      source: 'CCTV Camera 01',
      evidenceId: 'ev-01',
      confidence: 95,
      flag: 'critical'
    },
    {
      id: 'tl-5',
      timestamp: '10:42:10',
      timeSeconds: 70,
      description: 'Person A exits Bay 4; door magnetic contact secures.',
      source: 'CCTV Camera 01',
      evidenceId: 'ev-01',
      confidence: 93,
      flag: 'neutral'
    }
  ],
  currentAssessment: {
    finding: 'Possible unauthorized access to restricted warehouse area.',
    risk: 'HIGH',
    confidence: 78,
    confidenceLabel: 'Medium confidence',
    status: 'INVESTIGATING',
    summary: 'Video confirms Person A entered the restricted warehouse bay at 10:41:34. However, available evidence cannot yet verify whether this individual was authorized to enter.',
    supportingEvidence: [
      'CCTV Camera 01 confirms individual entering restricted Bay 4 at 10:41:34',
      'PIR motion alarm tripped during off-hours scheduled lockout',
      'Shift supervisor preliminary report flagged unknown individual'
    ],
    contradictoryOrMissing: [
      'Authorization status cannot be established from video footage alone',
      'Credential / badge owner identity is absent from preliminary telemetry',
      'No physical forced entry or door damage visible'
    ],
    timestamp: '10:41:08'
  },
  assessmentHistory: [
    {
      finding: 'Possible unauthorized access to restricted warehouse area.',
      risk: 'HIGH',
      confidence: 78,
      confidenceLabel: 'Medium confidence',
      status: 'INVESTIGATING',
      summary: 'Video confirms Person A entered the restricted warehouse bay at 10:41:34. However, available evidence cannot yet verify whether this individual was authorized to enter.',
      supportingEvidence: [
        'CCTV Camera 01 confirms individual entering restricted Bay 4 at 10:41:34',
        'PIR motion alarm tripped during off-hours scheduled lockout'
      ],
      contradictoryOrMissing: [
        'Authorization status cannot be established from video footage alone',
        'Badge verification records not yet correlated'
      ],
      timestamp: '10:41:08'
    }
  ],
  uncertainties: [
    {
      id: 'unc-1',
      title: 'Authorization status',
      priority: 'HIGH',
      reason: 'The video confirms presence in the restricted area, but authorization cannot be determined from video or basic sensor logs alone.',
      recommendedAction: 'Check access-control records.',
      tool: 'query_event_logs',
      status: 'OPEN'
    }
  ],
  investigationSteps: [],
  activityLog: [
    {
      id: 'act-1',
      timestamp: '10:40:52',
      action: 'Evidence received',
      detail: '5 multimodal evidence items uploaded (Video, CSV, PDF, Image)',
      type: 'upload'
    },
    {
      id: 'act-2',
      timestamp: '10:40:56',
      action: 'Multimodal analysis',
      detail: 'Gemini analyzed video frames, access timestamps, and supervisor report',
      type: 'ai_analysis'
    },
    {
      id: 'act-3',
      timestamp: '10:41:03',
      action: 'Timeline extracted',
      detail: '5 chronological events mapped with source citations and confidence',
      type: 'timeline'
    },
    {
      id: 'act-4',
      timestamp: '10:41:08',
      action: 'Uncertainty identified',
      detail: 'Authorization status is unconfirmed from visual evidence alone',
      type: 'uncertainty'
    }
  ],
  similarCases: [
    {
      caseId: 'CASE-2025-089',
      title: 'Loading Dock Door Breach Flag',
      uncertainty: 'Authorization status',
      successfulAction: 'Queried centralized badge event logs',
      outcome: 'Validated authorized HVAC contractor badge; closed as authorized maintenance'
    },
    {
      caseId: 'CASE-2025-064',
      title: 'Server Annex Night Access',
      uncertainty: 'Credential verification',
      successfulAction: 'Correlated secondary turnstile logs with shift roster',
      outcome: 'Identified off-shift engineer; updated access protocol'
    }
  ],
  detectedEntities: [
    {
      id: 'det-01',
      trackId: 'TRK-0842',
      label: 'Person A (Suspicious Movement)',
      category: 'person',
      confidence: 94,
      threatStatus: 'SUSPICIOUS',
      timestamp: '10:41:18',
      timeSeconds: 18,
      box: { top: 38, left: 32, width: 14, height: 44 },
      attributes: ['Dark maintenance attire', 'Hood/cap concealing face', 'Rapid pace towards portal'],
      behaviorFlags: ['Off-hours loitering', 'Tampering with card reader', 'Unscheduled access attempt'],
      notes: 'Unrecognized individual approaching Secure Bay 4 door during non-operational hours.',
      isSuspicious: true
    },
    {
      id: 'det-02',
      trackId: 'OBJ-0194',
      label: 'Unidentified Object (Carried Container)',
      category: 'unidentified_object',
      confidence: 89,
      threatStatus: 'ANOMALOUS',
      timestamp: '10:41:20',
      timeSeconds: 20,
      box: { top: 56, left: 41, width: 9, height: 14 },
      attributes: ['Heavy matte dark case', 'Non-standard latch mechanism', 'No facility asset barcode'],
      behaviorFlags: ['Unidentified object introduced to secure zone', 'Contents unverified'],
      notes: 'Cannot identify object classification from catalog. Non-standard diagnostic box with unknown contents.',
      isSuspicious: true
    },
    {
      id: 'det-03',
      trackId: 'PRT-004',
      label: 'Secure Access Portal (Bay 4)',
      category: 'door_portal',
      confidence: 97,
      threatStatus: 'RESTRICTED',
      timestamp: '10:41:18',
      timeSeconds: 18,
      box: { top: 35, left: 42, width: 16, height: 45 },
      attributes: ['Heavy steel security door', 'Magnetic interlock', 'PIR zone boundary'],
      behaviorFlags: ['Unscheduled door open cycle', 'Motion alarm tripped'],
      notes: 'Monitored perimeter barrier to restricted logistics zone.',
      isSuspicious: false
    },
    {
      id: 'det-04',
      trackId: 'TRM-012',
      label: 'Biometric Proximity Terminal',
      category: 'access_terminal',
      confidence: 93,
      threatStatus: 'CLEAR',
      timestamp: '10:41:14',
      timeSeconds: 14,
      box: { top: 52, left: 34, width: 4, height: 10 },
      attributes: ['RFID 13.56 MHz reader', 'Cyan status LED'],
      behaviorFlags: ['Pulse registered 4s before entry'],
      notes: 'Reader triggered without badge ID correlation in initial logs.',
      isSuspicious: false
    }
  ]
};

export const REASSESSED_DEMO_DATA = {
  newEvidence: {
    id: 'ev-06',
    name: 'badge_auth_record_2841.json',
    type: 'log' as const,
    size: '14.2 KB',
    timestamp: '10:41:15',
    summary: 'Central Access Server authoritative credential verification record.',
    previewContent: JSON.stringify({
      credentialId: "BADGE-2841",
      holderCategory: "Tier-2 HVAC Maintenance Contractor",
      holderOrganization: "Apex Precision Facilities",
      authorizationWindow: "10:00 - 12:00 (Emergency Work Permit #WP-9042)",
      turnstileTimestamp: "10:41:15.204",
      accessGranted: true,
      authMethod: "Dual-Frequency RFID + PIN Verified",
      readerSerial: "RDR-BAY4-N01"
    }, null, 2),
    keyDetails: [
      'Badge ID 2841 verified at 10:41:15',
      'Associated with Emergency Work Permit #WP-9042 (Air filtration maintenance)',
      'Dual-factor RFID + PIN authenticated at entrance portal'
    ],
    uploadedAt: '10:41:22'
  },
  newTimelineEvent: {
    id: 'tl-2b',
    timestamp: '10:41:15',
    timeSeconds: 15,
    description: 'Badge ID 2841 (Work Permit #WP-9042) successfully validated at access turnstile.',
    source: 'Access-Control Event Logs',
    evidenceId: 'ev-06',
    confidence: 99,
    flag: 'cleared' as const
  },
  toolResult: {
    title: 'Access-Control Event Log Retrieved',
    summary: 'Authoritative badge authentication record successfully located for Bay 4 reader at 10:41:15.',
    data: {
      badgeId: "2841",
      clearanceLevel: "Level 2 Restricted Maintenance",
      workPermit: "WP-9042",
      authStatus: "VALIDATED_AUTHORIZED",
      readerTimestamp: "10:41:15"
    }
  },
  reassessment: {
    finding: 'Unauthorized access is not confirmed.',
    risk: 'MEDIUM' as const,
    confidence: 93,
    confidenceLabel: 'High confidence',
    status: 'AWAITING_REVIEW' as const,
    summary: 'Access-control records confirm an authorized badge (ID 2841) was authenticated at the turnstile at 10:41:15 with active Work Permit #WP-9042. Physical entry was authorized, though off-hours procedure requires sign-in verification.',
    supportingEvidence: [
      'Badge ID 2841 validated at turnstile reader at 10:41:15 (Authoritative log)',
      'Active emergency work permit #WP-9042 covering 10:00 - 12:00',
      'Door opened within 3 seconds of verified credential authorization',
      'Individual observed carrying diagnostic equipment matching permit scope'
    ],
    contradictoryOrMissing: [
      'Contradicts initial supervisor report of unauthorized intruder',
      'Procedural discrepancy: Contractor failed to notify on-duty floor dispatch prior to entry'
    ],
    timestamp: '10:41:25'
  },
  assessmentChange: {
    occurred: true,
    previousFinding: 'Possible unauthorized access to restricted warehouse area.',
    previousRisk: 'HIGH' as const,
    previousConfidence: 78,
    newFinding: 'Unauthorized access is not confirmed.',
    newRisk: 'MEDIUM' as const,
    newConfidence: 93,
    reason: 'An access-control record shows an authorized badge (ID 2841) with valid Work Permit #WP-9042 was authenticated at 10:41:15, directly contradicting the initial presumption of unauthorized entry.',
    triggerEvidenceId: 'ev-06',
    triggerEvidenceName: 'badge_auth_record_2841.json'
  },
  verification: {
    supportingEvidenceFound: true,
    timelineConsistent: true,
    newEvidenceChecked: true,
    contradictoryChecked: true,
    evidenceSufficient: true,
    result: 'PARTIALLY SUPPORTED' as const,
    explanation: 'The evidence confirms that Person A entered the restricted area, but authoritative access logs prove the entry was authenticated and authorized. It does not prove unauthorized access; procedural check-in was omitted.',
    verifiedBy: 'AI Verification Engine (Supervised by Sarah Vance)',
    verifiedAt: '10:41:30'
  },
  learningRecord: {
    id: 'lr-001',
    caseId: 'CASE-2026-001',
    uncertaintyType: 'Authorization status',
    pastSuccessfulAction: 'query_event_logs',
    learnedStrategy: 'Prioritize access-control log correlation for physical perimeter entry uncertainties before escalating security posture.',
    outcome: 'Assessment corrected from High Risk (unauthorized) to Medium Risk (authorized entry, procedural gap).',
    impact: 'Avoided false alarm dispatch; saved estimated 45 minutes of security operator escalation.',
    createdAt: '10:41:40'
  }
};

export const OTHER_CASES: InvestigationCase[] = [
  {
    id: 'CASE-2026-002',
    title: 'Server Room North Cabinet Tamper Alarm',
    description: 'Vibration and proximity sensor tripped on primary rack corridor 2 at 03:12 UTC.',
    investigator: 'Investigator Alex Mercer',
    status: 'AWAITING_REVIEW',
    risk: 'MEDIUM',
    createdAt: '2026-09-02T08:15:00Z',
    lastUpdated: '18 minutes ago',
    evidence: [
      {
        id: 'ev-s1',
        name: 'server_corridor_cam.mp4',
        type: 'video',
        size: '14 MB',
        summary: 'Infrared footage showing routine cooling fan replacement.',
        uploadedAt: '08:16:00'
      },
      {
        id: 'ev-s2',
        name: 'rack_sensor_logs.txt',
        type: 'log',
        size: '42 KB',
        summary: 'Chassis accelerometer threshold spike during filter swap.',
        uploadedAt: '08:17:00'
      }
    ],
    timeline: [
      {
        id: 'tls-1',
        timestamp: '03:11:45',
        timeSeconds: 5,
        description: 'Scheduled maintenance engineer badge swipe recorded.',
        source: 'Server Access Portal',
        evidenceId: 'ev-s2',
        confidence: 97,
        flag: 'cleared'
      }
    ],
    currentAssessment: {
      finding: 'Sensor trip caused by scheduled maintenance activity.',
      risk: 'MEDIUM',
      confidence: 89,
      confidenceLabel: 'High confidence',
      status: 'AWAITING_REVIEW',
      summary: 'Vibration alerts coincide with ticket #IT-4491 for scheduled cooling manifold maintenance.',
      supportingEvidence: ['Maintenance badge swipe at 03:11:45', 'Infrared footage matches engineer uniform'],
      contradictoryOrMissing: ['Post-maintenance checklist not yet marked complete in ticketing system'],
      timestamp: '08:20:00'
    },
    assessmentHistory: [],
    uncertainties: [],
    investigationSteps: [],
    activityLog: [
      {
        id: 'acts-1',
        timestamp: '08:15:00',
        action: 'Evidence uploaded',
        detail: 'Video and accelerometer logs added',
        type: 'upload'
      }
    ]
  },
  {
    id: 'CASE-2026-003',
    title: 'Executive Office Door Forced Open Alert',
    description: 'Magnetic latch break alarm triggered after standard business hours.',
    investigator: 'Investigator Sarah Vance',
    status: 'VERIFIED',
    risk: 'LOW',
    createdAt: '2026-09-02T07:00:00Z',
    lastUpdated: '1 hour ago',
    evidence: [
      {
        id: 'ev-o1',
        name: 'hallway_camera.mp4',
        type: 'video',
        size: '9 MB',
        summary: 'Shows custodial crew cleaning glass partition and accidentally jarring door frame.',
        uploadedAt: '07:02:00'
      }
    ],
    timeline: [
      {
        id: 'tlo-1',
        timestamp: '06:58:20',
        timeSeconds: 10,
        description: 'Custodial team enters with vacuum unit; rubber bumper contacts door seal.',
        source: 'Hallway Camera',
        evidenceId: 'ev-o1',
        confidence: 99,
        flag: 'cleared'
      }
    ],
    currentAssessment: {
      finding: 'False alarm caused by custodial equipment contact.',
      risk: 'LOW',
      confidence: 98,
      confidenceLabel: 'High confidence',
      status: 'VERIFIED',
      summary: 'No intrusion or breach occurred. Physical contact from cleaning equipment generated temporary magnetic latch misalignment.',
      supportingEvidence: ['Video footage directly shows cleaning cart contact', 'Door remained shut and locked throughout'],
      contradictoryOrMissing: [],
      timestamp: '07:15:00'
    },
    assessmentHistory: [],
    uncertainties: [],
    investigationSteps: [],
    verification: {
      supportingEvidenceFound: true,
      timelineConsistent: true,
      newEvidenceChecked: true,
      contradictoryChecked: true,
      evidenceSufficient: true,
      result: 'SUPPORTED',
      explanation: 'Video and physical inspection thoroughly eliminate intrusion risk.',
      verifiedBy: 'Investigator Sarah Vance',
      verifiedAt: '07:30:00'
    },
    activityLog: [
      {
        id: 'acto-1',
        timestamp: '07:00:00',
        action: 'Case opened and verified',
        detail: 'Alarm cleared as non-malicious mechanical shock',
        type: 'verification'
      }
    ]
  }
];
