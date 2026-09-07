'use client';

import React from 'react';
import { X, BookOpen, ShieldAlert, Zap, CheckCircle2, Award, Cpu } from 'lucide-react';

interface AcademicModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AcademicModal: React.FC<AcademicModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-6 lg:p-8 text-white space-y-6 my-8">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Award className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                Academic Project Overview & Math Model
              </h3>
              <p className="text-xs text-slate-400">
                Context-Aware Spam Call Re-Evaluation System (Final Year Research Demo)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Section 1: Problem Statement */}
        <div className="space-y-2">
          <h4 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
            <ShieldAlert className="h-4 w-4" />
            1. Problem Statement: Static Spam Tag Flaws
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            Existing telecom spam detection networks (e.g., Airtel AI Spam Network, Truecaller crowd databases) tag phone numbers based on static historical reports. Once a number is tagged <code className="bg-slate-800 px-1 py-0.5 rounded text-rose-400">isSpam: true</code>, it stays flagged indefinitely.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-xs">
            <div className="p-3 rounded-xl bg-slate-850 border border-slate-800">
              <strong className="text-rose-400 block mb-1">Recycled SIM Issue</strong>
              Telecom operators recycle inactive SIM numbers after 90–180 days. A new subscriber inherits an old spam flag, silencing legitimate calls.
            </div>
            <div className="p-3 rounded-xl bg-slate-850 border border-slate-800">
              <strong className="text-purple-400 block mb-1">Emergency Silencing</strong>
              A family member or doctor calling repeatedly from an unfamiliar/tagged number gets blocked during urgent emergencies.
            </div>
          </div>
        </div>

        {/* Section 2: Mathematical Scoring Formulation */}
        <div className="space-y-3 pt-3 border-t border-slate-800">
          <h4 className="text-sm font-bold text-indigo-400 flex items-center gap-2">
            <Cpu className="h-4 w-4" />
            2. Proposed Dynamic Scoring Formulation
          </h4>
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs text-indigo-200 overflow-x-auto">
            {"TrustScore = Clamp_0^100 ( BaseScore + TagAgeDecay + RelationshipTrust - FrequencyPenalty + UrgencyOverride )"}
          </div>
          
          <div className="space-y-2 text-xs text-slate-300">
            <p>
              <strong className="text-white">• Tag Age Exponential Decay:</strong> For tagged numbers, penalty decays over time using:
            </p>
            <div className="p-2.5 rounded-xl bg-slate-850 font-mono text-[11px] text-emerald-400">
              {"DecayBonus = 45 × ( 1 - exp(-0.012 × TagAgeInDays) )"}
            </div>
            <p className="text-[11px] text-slate-400">
              At 270 days (9 months), the decay model recovers +43.2 points, effectively rescuing recycled numbers.
            </p>

            <p className="pt-2">
              <strong className="text-white">• Urgency Burst Override:</strong> If <code className="bg-slate-800 px-1 py-0.5 rounded text-purple-300">BurstCount ≥ 3</code> within 10 minutes:
            </p>
            <div className="p-2.5 rounded-xl bg-slate-850 font-mono text-[11px] text-purple-300">
              {"UrgencyBoost = +45 pts  ==> Category forced to 'Possibly Urgent'"}
            </div>
          </div>
        </div>

        {/* Section 3: Comparative Benefits Table */}
        <div className="space-y-2 pt-3 border-t border-slate-800">
          <h4 className="text-sm font-bold text-amber-400 flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            3. Comparison: Static Crowd Tag vs Dynamic Trust Score
          </h4>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="py-2 px-3">Feature</th>
                  <th className="py-2 px-3 text-rose-400">Static Telecom Tagging</th>
                  <th className="py-2 px-3 text-emerald-400">Smart Call Trust Engine</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                <tr>
                  <td className="py-2 px-3 font-semibold">Evaluation Mode</td>
                  <td className="py-2 px-3">Binary (Spam / Not Spam)</td>
                  <td className="py-2 px-3 font-bold text-emerald-400">Dynamic 0–100 Trust Score</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-semibold">Recycled Number Handling</td>
                  <td className="py-2 px-3 text-rose-400">Permanently tagged false positive</td>
                  <td className="py-2 px-3 text-emerald-400">Exponential decay rescues tag</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-semibold">Urgent Call Overrides</td>
                  <td className="py-2 px-3 text-rose-400">Silenced without bypass</td>
                  <td className="py-2 px-3 text-purple-400 font-bold">3+ Burst override badge</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-semibold">Context Awareness</td>
                  <td className="py-2 px-3">Global crowd reports only</td>
                  <td className="py-2 px-3">Local user history + call duration</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-lg shadow-indigo-600/20"
          >
            Got it, Back to Demo
          </button>
        </div>

      </div>
    </div>
  );
};
