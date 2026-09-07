'use client';

import React from 'react';
import { ShieldCheck, RefreshCw, BookOpen, Moon, Sun, PhoneCall, Plus } from 'lucide-react';

interface NavbarProps {
  darkMode: boolean;
  setDarkMode: (val: boolean | ((prev: boolean) => boolean)) => void;
  onResetSeedData: () => void;
  onOpenAcademicModal: () => void;
  onOpenCustomCallModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  darkMode,
  setDarkMode,
  onResetSeedData,
  onOpenAcademicModal,
  onOpenCustomCallModal,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo & Title */}
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
            <ShieldCheck className="h-6 w-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 dark:from-white dark:via-slate-200 dark:to-slate-400 bg-clip-text text-transparent">
                Smart Call Trust Score
              </h1>
              <span className="px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase rounded-full bg-emerald-500/10 text-emerald-600 dark:bg-emerald-400/20 dark:text-emerald-300 border border-emerald-500/30">
                Academic Demo
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
              Context-Aware Telecom Spam Re-Evaluation System
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Custom Call Inspector Button */}
          <button
            onClick={onOpenCustomCallModal}
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            title="Test scoring on a custom phone number"
          >
            <Plus className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Test Number</span>
          </button>

          {/* Academic Paper Button */}
          <button
            onClick={onOpenAcademicModal}
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-all"
            title="View system architecture & math formulation"
          >
            <BookOpen className="h-3.5 w-3.5 text-emerald-500" />
            <span className="hidden md:inline">Algorithm Overview</span>
          </button>

          {/* Reset Seed Data Button */}
          <button
            onClick={onResetSeedData}
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-all"
            title="Reset dataset to 500 clean synthetic records"
          >
            <RefreshCw className="h-3.5 w-3.5 text-slate-400" />
            <span className="hidden lg:inline">Reset Seed Data</span>
          </button>

          {/* Dark / Light Mode Toggle */}
          <button
            onClick={() => setDarkMode(prev => !prev)}
            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-all"
            aria-label="Toggle light and dark mode"
          >
            {darkMode ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-slate-600" />}
          </button>
        </div>

      </div>
    </header>
  );
};
