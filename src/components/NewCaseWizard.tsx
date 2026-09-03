import React, { useState, useRef } from 'react';
import { 
  PlusCircle, 
  UploadCloud, 
  FileText, 
  Film, 
  Trash2, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  Camera, 
  FolderPlus,
  Info,
  Loader2,
  Video,
  Layers
} from 'lucide-react';
import { Evidence, EvidenceType } from '../types';
import { extractKeyframesFromVideo, fileToBase64 } from '../utils/videoProcessor';

interface NewCaseWizardProps {
  onCaseCreated: (newCaseId: string) => void;
  onCancel: () => void;
}

export const NewCaseWizard: React.FC<NewCaseWizardProps> = ({
  onCaseCreated,
  onCancel
}) => {
  const [step, setStep] = useState<number>(1);
  const [title, setTitle] = useState<string>('Warehouse Door Access Incident');
  const [description, setDescription] = useState<string>('Motion alarm tripped during scheduled lockdown in Secure Bay 4.');
  const [investigator, setInvestigator] = useState<string>('Investigator Sarah Vance');
  const [evidenceList, setEvidenceList] = useState<Evidence[]>([
    {
      id: 'init-ev-1',
      name: 'warehouse_camera.mp4',
      type: 'video',
      size: '24.2 MB',
      timestamp: '10:41:00 - 10:42:30',
      summary: 'Corridor CCTV camera covering Secure Bay 4 door.',
      uploadedAt: 'Just now'
    },
    {
      id: 'init-ev-2',
      name: 'access_log.csv',
      type: 'csv',
      size: '124 KB',
      timestamp: '10:30:00 - 10:50:00',
      summary: 'Door sensor contact and PIR telemetry logs.',
      uploadedAt: 'Just now'
    },
    {
      id: 'init-ev-3',
      name: 'security_report.pdf',
      type: 'pdf',
      size: '1.4 MB',
      timestamp: '10:43:00',
      summary: 'Shift supervisor preliminary dispatch note.',
      uploadedAt: 'Just now'
    }
  ]);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [isProcessingMedia, setIsProcessingMedia] = useState<boolean>(false);
  const [mediaProgressMsg, setMediaProgressMsg] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsProcessingMedia(true);
    const fileArray = Array.from(files) as File[];
    const processedItems: Evidence[] = [];

    for (let idx = 0; idx < fileArray.length; idx++) {
      const file = fileArray[idx];
      const ext = file.name.split('.').pop()?.toLowerCase() || '';
      let type: EvidenceType = 'text';
      if (['mp4', 'mov', 'webm', 'avi'].includes(ext)) type = 'video';
      else if (['jpg', 'jpeg', 'png', 'webp'].includes(ext)) type = 'image';
      else if (['pdf'].includes(ext)) type = 'pdf';
      else if (['csv'].includes(ext)) type = 'csv';
      else if (['log', 'txt', 'json'].includes(ext)) type = 'log';

      if (type === 'video') {
        setMediaProgressMsg(`Processing "${file.name}": sampling keyframes for AI detection camera...`);
        
        let keyframes: any[] = [];
        let duration = 0;
        let videoBase64: string | undefined = undefined;
        const videoUrl = URL.createObjectURL(file);

        try {
          // Fast keyframe extraction (under 1s)
          const extraction = await extractKeyframesFromVideo(file, 4);
          keyframes = extraction.keyframes;
          duration = Math.round(extraction.duration);
        } catch (err) {
          console.warn('Keyframe extraction warning:', err);
        }

        // Only convert to raw base64 if small (< 3MB) to keep processing instant
        if (file.size <= 3 * 1024 * 1024) {
          try {
            videoBase64 = await fileToBase64(file);
          } catch (err) {
            console.warn('Video base64 conversion warning:', err);
          }
        }

        processedItems.push({
          id: `upload-${Date.now()}-${idx}`,
          name: file.name,
          type: 'video',
          size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
          summary: `Video artifact (${duration ? `${duration}s` : 'surveillance clip'}). AI detection camera feed ready.`,
          videoUrl,
          videoBase64,
          videoMimeType: file.type || 'video/mp4',
          keyframes,
          duration,
          previewContent: keyframes.length > 0 ? keyframes[0].dataUrl : undefined,
          keyDetails: [
            duration ? `Video duration: ${duration} seconds` : 'Custom video clip',
            `${keyframes.length} visual keyframes extracted for AI detection`,
            'Real-time suspicious tracking & object detection enabled'
          ],
          uploadedAt: 'Just now'
        });
      } else if (type === 'image') {
        setMediaProgressMsg(`Processing image "${file.name}"...`);
        let previewContent: string | undefined = undefined;
        try {
          previewContent = await fileToBase64(file);
        } catch (err) {}

        processedItems.push({
          id: `upload-${Date.now()}-${idx}`,
          name: file.name,
          type: 'image',
          size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
          summary: `Uploaded image asset for visual correlation.`,
          previewContent,
          keyDetails: ['Custom image evidence artifact', 'Visual entity recognition ready'],
          uploadedAt: 'Just now'
        });
      } else {
        setMediaProgressMsg(`Reading file "${file.name}"...`);
        let previewContent = '';
        try {
          const text = await file.text();
          previewContent = text.slice(0, 3000);
        } catch (err) {}

        processedItems.push({
          id: `upload-${Date.now()}-${idx}`,
          name: file.name,
          type,
          size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
          summary: `Uploaded ${file.name} artifact for investigation correlation.`,
          previewContent: previewContent || undefined,
          keyDetails: ['Uploaded by investigator', 'Log & telemetry record'],
          uploadedAt: 'Just now'
        });
      }
    }

    setEvidenceList(prev => [...prev, ...processedItems]);
    setIsProcessingMedia(false);
    setMediaProgressMsg('');
  };

  const removeEvidence = (id: string) => {
    setEvidenceList(prev => prev.filter(item => item.id !== id));
  };

  const handleStartInvestigation = async () => {
    if (!title.trim()) return;
    setIsCreating(true);

    try {
      // 1. Create case via API
      const res = await fetch('/api/cases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          investigator
        })
      });
      const createdCase = await res.json();

      // 2. Add evidence items
      for (const ev of evidenceList) {
        await fetch(`/api/cases/${createdCase.id}/evidence`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(ev)
        });
      }

      // 3. Trigger initial AI analysis
      await fetch(`/api/cases/${createdCase.id}/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      onCaseCreated(createdCase.id);
    } catch (err) {
      console.error(err);
      setIsCreating(false);
    }
  };

  return (
    <div id="new-case-wizard" className="max-w-3xl mx-auto py-6 px-4">
      {/* 3-Step Progress Indicator */}
      <div className="flex items-center justify-between mb-8 max-w-md mx-auto">
        <div className="flex items-center gap-2">
          <span className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
            step >= 1 ? 'bg-cyan-600 text-white shadow-xs' : 'bg-slate-100 text-slate-400 border border-slate-200'
          }`}>
            1
          </span>
          <span className={`text-xs font-semibold ${step >= 1 ? 'text-slate-900' : 'text-slate-400'}`}>
            Name Investigation
          </span>
        </div>

        <div className="w-10 h-0.5 bg-slate-200" />

        <div className="flex items-center gap-2">
          <span className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
            step >= 2 ? 'bg-cyan-600 text-white shadow-xs' : 'bg-slate-100 text-slate-400 border border-slate-200'
          }`}>
            2
          </span>
          <span className={`text-xs font-semibold ${step >= 2 ? 'text-slate-900' : 'text-slate-400'}`}>
            Add Evidence
          </span>
        </div>

        <div className="w-10 h-0.5 bg-slate-200" />

        <div className="flex items-center gap-2">
          <span className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
            step >= 3 ? 'bg-cyan-600 text-white shadow-xs' : 'bg-slate-100 text-slate-400 border border-slate-200'
          }`}>
            3
          </span>
          <span className={`text-xs font-semibold ${step >= 3 ? 'text-slate-900' : 'text-slate-400'}`}>
            Start Investigation
          </span>
        </div>
      </div>

      {/* Step 1: Name Investigation */}
      {step === 1 && (
        <div className="bg-white/90 border border-slate-200 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 animate-in fade-in duration-200">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Start a New Investigation</h2>
            <p className="text-xs text-slate-500 mt-1">
              Give your investigation a clear name and briefly describe what triggered the alert.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Investigation Name <span className="text-cyan-600">*</span>
              </label>
              <input
                id="new-case-title-input"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Example: Warehouse Door Incident"
                className="w-full bg-white border border-slate-300 rounded-2xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-200 shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Description (Optional)
              </label>
              <textarea
                id="new-case-desc-input"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Briefly describe what happened..."
                className="w-full bg-white border border-slate-300 rounded-2xl p-3 text-xs text-slate-900 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-200 shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Lead Investigator
              </label>
              <input
                type="text"
                value={investigator}
                onChange={(e) => setInvestigator(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-2xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-200 shadow-2xs"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              id="wizard-step1-continue-btn"
              onClick={() => setStep(2)}
              disabled={!title.trim()}
              className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-white font-bold text-xs transition-all flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Add Evidence */}
      {step === 2 && (
        <div className="bg-white/90 border border-slate-200 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 animate-in fade-in duration-200">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Add Evidence</h2>
            <p className="text-xs text-slate-500 mt-1">
              Add anything that may help us understand what happened (video, images, PDFs, reports, or logs).
            </p>
          </div>

          {/* Upload Dropzone Card */}
          <div 
            onClick={() => !isProcessingMedia && fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-3xl p-7 text-center transition-all ${
              isProcessingMedia 
                ? 'border-cyan-400 bg-cyan-50/50 cursor-wait' 
                : 'border-slate-300 hover:border-cyan-500 bg-slate-50/70 hover:bg-slate-50 cursor-pointer'
            }`}
          >
            <input 
              ref={fileInputRef}
              type="file" 
              multiple 
              accept=".mp4,.mov,.webm,.jpg,.jpeg,.png,.pdf,.txt,.csv,.json"
              onChange={handleFileUpload} 
              className="hidden" 
            />
            <div className="w-12 h-12 mx-auto rounded-full bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-800 mb-3">
              {isProcessingMedia ? <Loader2 className="w-6 h-6 animate-spin text-cyan-600" /> : <UploadCloud className="w-6 h-6" />}
            </div>
            <h3 className="text-sm font-bold text-slate-900">
              {isProcessingMedia ? 'Processing Media...' : 'Upload Evidence Files (Videos, Images, Logs)'}
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              {isProcessingMedia 
                ? mediaProgressMsg 
                : 'Drop files here or click to browse. Custom videos are automatically processed via Option A (Keyframe Extraction) and Option B (Multimodal Stream).'}
            </p>
            {!isProcessingMedia && (
              <div className="mt-4 flex items-center justify-center gap-2">
                <span className="px-4 py-2 rounded-xl bg-cyan-50 hover:bg-cyan-100 text-cyan-800 font-bold text-xs border border-cyan-200 shadow-2xs flex items-center gap-1.5">
                  <Video className="w-3.5 h-3.5" />
                  <span>Select Video / Files</span>
                </span>
              </div>
            )}
          </div>

          {/* Current Evidence List */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Evidence Files Attached ({evidenceList.length})
              </span>
            </div>

            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {evidenceList.map((item) => (
                <div 
                  key={item.id}
                  className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200 text-xs hover:bg-white transition-colors shadow-2xs space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-cyan-100 border border-cyan-200 flex items-center justify-center text-cyan-800 shrink-0">
                        {item.type === 'video' ? <Film className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-mono text-slate-900 font-semibold truncate">{item.name}</p>
                          {item.keyframes && item.keyframes.length > 0 && (
                            <span className="text-[10px] font-semibold font-mono bg-cyan-100 text-cyan-800 border border-cyan-200 px-1.5 py-0.2 rounded-md">
                              Option A & B
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500">
                          {item.type.toUpperCase()} • {item.size} {item.duration ? `• ${item.duration}s clip` : ''}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeEvidence(item.id);
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Visual keyframe strip if video keyframes extracted */}
                  {item.keyframes && item.keyframes.length > 0 && (
                    <div className="pt-2 border-t border-slate-200/70">
                      <div className="flex items-center justify-between text-[10px] font-semibold text-slate-500 mb-1.5 font-mono">
                        <span className="flex items-center gap-1">
                          <Layers className="w-3 h-3 text-cyan-600" />
                          <span>Extracted Visual Keyframes ({item.keyframes.length})</span>
                        </span>
                        <span className="text-cyan-700">Ready for Gemini multimodal audit</span>
                      </div>
                      <div className="grid grid-cols-6 gap-1.5">
                        {item.keyframes.map((kf, i) => (
                          <div key={i} className="relative aspect-video rounded-lg overflow-hidden border border-slate-300 bg-slate-950 group">
                            <img src={kf.dataUrl} alt={`Keyframe ${kf.timestamp}`} className="w-full h-full object-cover" />
                            <span className="absolute bottom-0.5 right-0.5 bg-slate-950/80 px-1 rounded text-[9px] font-mono text-cyan-300">
                              {kf.timestamp}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Wizard Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            <button
              onClick={() => setStep(1)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-all cursor-pointer"
            >
              Back
            </button>
            <button
              id="wizard-step2-start-btn"
              disabled={evidenceList.length === 0 || isCreating}
              onClick={handleStartInvestigation}
              className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-white font-bold text-xs transition-all flex items-center gap-2 cursor-pointer shadow-xs"
            >
              {isCreating ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>Processing Evidence with Gemini...</span>
                </>
              ) : (
                <>
                  <span>Start Investigation</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
