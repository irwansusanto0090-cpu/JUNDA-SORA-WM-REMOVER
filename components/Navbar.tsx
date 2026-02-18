import React from 'react';
import { Zap, Github } from 'lucide-react';

const Navbar: React.FC = () => {
  return (
    <nav className="w-full py-4 md:py-6 px-4 md:px-12 flex justify-between items-center relative z-10 border-b border-white/5 md:border-none bg-sora-dark/50 md:bg-transparent backdrop-blur-sm md:backdrop-blur-none">
      <div className="flex items-center gap-3">
        <div className="bg-gradient-to-br from-sora-primary to-sora-secondary p-2 rounded-lg shadow-lg shadow-purple-500/20">
          <Zap className="text-white w-5 h-5 md:w-6 md:h-6" />
        </div>
        <div>
          <h1 className="text-lg md:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
            SORA Remover
          </h1>
          <p className="text-[10px] md:text-xs text-sora-accent font-medium tracking-wider">WM BY JUNDA</p>
        </div>
      </div>
      
      <div className="hidden md:flex gap-6 items-center">
        <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">How it works</a>
        <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">Features</a>
        <a 
          href="https://github.com" 
          target="_blank" 
          rel="noreferrer"
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-sm"
        >
          <Github className="w-4 h-4" />
          <span>Star on GitHub</span>
        </a>
      </div>
    </nav>
  );
};

export default Navbar;