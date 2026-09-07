'use client';

import React, { useState } from 'react';
import { X, Plus, Phone, Calculator, ShieldAlert, Zap } from 'lucide-react';
import { CallRecord } from '../lib/types';
import { evaluateTrustScore, getCategoryBadgeStyle } from '../lib/scoring';

interface AddCustomCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCall: (record: CallRecord) => void;
}

export const AddCustomCallModal: React.FC<AddCustomCallModalProps> = ({
  isOpen,
  onClose,
  onAddCall,
}) => {
  const [number, setNumber] = useState<string>('+91-98123-XX456');
  const [callerName, setCallerName] = useState<string>('Custom Inspector Number');
  const [isTaggedSpam, setIsTaggedSpam] = useState<boolean>(true);
  const [spamTagAgeDays, setSpamTagAgeDays] = useState<number>(180);
  const [callsInLast24h, setCallsInLast24h] = useState<number>(3);
  const [hasLongCall, setHasLongCall] = useState<boolean>(true);
  const [isSavedContact, setIsSavedContact] = useState<boolean>(false);
  const [burstCount, setBurstCount] = useState<number>(1);

  if (!isOpen) return null;

  // Construct draft record to preview live scoring result
  const draftRecord: CallRecord = {
    id: `custom-${Date.now()}`,
    callerNumber: number,
    callerName: callerName,
    timestamp: new Date().toISOString(),
    callDuration: 120,
    answered: true,
    isStaticSpamTagged: isTaggedSpam,
    spamTagAgeDays: isTaggedSpam ? spamTagAgeDays : 0,
    callsInLast24h: callsInLast24h,
    hasHistoricalLongCall: hasLongCall,
    isSavedContact: isSavedContact,
    recentBurstCount: burstCount,
  };

  const previewEvaluation = evaluateTrustScore(draftRecord, burstCount >= 3 ? burstCount : undefined);
  const previewBadge = getCategoryBadgeStyle(previewEvaluation.category);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddCall(draftRecord);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-xl rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-6 text-white space-y-5">
        
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <Calculator className="h-5 w-5 text-indigo-400" />
            <h3 className="text-base font-bold text-white">Custom Number Trust Score Inspector</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {/* Form Inputs Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Caller Number</label>
              <input
                type="text"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono focus:outline-none focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Caller Name / Label</label>
              <input
                type="text"
                value={callerName}
                onChange={(e) => setCallerName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Static Spam Tagged?</label>
              <select
                value={isTaggedSpam ? 'true' : 'false'}
                onChange={(e) => setIsTaggedSpam(e.target.value === 'true')}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="true">Yes (Flagged in crowd database)</option>
                <option value="false">No (Clean untagged)</option>
              </select>
            </div>

            {isTaggedSpam && (
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Spam Tag Age (Days)</label>
                <input
                  type="number"
                  min="0"
                  max="730"
                  value={spamTagAgeDays}
                  onChange={(e) => setSpamTagAgeDays(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            )}

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Calls in Last 24 Hours</label>
              <input
                type="number"
                min="1"
                max="100"
                value={callsInLast24h}
                onChange={(e) => setCallsInLast24h(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Burst Calls in 10 Mins</label>
              <input
                type="number"
                min="1"
                max="10"
                value={burstCount}
                onChange={(e) => setBurstCount(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Toggles */}
          <div className="flex flex-wrap items-center gap-4 pt-1">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={hasLongCall}
                onChange={(e) => setHasLongCall(e.target.checked)}
                className="rounded bg-slate-800 border-slate-700 text-indigo-600"
              />
              <span className="text-slate-300">Had 2+ min call in past</span>
            </label>

            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isSavedContact}
                onChange={(e) => setIsSavedContact(e.target.checked)}
                className="rounded bg-slate-800 border-slate-700 text-indigo-600"
              />
              <span className="text-slate-300">Saved in Address Book</span>
            </label>
          </div>

          {/* Live Preview Result Box */}
          <div className="p-4 rounded-2xl bg-slate-850 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-semibold">Real-time Score Calculation:</span>
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${previewBadge.bg} ${previewBadge.text} ${previewBadge.border}`}>
                {previewBadge.icon} {previewEvaluation.category} ({previewEvaluation.trustScore}/100)
              </span>
            </div>
            <p className="text-slate-300 text-[11px] leading-snug">
              {previewEvaluation.reasoning}
            </p>
          </div>

          <div className="flex items-center justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-lg shadow-indigo-600/20"
            >
              Add Record to Dashboard
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
