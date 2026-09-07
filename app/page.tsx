'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { AnalyticsSummary } from '../components/AnalyticsSummary';
import { LiveCallSimulator } from '../components/LiveCallSimulator';
import { CallHistoryTable } from '../components/CallHistoryTable';
import { AcademicModal } from '../components/AcademicModal';
import { AddCustomCallModal } from '../components/AddCustomCallModal';
import { CallRecord } from '../lib/types';
import { 
  getStoredCallRecords, 
  saveCallRecords, 
  resetSeedCallRecords, 
  computeAnalyticsStats 
} from '../lib/storage';
import { ShieldCheck, BookOpen, ExternalLink, Heart } from 'lucide-react';

export default function Home() {
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [records, setRecords] = useState<CallRecord[]>([]);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  // Modals
  const [isAcademicModalOpen, setIsAcademicModalOpen] = useState<boolean>(false);
  const [isCustomCallModalOpen, setIsCustomCallModalOpen] = useState<boolean>(false);

  // Synchronize dark mode class with HTML element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Load records from local storage / seed on mount
  useEffect(() => {
    const loaded = getStoredCallRecords();
    setRecords(loaded);
    setIsLoaded(true);
  }, []);

  const handleSimulateCallAdded = (newRecord: CallRecord) => {
    setRecords((prev) => {
      const updated = [newRecord, ...prev];
      saveCallRecords(updated);
      return updated;
    });
  };

  const handleResetSeedData = () => {
    if (confirm("Reset all call logs to the fresh 500 synthetic seed dataset?")) {
      const fresh = resetSeedCallRecords();
      setRecords(fresh);
    }
  };

  const handleAddCustomRecord = (customRecord: CallRecord) => {
    handleSimulateCallAdded(customRecord);
  };

  // Compute live analytics stats
  const analyticsStats = computeAnalyticsStats(records);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white font-mono text-sm">
        <div className="flex flex-col items-center space-y-3">
          <div className="h-8 w-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
          <span>Initializing Smart Call Trust Engine...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200 flex flex-col">
      
      {/* Top Navbar */}
      <Navbar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onResetSeedData={handleResetSeedData}
        onOpenAcademicModal={() => setIsAcademicModalOpen(true)}
        onOpenCustomCallModal={() => setIsCustomCallModalOpen(true)}
      />

      {/* Main Content Dashboard */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Banner / Hero Section */}
        <div className="relative overflow-hidden p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 shadow-xl text-white">
          <div className="relative z-10 max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
              <ShieldCheck className="h-3.5 w-3.5" />
              Final-Year Academic Research Implementation
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Context-Aware Spam Call Re-Evaluation System
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Traditional static crowd-tagged spam networks (like Airtel AI / Truecaller) cause severe false positives by permanently flagging recycled SIM numbers and emergency repeat calls. This system overlays a dynamic 0–100 Trust Score engine with tag age decay and repeat-call urgency overrides.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => setIsAcademicModalOpen(true)}
                className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/30 transition-all"
              >
                <BookOpen className="h-4 w-4" />
                <span>Read Mathematical Formulation</span>
              </button>
              <button
                onClick={() => setIsCustomCallModalOpen(true)}
                className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition-all"
              >
                <span>Inspect Custom Phone Number</span>
              </button>
            </div>
          </div>
        </div>

        {/* Centerpiece 1: Live Incoming Call Simulator */}
        <section>
          <LiveCallSimulator
            recordsPool={records}
            onSimulateCallAdded={handleSimulateCallAdded}
          />
        </section>

        {/* Centerpiece 2: Analytics Summary Panel & Charts */}
        <section>
          <div className="mb-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              System Analytics & Trust Distribution
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Aggregate performance metrics across {records.length} evaluated call logs.
            </p>
          </div>
          <AnalyticsSummary stats={analyticsStats} />
        </section>

        {/* Centerpiece 3: Call History Data Table & Inspector */}
        <section>
          <CallHistoryTable records={records} />
        </section>

      </main>

      {/* Academic Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              Smart Call Trust Score
            </span>
            <span>— Final Year Academic Project Demo</span>
          </div>

          <div className="flex items-center space-x-4 text-[11px]">
            <button 
              onClick={() => setIsAcademicModalOpen(true)}
              className="hover:underline text-indigo-500 flex items-center gap-1"
            >
              Algorithm Paper <ExternalLink className="h-3 w-3" />
            </button>
            <span>•</span>
            <span>TypeScript + Next.js + Recharts + Tailwind</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AcademicModal
        isOpen={isAcademicModalOpen}
        onClose={() => setIsAcademicModalOpen(false)}
      />

      <AddCustomCallModal
        isOpen={isCustomCallModalOpen}
        onClose={() => setIsCustomCallModalOpen(false)}
        onAddCall={handleAddCustomRecord}
      />

    </div>
  );
}
