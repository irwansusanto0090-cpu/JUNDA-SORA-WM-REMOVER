import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Features from './components/Features';
import VideoResult from './components/VideoResult';
import { removeWatermark } from './services/soraService';
import { ProcessedVideo } from './types';
import { Link2, Loader2, AlertCircle } from 'lucide-react';

const App: React.FC = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ProcessedVideo | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    
    // Basic validation
    if (!url.toLowerCase().includes('sora') && !url.toLowerCase().includes('http')) {
      setError("Please enter a valid video URL.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await removeWatermark(url);
      setResult(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setUrl('');
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-sora-primary selection:text-white">
      <Navbar />

      <main className="flex-grow flex flex-col items-center justify-center relative z-10 px-4 py-8 md:py-16">
        {!result ? (
          <div className="w-full max-w-3xl mx-auto text-center space-y-8 md:space-y-10 animate-in fade-in zoom-in duration-500">
            <div className="space-y-4 px-2">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-tight">
                Remove Watermarks from <br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-sora-primary via-sora-secondary to-sora-accent animate-pulse">
                  Sora Videos
                </span>
              </h1>
              <p className="text-gray-300 text-base md:text-lg max-w-xl mx-auto leading-relaxed">
                Paste your Sora link below to instantly generate a clean, watermark-free version of your AI masterpiece.
              </p>
            </div>

            <div className="w-full bg-sora-card/30 backdrop-blur-xl border border-white/10 p-3 md:p-4 rounded-2xl shadow-2xl">
              <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-3">
                <div className="relative flex-grow group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Link2 className="h-5 w-5 text-gray-400 group-focus-within:text-sora-primary transition-colors" />
                  </div>
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://sora.chatgpt.com/p/..."
                    className="w-full pl-11 pr-4 py-4 bg-black/40 border border-white/5 focus:border-sora-primary/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sora-primary/20 transition-all text-sm md:text-base"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 md:px-8 py-4 bg-gradient-to-r from-sora-primary to-sora-secondary hover:brightness-110 rounded-xl font-bold text-white shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span className="hidden md:inline">Processing</span>
                    </>
                  ) : (
                    "Remove WM"
                  )}
                </button>
              </form>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-start gap-3 text-left max-w-xl mx-auto animate-in fade-in slide-in-from-top-2 backdrop-blur-sm">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-red-500 font-semibold text-sm">Error Processing Video</h4>
                  <p className="text-red-400/80 text-xs mt-1 leading-relaxed">{error}</p>
                </div>
              </div>
            )}

            <Features />
          </div>
        ) : (
          <VideoResult data={result} onReset={handleReset} />
        )}
      </main>

      <Footer />
    </div>
  );
};

export default App;