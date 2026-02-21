import React, { useState } from 'react';
import { Download, ExternalLink, RefreshCw, CheckCircle, Loader2 } from 'lucide-react';
import { ProcessedVideo } from '../types';

interface VideoResultProps {
  data: ProcessedVideo;
  onReset: () => void;
}

const VideoResult: React.FC<VideoResultProps> = ({ data, onReset }) => {
  const [downloading, setDownloading] = useState(false);

  // Use the downloadUrl if provided by API, otherwise fallback to preview url
  const targetUrl = data.downloadUrl || data.url;

  const handleDownload = async () => {
    if (downloading) return;
    setDownloading(true);

    const downloadBlob = (blob: Blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `sora-no-wm-${Date.now()}.mp4`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    };

    const strategies = [
      async () => {
        const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(targetUrl)}`;
        const res = await fetch(proxyUrl);
        if (!res.ok) throw new Error('Proxy 1 failed');
        return await res.blob();
      },
      async () => {
        const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`;
        const res = await fetch(proxyUrl);
        if (!res.ok) throw new Error('Proxy 2 failed');
        return await res.blob();
      },
      async () => {
        const res = await fetch(targetUrl);
        if (!res.ok) throw new Error('Direct fetch failed');
        return await res.blob();
      }
    ];

    try {
      let blob: Blob | null = null;
      for (const strategy of strategies) {
        try {
          blob = await strategy();
          if (blob) break;
        } catch (e) { continue; }
      }

      if (blob) {
        downloadBlob(blob);
      } else {
        throw new Error("Download failed");
      }
    } catch (finalError) {
      const a = document.createElement('a');
      a.href = targetUrl;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.download = `sora-no-wm-${Date.now()}.mp4`; 
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto mt-6 md:mt-12 animate-in fade-in slide-in-from-bottom-10 duration-700 px-0 md:px-4">
      <div className="bg-sora-card/80 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden shadow-2xl shadow-black/50">
        <div className="p-4 md:p-6 border-b border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 bg-gradient-to-r from-sora-card to-sora-dark">
          <div className="flex items-center gap-3">
            <CheckCircle className="text-green-500 w-5 h-5 md:w-6 md:h-6" />
            <span className="font-semibold text-base md:text-lg text-white">Watermark Removed</span>
          </div>
          <button onClick={onReset} className="text-sm text-gray-400 hover:text-white flex items-center gap-2 transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5">
            <RefreshCw className="w-4 h-4" /> Process New Video
          </button>
        </div>

        <div className="flex flex-col lg:flex-row">
          <div className="lg:w-7/12 bg-black/40 p-4 md:p-8 flex items-center justify-center min-h-[250px] md:min-h-[400px]">
            <video controls autoPlay loop muted playsInline className="w-full h-auto max-h-[60vh] rounded-lg shadow-lg border border-white/10" poster={data.thumbnail}>
              <source src={data.url} type="video/mp4" />
            </video>
          </div>

          <div className="lg:w-5/12 p-6 md:p-8 flex flex-col justify-center bg-sora-card/40">
            <div className="mb-8">
              <h3 className="text-xl md:text-2xl font-bold text-white mb-3">Download Ready</h3>
              <p className="text-gray-400 text-sm md:text-base leading-relaxed">
                Video is processed using Texa Engine. {data.resolution && `Resolution: ${data.resolution}`}
              </p>
            </div>

            <div className="space-y-4">
              <button onClick={handleDownload} disabled={downloading} className="w-full py-4 px-6 bg-gradient-to-r from-sora-primary to-sora-secondary hover:brightness-110 rounded-xl font-bold text-white shadow-lg shadow-purple-500/25 flex items-center justify-center gap-3 transition-all transform hover:scale-[1.01] disabled:opacity-70">
                {downloading ? <><Loader2 className="w-5 h-5 animate-spin" /> Preparing...</> : <><Download className="w-5 h-5" /> Download MP4</>}
              </button>
              <a href={data.url} target="_blank" rel="noreferrer" className="w-full py-4 px-6 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-medium text-gray-300 flex items-center justify-center gap-3 transition-all">
                <ExternalLink className="w-5 h-5" /> Preview
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoResult;