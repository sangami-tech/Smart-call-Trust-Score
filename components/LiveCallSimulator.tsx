'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PhoneIncoming, 
  PhoneCall, 
  PhoneOff, 
  Zap, 
  ShieldAlert, 
  ShieldCheck, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  RefreshCcw,
  UserCheck,
  History,
  AlertCircle
} from 'lucide-react';
import { CallRecord, PresetScenario, TrustEvaluation } from '../lib/types';
import { evaluateTrustScore, getCategoryBadgeStyle } from '../lib/scoring';
import { PRESET_SCENARIOS } from '../lib/seedData';

interface LiveCallSimulatorProps {
  recordsPool: CallRecord[];
  onSimulateCallAdded: (record: CallRecord) => void;
}

export const LiveCallSimulator: React.FC<LiveCallSimulatorProps> = ({
  recordsPool,
  onSimulateCallAdded,
}) => {
  // Simulator State
  const [currentCall, setCurrentCall] = useState<CallRecord>(PRESET_SCENARIOS[0].sampleRecord);
  const [burstModeToggle, setBurstModeToggle] = useState<boolean>(false);
  const [showMathDetails, setShowMathDetails] = useState<boolean>(true);
  const [callActionStatus, setCallActionStatus] = useState<'idle' | 'accepted' | 'declined'>('idle');

  // Compute evaluation score in real-time
  const evaluation: TrustEvaluation = evaluateTrustScore(
    currentCall, 
    burstModeToggle ? 4 : undefined
  );

  const badgeStyle = getCategoryBadgeStyle(evaluation.category);

  // Trigger random call simulation
  const handleRandomSimulate = () => {
    setCallActionStatus('idle');
    const randomIndex = Math.floor(Math.random() * recordsPool.length);
    const randomRec = recordsPool[randomIndex];
    const updatedRec: CallRecord = {
      ...randomRec,
      id: `sim-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    setCurrentCall(updatedRec);
    onSimulateCallAdded(updatedRec);
  };

  // Trigger preset scenario
  const handleSelectPreset = (preset: PresetScenario) => {
    setCallActionStatus('idle');
    setBurstModeToggle(preset.id === 'urgent_burst');
    const newRec: CallRecord = {
      ...preset.sampleRecord,
      id: `sim-preset-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    setCurrentCall(newRec);
    onSimulateCallAdded(newRec);
  };

  const handleAcceptCall = () => {
    setCallActionStatus('accepted');
  };

  const handleDeclineCall = () => {
    setCallActionStatus('declined');
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-slate-800 shadow-2xl p-6 lg:p-8 text-white">
      
      {/* Background Decorative Glow */}
      <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Controls Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              Live Incoming Call Simulator
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time context-aware trust re-evaluation engine demo
          </p>
        </div>

        {/* Action Presets & Trigger Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleRandomSimulate}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-xs font-semibold shadow-lg shadow-emerald-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <RefreshCcw className="h-3.5 w-3.5" />
            <span>Simulate Random Call</span>
          </button>

          {/* Urgency Burst Override Toggle Switch */}
          <div className="flex items-center space-x-2 px-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700">
            <Zap className={`h-4 w-4 ${burstModeToggle ? 'text-purple-400 animate-bounce' : 'text-slate-400'}`} />
            <span className="text-xs font-medium text-slate-200">Force 4-Call Burst</span>
            <button
              onClick={() => setBurstModeToggle(!burstModeToggle)}
              className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                burstModeToggle ? 'bg-purple-600' : 'bg-slate-700'
              }`}
              role="switch"
              aria-checked={burstModeToggle}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  burstModeToggle ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Preset Scenario Selector Tabs */}
      <div className="py-4">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
          Quick Edge-Case Demo Scenarios:
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {PRESET_SCENARIOS.map((preset) => {
            const isSelected = currentCall.scenarioCategory === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => handleSelectPreset(preset)}
                className={`p-2.5 rounded-xl text-left border text-xs transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-slate-800 border-indigo-500/60 shadow-lg shadow-indigo-500/10'
                    : 'bg-slate-900/50 border-slate-800 hover:bg-slate-800/60 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-slate-200 truncate">{preset.title}</span>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded border ${preset.badgeColor}`}>
                    {preset.badge}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 line-clamp-1">{preset.subtitle}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Centerpiece Phone Card & Trust Evaluation Split Layout */}
      <div className="mt-4 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Side: Animated Phone Display (5 cols) */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="relative w-full max-w-sm p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl flex flex-col items-center text-center">
            
            {/* Animated Ringing Pulse Rings */}
            <div className="relative mb-6">
              <motion.div
                animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
                transition={{ duration: 2, repeat: Infinity }}
                className={`absolute inset-0 rounded-full border-2 ${
                  evaluation.isUrgencyOverride
                    ? 'border-purple-500/60'
                    : evaluation.trustScore >= 70
                    ? 'border-emerald-500/60'
                    : evaluation.trustScore >= 40
                    ? 'border-amber-500/60'
                    : 'border-rose-500/60'
                }`}
              />
              <motion.div
                animate={{ scale: [1, 1.25, 1], opacity: [0.8, 0.2, 0.8] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute inset-0 rounded-full bg-slate-800/40"
              />

              {/* Avatar Icon */}
              <div className={`relative z-10 h-24 w-24 rounded-full flex items-center justify-center border-4 shadow-xl ${
                evaluation.isUrgencyOverride
                  ? 'bg-purple-600/20 border-purple-500 text-purple-400'
                  : evaluation.trustScore >= 70
                  ? 'bg-emerald-600/20 border-emerald-500 text-emerald-400'
                  : evaluation.trustScore >= 40
                  ? 'bg-amber-600/20 border-amber-500 text-amber-400'
                  : 'bg-rose-600/20 border-rose-500 text-rose-400'
              }`}>
                {currentCall.isSavedContact ? (
                  <UserCheck className="h-10 w-10" />
                ) : evaluation.isUrgencyOverride ? (
                  <Zap className="h-10 w-10 animate-pulse" />
                ) : (
                  <PhoneIncoming className="h-10 w-10 animate-bounce" />
                )}
              </div>
            </div>

            {/* Caller Number & Name */}
            <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
              Incoming Call Attempt
            </span>
            <h3 className="text-xl font-extrabold text-white mt-1 font-mono tracking-tight">
              {currentCall.callerNumber}
            </h3>
            <p className="text-xs text-slate-300 font-medium mt-0.5">
              {currentCall.callerName || 'Unknown Caller'}
            </p>

            {/* Static Tag Warning versus Rescued Status */}
            <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5">
              {currentCall.isStaticSpamTagged ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  <ShieldAlert className="h-3 w-3" />
                  Static Spam Flag ({currentCall.spamTagAgeDays}d old)
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  <ShieldCheck className="h-3 w-3 text-emerald-400" />
                  No Crowd Spam Flags
                </span>
              )}

              {evaluation.isRescued && (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 animate-pulse">
                  <Sparkles className="h-3 w-3 text-emerald-400" />
                  Rescued from Static Spam!
                </span>
              )}
            </div>

            {/* Accept / Decline Interactive Actions */}
            <div className="mt-6 w-full grid grid-cols-2 gap-3">
              <button
                onClick={handleDeclineCall}
                disabled={callActionStatus !== 'idle'}
                className="flex items-center justify-center space-x-2 py-3 rounded-2xl bg-rose-600/90 hover:bg-rose-600 text-white font-bold text-xs shadow-lg shadow-rose-600/30 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
              >
                <PhoneOff className="h-4 w-4" />
                <span>Decline</span>
              </button>

              <button
                onClick={handleAcceptCall}
                disabled={callActionStatus !== 'idle'}
                className="flex items-center justify-center space-x-2 py-3 rounded-2xl bg-emerald-600/90 hover:bg-emerald-600 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
              >
                <PhoneCall className="h-4 w-4" />
                <span>Accept</span>
              </button>
            </div>

            {/* Action Feedback Banner */}
            <AnimatePresence>
              {callActionStatus !== 'idle' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`mt-4 w-full p-2.5 rounded-xl text-xs font-semibold text-center ${
                    callActionStatus === 'accepted'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  }`}
                >
                  {callActionStatus === 'accepted' ? 'Call Answered ✅' : 'Call Blocked / Declined 🚫'}
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </div>

        {/* Right Side: Trust Score Engine Live Calculations (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Dynamic Trust Score Card */}
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Computed Trust Score
                </span>
                <div className="flex items-baseline space-x-3 mt-1">
                  <motion.span
                    key={evaluation.trustScore}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-5xl font-black font-mono tracking-tight text-white"
                  >
                    {evaluation.trustScore}
                  </motion.span>
                  <span className="text-slate-500 text-lg font-bold">/ 100</span>
                </div>
              </div>

              {/* Category Badge */}
              <div className="flex flex-col items-start sm:items-end">
                <span className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold border shadow-md ${badgeStyle.bg} ${badgeStyle.text} ${badgeStyle.border}`}>
                  <span>{badgeStyle.icon}</span>
                  <span>{evaluation.category}</span>
                </span>
                {evaluation.isUrgencyOverride && (
                  <span className="text-[11px] text-purple-400 font-medium mt-1 animate-pulse">
                    ⚡ 3+ Burst Calls Bypassed Silence
                  </span>
                )}
              </div>

            </div>

            {/* Reasoning Text Line */}
            <div className="mt-4 p-3.5 rounded-2xl bg-slate-850/80 border border-slate-800 text-xs text-slate-200 font-medium leading-relaxed">
              <span className="text-slate-400 font-bold mr-1">Algorithm Decision:</span>
              {evaluation.reasoning}
            </div>

            {/* Trust vs Risk Signals List */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              
              {/* Trust Factors */}
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-1.5">
                <span className="font-bold text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5" /> Positive Trust Signals:
                </span>
                {evaluation.trustFactors.length > 0 ? (
                  evaluation.trustFactors.map((f, i) => (
                    <p key={i} className="text-slate-300 text-[11px] leading-tight">• {f}</p>
                  ))
                ) : (
                  <p className="text-slate-400 text-[11px]">No positive historical signals found.</p>
                )}
              </div>

              {/* Risk Factors */}
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 space-y-1.5">
                <span className="font-bold text-rose-400 flex items-center gap-1">
                  <AlertCircle className="h-3.5 w-3.5" /> Risk Signals & Penalties:
                </span>
                {evaluation.riskFactors.length > 0 ? (
                  evaluation.riskFactors.map((f, i) => (
                    <p key={i} className="text-slate-300 text-[11px] leading-tight">• {f}</p>
                  ))
                ) : (
                  <p className="text-slate-400 text-[11px]">No behavioral risk penalties triggered.</p>
                )}
              </div>

            </div>

          </div>

          {/* Mathematical Score Breakdown Accordion */}
          <div className="rounded-2xl bg-slate-900/60 border border-slate-800 overflow-hidden">
            <button
              onClick={() => setShowMathDetails(!showMathDetails)}
              className="w-full p-4 flex items-center justify-between text-xs font-bold text-slate-300 hover:bg-slate-850/50 transition-colors"
            >
              <span className="flex items-center gap-2">
                <History className="h-4 w-4 text-indigo-400" />
                Mathematical Formula Breakdown ({evaluation.trustScore} pts sum)
              </span>
              {showMathDetails ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>

            {showMathDetails && (
              <div className="p-4 pt-0 border-t border-slate-800 text-xs space-y-2 font-mono">
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Base Tag Score:</span>
                  <span className="text-white font-bold">{evaluation.breakdown.baseScore} pts</span>
                </div>

                {evaluation.breakdown.tagAgeDecayBonus > 0 && (
                  <div className="flex justify-between py-1 border-b border-slate-800/60 text-emerald-400">
                    <span>Tag Age Exponential Decay Bonus (+):</span>
                    <span>+{evaluation.breakdown.tagAgeDecayBonus} pts</span>
                  </div>
                )}

                {evaluation.breakdown.historicalTrustBonus > 0 && (
                  <div className="flex justify-between py-1 border-b border-slate-800/60 text-emerald-400">
                    <span>Historical Long-Call Relationship (+):</span>
                    <span>+{evaluation.breakdown.historicalTrustBonus} pts</span>
                  </div>
                )}

                {evaluation.breakdown.urgencyOverrideBonus > 0 && (
                  <div className="flex justify-between py-1 border-b border-slate-800/60 text-purple-400 font-bold">
                    <span>Urgency Burst Override Boost (+):</span>
                    <span>+{evaluation.breakdown.urgencyOverrideBonus} pts</span>
                  </div>
                )}

                {evaluation.breakdown.frequencyPenalty > 0 && (
                  <div className="flex justify-between py-1 border-b border-slate-800/60 text-rose-400">
                    <span>Call Velocity Penalty (-):</span>
                    <span>-{evaluation.breakdown.frequencyPenalty} pts</span>
                  </div>
                )}

                {evaluation.breakdown.durationPenalty > 0 && (
                  <div className="flex justify-between py-1 border-b border-slate-800/60 text-rose-400">
                    <span>Micro-Duration Robocall Penalty (-):</span>
                    <span>-{evaluation.breakdown.durationPenalty} pts</span>
                  </div>
                )}

                <div className="flex justify-between pt-2 text-white font-bold">
                  <span>Final Clamped Score (0 - 100):</span>
                  <span className="text-indigo-400 text-sm">{evaluation.trustScore} / 100</span>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
