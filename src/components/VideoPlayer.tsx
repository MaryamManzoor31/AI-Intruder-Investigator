import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Maximize2, 
  Camera, 
  Volume2, 
  VolumeX, 
  Sliders, 
  ShieldCheck,
  Radio,
  Eye
} from 'lucide-react';
import { TimelineEvent, Evidence } from '../types';

interface VideoPlayerProps {
  timelineEvents: TimelineEvent[];
  currentTime: number; // in seconds
  onSeek: (time: number) => void;
  activeCamera?: string;
  onSelectCamera?: (cam: string) => void;
  caseEvidence?: Evidence[];
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  timelineEvents,
  currentTime,
  onSeek,
  activeCamera = 'warehouse_camera.mp4',
  onSelectCamera,
  caseEvidence = []
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [selectedCam, setSelectedCam] = useState<string>(activeCamera);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoElementRef = useRef<HTMLVideoElement | null>(null);
  const [customVideoDuration, setCustomVideoDuration] = useState<number>(90);

  // Check if selected camera is an attached video evidence file
  const activeVideoEvidence = caseEvidence.find(
    e => e.type === 'video' && (e.name === selectedCam || e.id === selectedCam)
  ) || caseEvidence.find(e => e.type === 'video' && (e.videoUrl || e.videoBase64));

  const isCustomVideoActive = Boolean(
    activeVideoEvidence && (selectedCam === activeVideoEvidence.name || selectedCam === activeVideoEvidence.id)
  );

  // Synchronize camera selection if prop changes
  useEffect(() => {
    setSelectedCam(activeCamera);
  }, [activeCamera]);

  // Total duration: dynamically determined if custom video is present
  const totalDuration = isCustomVideoActive 
    ? (activeVideoEvidence?.duration || customVideoDuration || 60)
    : 90;

  // Handle native HTML5 video sync if custom video is playing
  useEffect(() => {
    const video = videoElementRef.current;
    if (!video || !isCustomVideoActive) return;

    if (isPlaying && video.paused) {
      video.play().catch(() => {});
    } else if (!isPlaying && !video.paused) {
      video.pause();
    }
  }, [isPlaying, isCustomVideoActive]);

  useEffect(() => {
    const video = videoElementRef.current;
    if (!video || !isCustomVideoActive) return;

    if (Math.abs(video.currentTime - currentTime) > 0.6) {
      video.currentTime = currentTime;
    }
  }, [currentTime, isCustomVideoActive]);

  useEffect(() => {
    const video = videoElementRef.current;
    if (!video || !isCustomVideoActive) return;
    video.playbackRate = playbackSpeed;
  }, [playbackSpeed, isCustomVideoActive]);

  // Video playback loop simulation (fallback / simulated canvas)
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && !isCustomVideoActive) {
      interval = setInterval(() => {
        onSeek(Math.min(totalDuration, currentTime + 0.5 * playbackSpeed));
        if (currentTime >= totalDuration) {
          setIsPlaying(false);
        }
      }, 500);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentTime, playbackSpeed, onSeek, isCustomVideoActive, totalDuration]);

  // Render CCTV video frame on Canvas based on current simulated timestamp
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Background corridor rendering (Industrial security aesthetic)
    ctx.fillStyle = selectedCam.includes('warehouse') ? '#0c111a' : '#080d14';
    ctx.fillRect(0, 0, width, height);

    // Architectural lines / Perspective corridor
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1.5;

    // Floor and ceiling grid lines
    ctx.beginPath();
    ctx.moveTo(0, height * 0.75);
    ctx.lineTo(width * 0.35, height * 0.45);
    ctx.lineTo(width * 0.65, height * 0.45);
    ctx.lineTo(width, height * 0.75);
    ctx.stroke();

    // Ceiling lines
    ctx.beginPath();
    ctx.moveTo(0, height * 0.2);
    ctx.lineTo(width * 0.35, height * 0.45);
    ctx.lineTo(width * 0.65, height * 0.45);
    ctx.lineTo(width, height * 0.2);
    ctx.stroke();

    // Security Door Frame
    const doorX = width * 0.42;
    const doorY = height * 0.35;
    const doorW = width * 0.16;
    const doorH = height * 0.45;

    // Determine door state based on current time (Door opens between 18s and 70s)
    const isDoorOpen = currentTime >= 18 && currentTime <= 70;
    const isRestrictedZoneTriggered = currentTime >= 34 && currentTime <= 70;

    // Door structure
    ctx.fillStyle = isDoorOpen ? '#132338' : '#18202d';
    ctx.fillRect(doorX, doorY, doorW, doorH);
    ctx.strokeStyle = isDoorOpen ? '#06b6d4' : '#334155';
    ctx.lineWidth = 2;
    ctx.strokeRect(doorX, doorY, doorW, doorH);

    // Turnstile / Card Reader on side
    const readerX = doorX - 25;
    const readerY = doorY + doorH * 0.4;
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(readerX, readerY, 14, 28);
    // Indicator LED
    ctx.fillStyle = currentTime >= 14 && currentTime <= 25 ? '#10b981' : '#38bdf8';
    ctx.beginPath();
    ctx.arc(readerX + 7, readerY + 8, 3.5, 0, Math.PI * 2);
    ctx.fill();

    // Simulated Person Entity (Person A)
    // Motion Path:
    // 0-14s: Approaches door from left
    // 14-18s: Standing at card reader
    // 18-34s: Door opens, pauses
    // 34-70s: Enters Bay 4 inside door
    // 70-90s: Exits Bay 4 and moves away
    let personVisible = true;
    let personX = 0;
    let personY = 0;
    let personScale = 1;

    if (currentTime < 14) {
      const progress = currentTime / 14;
      personX = width * 0.15 + progress * (readerX - width * 0.15);
      personY = height * 0.52 + progress * (height * 0.45 - height * 0.52);
      personScale = 0.9 + progress * 0.15;
    } else if (currentTime <= 18) {
      personX = readerX - 10;
      personY = height * 0.47;
      personScale = 1.05;
    } else if (currentTime <= 34) {
      const progress = (currentTime - 18) / 16;
      personX = readerX - 10 + progress * (doorX + doorW * 0.5 - (readerX - 10));
      personY = height * 0.47;
      personScale = 1.0 - progress * 0.15;
    } else if (currentTime <= 70) {
      // Inside restricted zone
      personX = doorX + doorW * 0.5;
      personY = height * 0.42;
      personScale = 0.75;
    } else if (currentTime <= 85) {
      const progress = (currentTime - 70) / 15;
      personX = doorX + doorW * 0.5 - progress * (width * 0.4);
      personY = height * 0.48 + progress * 20;
      personScale = 0.8 + progress * 0.3;
    } else {
      personVisible = false;
    }

    if (personVisible) {
      const pW = 28 * personScale;
      const pH = 72 * personScale;
      const drawX = personX - pW / 2;
      const drawY = personY;

      // Draw silhouette
      ctx.fillStyle = '#cbd5e1';
      // Head
      ctx.beginPath();
      ctx.arc(drawX + pW / 2, drawY + pH * 0.15, pW * 0.28, 0, Math.PI * 2);
      ctx.fill();
      // Torso & diagnostic case
      ctx.fillRect(drawX + pW * 0.2, drawY + pH * 0.3, pW * 0.6, pH * 0.4);
      // Legs
      ctx.fillRect(drawX + pW * 0.25, drawY + pH * 0.7, pW * 0.2, pH * 0.3);
      ctx.fillRect(drawX + pW * 0.55, drawY + pH * 0.7, pW * 0.2, pH * 0.3);

      // AI Bounding Box (Cybersecurity overlay)
      const boxPad = 8;
      ctx.strokeStyle = isRestrictedZoneTriggered ? '#ef4444' : '#06b6d4';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(drawX - boxPad, drawY - boxPad, pW + boxPad * 2, pH + boxPad * 2);

      // Corner tick marks
      const tick = 6;
      ctx.lineWidth = 2.5;
      // Top-left
      ctx.beginPath();
      ctx.moveTo(drawX - boxPad, drawY - boxPad + tick);
      ctx.lineTo(drawX - boxPad, drawY - boxPad);
      ctx.lineTo(drawX - boxPad + tick, drawY - boxPad);
      ctx.stroke();

      // Label tag
      ctx.fillStyle = isRestrictedZoneTriggered ? 'rgba(239, 68, 68, 0.85)' : 'rgba(6, 182, 212, 0.85)';
      ctx.fillRect(drawX - boxPad, drawY - boxPad - 18, 108, 16);
      ctx.fillStyle = '#0f172a';
      ctx.font = '10px JetBrains Mono, monospace';
      ctx.fillText(
        isRestrictedZoneTriggered ? 'PERSON A [BAY 4]' : 'PERSON A [TRACKED]',
        drawX - boxPad + 4,
        drawY - boxPad - 6
      );
    }

    // Zone Perimeter boundary overlay
    ctx.strokeStyle = isRestrictedZoneTriggered ? 'rgba(239, 68, 68, 0.4)' : 'rgba(148, 163, 184, 0.2)';
    ctx.setLineDash([4, 4]);
    ctx.strokeRect(doorX - 10, doorY - 10, doorW + 20, doorH + 20);
    ctx.setLineDash([]);

    // Telemetry text overlays on CCTV
    ctx.fillStyle = '#06b6d4';
    ctx.font = '11px JetBrains Mono, monospace';
    const timeFormatted = formatTimecode(currentTime);
    ctx.fillText(`CAM-WH-04 [REC] 2026-09-02 ${timeFormatted}`, 16, 24);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px JetBrains Mono, monospace';
    ctx.fillText(`FPS: 30.0 | RES: 1080p | MOTION_PIR: ${isRestrictedZoneTriggered ? 'ACTIVE_ALERT' : 'ARMED'}`, 16, 40);

    // Live REC blinking dot
    if (Math.floor(currentTime * 2) % 2 === 0) {
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(width - 24, 20, 5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = '#ef4444';
    ctx.font = '10px JetBrains Mono, monospace';
    ctx.fillText('REC', width - 52, 24);
  }, [currentTime, selectedCam]);

  function formatTimecode(sec: number): string {
    if (isCustomVideoActive) {
      const totalSeconds = Math.floor(sec);
      const m = Math.floor(totalSeconds / 60);
      const s = totalSeconds % 60;
      return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    }
    const baseHour = 10;
    const baseMinute = 41;
    const totalSeconds = Math.floor(sec);
    const m = baseMinute + Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${baseHour}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }

  function formatMaxTimecode(): string {
    if (isCustomVideoActive) {
      const totalSeconds = Math.floor(totalDuration);
      const m = Math.floor(totalSeconds / 60);
      const s = totalSeconds % 60;
      return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    }
    return '10:42:30';
  }

  // Find closest keyframe image if custom video is present
  const currentKeyframe = activeVideoEvidence?.keyframes?.reduce((prev, curr) => {
    return Math.abs(curr.timeSeconds - currentTime) < Math.abs(prev.timeSeconds - currentTime) ? curr : prev;
  }, activeVideoEvidence?.keyframes?.[0]);

  const customVideoSrc = activeVideoEvidence?.videoUrl || (
    activeVideoEvidence?.videoBase64 
      ? (activeVideoEvidence.videoBase64.startsWith('data:') 
          ? activeVideoEvidence.videoBase64 
          : `data:${activeVideoEvidence.videoMimeType || 'video/mp4'};base64,${activeVideoEvidence.videoBase64}`)
      : null
  );

  return (
    <div id="cctv-video-player-container" className="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
      {/* Top Video Header */}
      <div className="px-4 py-2.5 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <Camera className="w-4 h-4 text-cyan-700 shrink-0" />
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-xs font-semibold text-slate-900 truncate">Incident Evidence Feed</span>
            <span className="text-[11px] font-mono font-semibold text-cyan-800 bg-cyan-100 px-2.5 py-0.5 rounded-lg border border-cyan-200 truncate">
              {selectedCam}
            </span>
          </div>
        </div>

        {/* Camera angle & Uploaded video switcher */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200 overflow-x-auto max-w-full">
          {/* Custom video items in evidence */}
          {caseEvidence.filter(e => e.type === 'video').map((vEv) => (
            <button
              key={vEv.id}
              onClick={() => {
                setSelectedCam(vEv.name);
                onSelectCamera?.(vEv.name);
              }}
              className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                selectedCam === vEv.name || (isCustomVideoActive && activeVideoEvidence?.id === vEv.id)
                  ? 'bg-cyan-600 text-white font-bold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 bg-white/60'
              }`}
            >
              <Radio className="w-3 h-3 animate-pulse" />
              <span className="truncate max-w-[120px]">{vEv.name}</span>
            </button>
          ))}

          <button
            id="cam-btn-warehouse"
            onClick={() => {
              setSelectedCam('warehouse_camera.mp4');
              onSelectCamera?.('warehouse_camera.mp4');
            }}
            className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all cursor-pointer whitespace-nowrap ${
              selectedCam === 'warehouse_camera.mp4'
                ? 'bg-white text-cyan-800 font-bold border border-slate-200 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Bay 4 Interior
          </button>
          <button
            id="cam-btn-entrance"
            onClick={() => {
              setSelectedCam('entrance_camera.mp4');
              onSelectCamera?.('entrance_camera.mp4');
            }}
            className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all cursor-pointer whitespace-nowrap ${
              selectedCam === 'entrance_camera.mp4'
                ? 'bg-white text-cyan-800 font-bold border border-slate-200 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Entrance Gate
          </button>
        </div>
      </div>

      {/* Video / Canvas Screen */}
      <div className="relative aspect-[16/9] w-full bg-slate-950 flex items-center justify-center overflow-hidden">
        {isCustomVideoActive && customVideoSrc ? (
          <video
            ref={videoElementRef}
            src={customVideoSrc}
            playsInline
            onLoadedMetadata={(e) => {
              const dur = (e.target as HTMLVideoElement).duration;
              if (dur && !isNaN(dur) && isFinite(dur)) {
                setCustomVideoDuration(dur);
              }
            }}
            onTimeUpdate={(e) => {
              const cur = (e.target as HTMLVideoElement).currentTime;
              onSeek(cur);
            }}
            onEnded={() => setIsPlaying(false)}
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-full h-full object-contain cursor-pointer"
          />
        ) : isCustomVideoActive && currentKeyframe ? (
          /* Option A: Keyframe scrubbing view when raw stream is purely keyframes */
          <div 
            onClick={() => setIsPlaying(!isPlaying)} 
            className="w-full h-full relative flex items-center justify-center cursor-pointer bg-slate-950"
          >
            <img 
              src={currentKeyframe.dataUrl} 
              alt={`Keyframe at ${currentKeyframe.timestamp}`}
              className="w-full h-full object-contain" 
            />
            <div className="absolute bottom-3 left-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-cyan-500/40 text-[11px] font-mono text-cyan-300">
              Keyframe sampled at {currentKeyframe.timestamp}
            </div>
          </div>
        ) : (
          <canvas
            id="cctv-canvas"
            ref={canvasRef}
            width={640}
            height={360}
            className="w-full h-full object-contain cursor-crosshair"
            onClick={() => setIsPlaying(!isPlaying)}
          />
        )}

        {/* On-screen quick indicator */}
        <div className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-md border border-white/20 rounded-xl px-2.5 py-1 text-[11px] font-mono text-slate-200 flex items-center gap-2 shadow-sm pointer-events-none">
          <Eye className="w-3.5 h-3.5 text-cyan-400" />
          <span>{isCustomVideoActive ? 'Multimodal Feed: Active' : 'Entity Tracking: Active'}</span>
        </div>

        {/* Top-left Timestamp Overlay */}
        <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md border border-white/20 rounded-xl px-2.5 py-1 text-[11px] font-mono text-slate-200 flex items-center gap-2 shadow-sm pointer-events-none">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span>{formatTimecode(currentTime)}</span>
        </div>
      </div>

      {/* Scrub Bar with Interactive Timeline Keyframes */}
      <div className="px-4 pt-3 pb-2.5 bg-slate-50/80 border-t border-slate-200">
        <div className="relative flex items-center group">
          <input
            id="cctv-scrub-slider"
            type="range"
            min="0"
            max={totalDuration}
            step="0.1"
            value={currentTime}
            onChange={(e) => onSeek(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-cyan-600"
          />

          {/* Interactive event ticks on the scrub bar */}
          {timelineEvents.map((event) => {
            const pct = Math.min(100, Math.max(0, (event.timeSeconds / (totalDuration || 1)) * 100));
            const isNear = Math.abs(currentTime - event.timeSeconds) < 3;
            return (
              <div
                key={event.id}
                onClick={() => onSeek(event.timeSeconds)}
                title={`${event.timestamp}: ${event.description}`}
                style={{ left: `${pct}%` }}
                className={`absolute -top-1 w-3 h-3 rounded-full -translate-x-1/2 cursor-pointer transition-transform ${
                  isNear 
                    ? 'bg-cyan-600 ring-2 ring-cyan-300 scale-125 z-10' 
                    : event.flag === 'critical'
                    ? 'bg-red-500 hover:scale-125'
                    : event.flag === 'suspicious'
                    ? 'bg-amber-500 hover:scale-125'
                    : 'bg-slate-400 hover:scale-125'
                }`}
              />
            );
          })}
        </div>

        {/* Video Player Controls */}
        <div className="flex items-center justify-between mt-2.5">
          <div className="flex items-center gap-3">
            <button
              id="cctv-play-pause-btn"
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-8 h-8 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white flex items-center justify-center transition-all cursor-pointer shadow-xs"
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
            </button>

            <button
              id="cctv-reset-btn"
              onClick={() => onSeek(0)}
              className="p-1.5 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
              title="Replay from start"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <div className="font-mono text-xs text-slate-700">
              <span className="text-cyan-800 font-bold">{formatTimecode(currentTime)}</span>
              <span className="text-slate-400 mx-1">/</span>
              <span className="text-slate-500">{formatMaxTimecode()}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Speed toggle */}
            <button
              id="cctv-speed-btn"
              onClick={() => setPlaybackSpeed(playbackSpeed === 1 ? 2 : playbackSpeed === 2 ? 0.5 : 1)}
              className="text-xs font-mono px-2.5 py-1 rounded-lg bg-white text-slate-700 hover:text-slate-900 border border-slate-200 cursor-pointer transition-all shadow-2xs font-semibold"
            >
              {playbackSpeed}x Speed
            </button>

            <div className="text-[11px] text-slate-500 border-l border-slate-200 pl-2.5 hidden sm:block font-mono">
              Click timeline ticks to jump
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
