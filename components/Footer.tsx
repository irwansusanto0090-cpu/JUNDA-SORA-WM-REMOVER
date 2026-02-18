import React from 'react';
import { Heart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full py-8 mt-auto border-t border-white/5 relative z-10 bg-sora-dark">
      <div className="container mx-auto px-6 text-center">
        <p className="text-gray-500 text-sm flex items-center justify-center gap-1">
          Made with <Heart className="w-4 h-4 text-red-500 fill-red-500" /> by Junda using React & Tailwind
        </p>
        <p className="text-gray-600 text-xs mt-2">
          This tool is for educational purposes only. Please respect copyright laws.
        </p>
      </div>
    </footer>
  );
};

export default Footer;