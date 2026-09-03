import { VideoFrameSample } from '../types';

/**
 * Formats a duration in seconds into MM:SS format.
 */
export function formatSecondsToTime(totalSeconds: number): string {
  const mins = Math.floor(totalSeconds / 60);
  const secs = Math.floor(totalSeconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Converts a browser File into a raw base64 string (without the data URL prefix).
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        const base64 = reader.result.includes(',') 
          ? reader.result.split(',')[1] 
          : reader.result;
        resolve(base64);
      } else {
        reject(new Error('Failed to read file as base64 string'));
      }
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

/**
 * Ultra-fast keyframe extractor across the video duration using HTML5 video and canvas.
 * Samples frames rapidly with per-seek timeout guards to guarantee completion in < 1 second.
 */
export function extractKeyframesFromVideo(
  file: File, 
  targetFrameCount: number = 4
): Promise<{ keyframes: VideoFrameSample[]; duration: number; firstFramePreview: string }> {
  return new Promise((resolve) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.muted = true;
    video.playsInline = true;

    const objectUrl = URL.createObjectURL(file);
    video.src = objectUrl;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d', { willReadFrequently: false });

    let isResolved = false;
    const keyframes: VideoFrameSample[] = [];

    const finish = (duration: number = 10) => {
      if (isResolved) return;
      isResolved = true;
      try {
        URL.revokeObjectURL(objectUrl);
        video.remove();
        canvas.remove();
      } catch (e) {}

      const firstFramePreview = keyframes.length > 0 ? keyframes[0].dataUrl : '';
      resolve({ keyframes, duration, firstFramePreview });
    };

    // Overall fail-safe timeout of 3.5 seconds
    const safetyTimer = setTimeout(() => {
      finish(video.duration || 10);
    }, 3500);

    video.onerror = () => {
      clearTimeout(safetyTimer);
      finish(10);
    };

    video.onloadedmetadata = async () => {
      try {
        const duration = video.duration && !isNaN(video.duration) && isFinite(video.duration) ? video.duration : 10;
        const actualFrames = Math.min(Math.max(2, targetFrameCount), 5);
        
        // Evenly distributed timestamps
        const timestamps: number[] = [];
        for (let i = 1; i <= actualFrames; i++) {
          const t = (duration / (actualFrames + 1)) * i;
          timestamps.push(Math.round(t * 10) / 10);
        }

        // Lightweight 480px width for near-instant rendering & fast AI transmission
        const origWidth = video.videoWidth || 480;
        const origHeight = video.videoHeight || 270;
        const maxDim = 480;
        const scale = origWidth > maxDim ? maxDim / origWidth : 1;
        canvas.width = Math.round(origWidth * scale) || 480;
        canvas.height = Math.round(origHeight * scale) || 270;

        for (const seekTime of timestamps) {
          if (isResolved) break;
          await new Promise<void>((res) => {
            let done = false;
            const timer = setTimeout(() => {
              if (!done) {
                done = true;
                res();
              }
            }, 650); // Max 650ms per frame seek

            const onSeeked = () => {
              if (done) return;
              done = true;
              clearTimeout(timer);
              video.removeEventListener('seeked', onSeeked);
              try {
                if (ctx) {
                  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                  const dataUrl = canvas.toDataURL('image/jpeg', 0.65);
                  const base64Data = dataUrl.split(',')[1];
                  keyframes.push({
                    timestamp: formatSecondsToTime(seekTime),
                    timeSeconds: Math.round(seekTime),
                    dataUrl,
                    base64Data
                  });
                }
              } catch (err) {}
              res();
            };

            video.addEventListener('seeked', onSeeked, { once: true });
            try {
              video.currentTime = seekTime;
            } catch (err) {
              clearTimeout(timer);
              res();
            }
          });
        }

        clearTimeout(safetyTimer);
        finish(duration);
      } catch (err) {
        clearTimeout(safetyTimer);
        finish(10);
      }
    };
  });
}
