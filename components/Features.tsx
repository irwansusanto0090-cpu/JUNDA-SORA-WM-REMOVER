import React from 'react';
import { Zap, ShieldCheck, Sparkles } from 'lucide-react';

const Features: React.FC = () => {
  const features = [
    {
      icon: <Zap className="w-6 h-6 text-yellow-400" />,
      title: "Lightning Fast",
      desc: "Process your videos in seconds with our optimized removal engine."
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-green-400" />,
      title: "Secure & Private",
      desc: "We don't store your videos. All processing happens on the fly."
    },
    {
      icon: <Sparkles className="w-6 h-6 text-purple-400" />,
      title: "High Quality",
      desc: "Maintain the original resolution and bitrate of your Sora generations."
    }
  ];

  return (
    <div className="grid md:grid-cols-3 gap-6 w-full max-w-4xl mx-auto mt-20 px-6">
      {features.map((feature, idx) => (
        <div key={idx} className="bg-sora-card/50 backdrop-blur-sm border border-white/5 p-6 rounded-2xl hover:bg-sora-card/80 transition-colors">
          <div className="bg-white/5 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
            {feature.icon}
          </div>
          <h3 className="text-white font-semibold text-lg mb-2">{feature.title}</h3>
          <p className="text-gray-400 text-sm">{feature.desc}</p>
        </div>
      ))}
    </div>
  );
};

export default Features;