import React, { useState } from 'react';
import { Download, ExternalLink, RefreshCw, CheckCircle, Loader2 } from 'lucide-react';
import { ProcessedVideo } from '../types';

interface VideoResultProps {
  data: ProcessedVideo;
  onReset: () => void;
}

const VideoResult: React.FC<VideoResultProps> = ({ data, onReset }) => {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    if (downloading) return;
    setDownloading(true);

    try {
      // Attempt to fetch the blob to force a real download instead of opening a tab
      const response = await fetch(data.url);
      
      if (!response.ok) throw new Error("Network response was not ok");
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sora-no-wm-${Date.now()}.mp4`;
      document.body.appendChild(a);
      a.click();
      
      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (e) {
      console.error("Blob download failed, falling back to direct link", e);
      // Fallback mechanism: If CORS prevents fetching blob, open in new tab
      // This is unavoidable for some cross-origin resources without a backend proxy
      const a = document.createElement('a');
      a.href = data.url;
      a.target = '_blank';
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
        
        {/* Header */}
        <div className="p-4 md:p-6 border-b border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 bg-gradient-to-r from-sora-card to-sora-dark">
          <div className="flex items-center gap-3">
            <CheckCircle className="text-green-500 w-5 h-5 md:w-6 md:h-6" />
            <span className="font-semibold text-base md:text-lg text-white">Watermark Removed</span>
          </div>
          <button 
            onClick={onReset}
            className="text-sm text-gray-400 hover:text-white flex items-center gap-2 transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5"
          >
            <RefreshCw className="w-4 h-4" />
            Process New Video
          </button>
        </div>

        <div className="flex flex-col lg:flex-row">
          {/* Video Player Section */}
          <div className="lg:w-7/12 bg-black/40 p-4 md:p-8 flex items-center justify-center min-h-[250px] md:min-h-[400px]">
            <video 
              controls
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-auto max-h-[60vh] rounded-lg shadow-lg border border-white/10"
              poster={data.thumbnail}
            >
              <source src={data.url} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>

          {/* Details & Actions Section */}
          <div className="lg:w-5/12 p-6 md:p-8 flex flex-col justify-center bg-sora-card/40">
            <div className="mb-8">
              <h3 className="text-xl md:text-2xl font-bold text-white mb-3">Download Ready</h3>
              <p className="text-gray-400 text-sm md:text-base leading-relaxed">
                Your video is ready. The watermark has been removed while maintaining original quality.
              </p>
            </div>

            <div className="space-y-4">
              <button 
                onClick={handleDownload}
                disabled={downloading}
                className="w-full py-4 px-6 bg-gradient-to-r from-sora-primary to-sora-secondary hover:brightness-110 rounded-xl font-bold text-white shadow-lg shadow-purple-500/25 flex items-center justify-center gap-3 transition-all transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70 disabled:cursor-wait"
              >
                {downloading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Preparing Download...
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    Download Video
                  </>
                )}
              </button>

              <a 
                href={data.url} 
                target="_blank" 
                rel="noreferrer"
                className="w-full py-4 px-6 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-medium text-gray-300 flex items-center justify-center gap-3 transition-all"
              >
                <ExternalLink className="w-5 h-5" />
                Preview in New Tab
              </a>
            </div>

            <div className="mt-8 pt-6 border-t border-white/5">
              <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-2">Original Source</p>
              <div className="bg-black/20 p-3 rounded-lg border border-white/5">
                 <p className="text-xs text-gray-400 truncate font-mono">
                  {data.originalUrl}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoResult;