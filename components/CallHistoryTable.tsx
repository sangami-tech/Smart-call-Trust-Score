'use client';

import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  Sparkles, 
  ShieldAlert, 
  ShieldCheck, 
  Clock, 
  Phone, 
  Eye,
  X,
  UserCheck,
  Zap
} from 'lucide-react';
import { CallRecord, TrustScoreCategory, TrustEvaluation } from '../lib/types';
import { evaluateTrustScore, getCategoryBadgeStyle } from '../lib/scoring';

interface CallHistoryTableProps {
  records: CallRecord[];
}

type SortField = 'timestamp' | 'trustScore' | 'callDuration' | 'spamTagAgeDays';
type SortOrder = 'asc' | 'desc';

export const CallHistoryTable: React.FC<CallHistoryTableProps> = ({ records }) => {
  // State for search, filter, sorting, and selected record for detail modal
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('All');
  const [sortField, setSortField] = useState<SortField>('timestamp');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [selectedRecordForDetail, setSelectedRecordForDetail] = useState<CallRecord | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 12;

  // Filter & Sort Pipeline
  const filteredAndSortedRecords = useMemo(() => {
    return records
      .map((rec) => ({
        rec,
        eval: evaluateTrustScore(rec),
      }))
      .filter(({ rec, eval: evalRes }) => {
        // Search Query Filter
        const queryLower = searchQuery.toLowerCase();
        const matchesQuery = 
          rec.callerNumber.toLowerCase().includes(queryLower) ||
          (rec.callerName && rec.callerName.toLowerCase().includes(queryLower));

        if (!matchesQuery) return false;

        // Category Filter
        if (selectedCategoryFilter === 'All') return true;
        if (selectedCategoryFilter === 'Rescued Only') return evalRes.isRescued;
        return evalRes.category === selectedCategoryFilter;
      })
      .sort((a, b) => {
        let valA: number;
        let valB: number;

        if (sortField === 'timestamp') {
          valA = new Date(a.rec.timestamp).getTime();
          valB = new Date(b.rec.timestamp).getTime();
        } else if (sortField === 'trustScore') {
          valA = a.eval.trustScore;
          valB = b.eval.trustScore;
        } else if (sortField === 'callDuration') {
          valA = a.rec.callDuration;
          valB = b.rec.callDuration;
        } else {
          valA = a.rec.spamTagAgeDays;
          valB = b.rec.spamTagAgeDays;
        }

        return sortOrder === 'asc' ? valA - valB : valB - valA;
      });
  }, [records, searchQuery, selectedCategoryFilter, sortField, sortOrder]);

  // Paginated View
  const totalPages = Math.ceil(filteredAndSortedRecords.length / pageSize) || 1;
  const paginatedItems = filteredAndSortedRecords.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleSortToggle = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const categoryOptions = ['All', 'Likely Safe', 'Uncertain', 'Likely Spam', 'Possibly Urgent', 'Rescued Only'];

  return (
    <div className="space-y-4">
      
      {/* Header & Filter Bar */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Phone className="h-5 w-5 text-indigo-500" />
              Call Logs & Trust Evaluation History
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Filterable dataset of {records.length} records. Click any row to inspect mathematical parameters.
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search number or caller..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Filter Tabs Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <span className="text-xs font-semibold text-slate-400 flex items-center gap-1 mr-1">
            <Filter className="h-3.5 w-3.5" /> Filter:
          </span>
          {categoryOptions.map((cat) => {
            const isActive = selectedCategoryFilter === cat;
            return (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategoryFilter(cat);
                  setCurrentPage(1);
                }}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {cat === 'Rescued Only' ? '✨ Rescued Only' : cat}
              </button>
            );
          })}
        </div>

      </div>

      {/* Table Container */}
      <div className="overflow-x-auto rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 dark:bg-slate-850 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider">
            <tr>
              <th className="py-3.5 px-4">Caller Details</th>
              <th className="py-3.5 px-4">Static Spam Flag</th>
              <th 
                className="py-3.5 px-4 cursor-pointer hover:text-slate-900 dark:hover:text-white"
                onClick={() => handleSortToggle('trustScore')}
              >
                <div className="flex items-center gap-1">
                  <span>Trust Score</span>
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </th>
              <th className="py-3.5 px-4">Category Tier</th>
              <th className="py-3.5 px-4">Contextual Reasoning</th>
              <th 
                className="py-3.5 px-4 cursor-pointer hover:text-slate-900 dark:hover:text-white"
                onClick={() => handleSortToggle('timestamp')}
              >
                <div className="flex items-center gap-1">
                  <span>Time</span>
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </th>
              <th className="py-3.5 px-4 text-right">Inspect</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-slate-700 dark:text-slate-300">
            {paginatedItems.length > 0 ? (
              paginatedItems.map(({ rec, eval: evalRes }) => {
                const badge = getCategoryBadgeStyle(evalRes.category);
                return (
                  <tr 
                    key={rec.id}
                    onClick={() => setSelectedRecordForDetail(rec)}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                  >
                    {/* Caller Info */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-2.5">
                        <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-mono font-bold text-indigo-500">
                          {rec.callerName ? rec.callerName.charAt(0) : '#'}
                        </div>
                        <div>
                          <div className="font-mono font-bold text-slate-900 dark:text-white flex items-center gap-1">
                            {rec.callerNumber}
                            {rec.isSavedContact && (
                              <span title="Address Book Contact">
                                <UserCheck className="h-3.5 w-3.5 text-emerald-500 inline" />
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400 truncate max-w-[150px]">
                            {rec.callerName || 'Unknown Caller'}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Static Tag */}
                    <td className="py-3.5 px-4">
                      {rec.isStaticSpamTagged ? (
                        <div className="flex flex-col items-start">
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded bg-rose-500/10 text-rose-500 border border-rose-500/20">
                            <ShieldAlert className="h-3 w-3" /> Flagged Spam
                          </span>
                          <span className="text-[10px] text-slate-400 mt-0.5 font-mono">
                            Age: {rec.spamTagAgeDays} days
                          </span>
                        </div>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                          <ShieldCheck className="h-3 w-3" /> Clean
                        </span>
                      )}
                    </td>

                    {/* Trust Score */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-black text-sm text-slate-900 dark:text-white">
                          {evalRes.trustScore}
                        </span>
                        <div className="w-16 bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className="h-full rounded-full transition-all"
                            style={{ 
                              width: `${evalRes.trustScore}%`,
                              backgroundColor: badge.text.includes('emerald') 
                                ? '#10B981' 
                                : badge.text.includes('amber') 
                                ? '#F59E0B' 
                                : badge.text.includes('purple')
                                ? '#8B5CF6'
                                : '#EF4444'
                            }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Category Badge */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col items-start gap-1">
                        <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full border ${badge.bg} ${badge.text} ${badge.border}`}>
                          <span>{badge.icon}</span>
                          <span>{evalRes.category}</span>
                        </span>
                        {evalRes.isRescued && (
                          <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-emerald-500">
                            <Sparkles className="h-2.5 w-2.5" /> Rescued from Spam Tag
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Contextual Reasoning */}
                    <td className="py-3.5 px-4 max-w-xs">
                      <p className="text-slate-600 dark:text-slate-300 text-[11px] line-clamp-2 leading-relaxed">
                        {evalRes.reasoning}
                      </p>
                    </td>

                    {/* Time */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-slate-400 text-[11px]">
                      {new Date(rec.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </td>

                    {/* Inspect Button */}
                    <td className="py-3.5 px-4 text-right">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedRecordForDetail(rec);
                        }}
                        className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
                        title="View Detailed Math Parameters"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </button>
                    </td>

                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-400 text-xs">
                  No call records match your current search or filter criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <span>
            Showing {paginatedItems.length} of {filteredAndSortedRecords.length} records
          </span>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 disabled:opacity-40"
            >
              Previous
            </button>
            <span className="font-semibold text-slate-900 dark:text-white">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>

      </div>

      {/* Record Detail Modal */}
      {selectedRecordForDetail && (
        <DetailInspectionModal
          record={selectedRecordForDetail}
          onClose={() => setSelectedRecordForDetail(null)}
        />
      )}

    </div>
  );
};

interface DetailInspectionModalProps {
  record: CallRecord;
  onClose: () => void;
}

const DetailInspectionModal: React.FC<DetailInspectionModalProps> = ({ record, onClose }) => {
  const evalRes = evaluateTrustScore(record);
  const badge = getCategoryBadgeStyle(evalRes.category);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
      <div className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-6 text-white space-y-5">
        
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h4 className="text-base font-bold flex items-center gap-2">
              <Phone className="h-4 w-4 text-indigo-400" />
              Call Record Deep Inspection
            </h4>
            <p className="text-xs text-slate-400 font-mono mt-0.5">{record.callerNumber}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Score & Category Banner */}
        <div className="p-4 rounded-2xl bg-slate-850 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-400 uppercase font-semibold">Final Trust Score</span>
            <div className="text-3xl font-black font-mono text-white mt-0.5">
              {evalRes.trustScore} <span className="text-sm font-normal text-slate-400">/ 100</span>
            </div>
          </div>
          <span className={`px-3 py-1.5 rounded-full text-xs font-bold border ${badge.bg} ${badge.text} ${badge.border}`}>
            {badge.icon} {evalRes.category}
          </span>
        </div>

        {/* Parameters Grid */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-800">
            <span className="text-slate-400 text-[10px]">Static Spam Flag:</span>
            <p className="font-semibold text-white mt-0.5">
              {record.isStaticSpamTagged ? `Yes (${record.spamTagAgeDays} days old)` : 'No (Clean)'}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-800">
            <span className="text-slate-400 text-[10px]">24h Call Velocity:</span>
            <p className="font-semibold text-white mt-0.5">
              {record.callsInLast24h} call attempts
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-800">
            <span className="text-slate-400 text-[10px]">Past 2+ Min Long Call:</span>
            <p className="font-semibold text-white mt-0.5">
              {record.hasHistoricalLongCall ? 'Yes (+35 pts bonus)' : 'No'}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-800">
            <span className="text-slate-400 text-[10px]">Saved Contact:</span>
            <p className="font-semibold text-white mt-0.5">
              {record.isSavedContact ? 'Yes (+45 base bonus)' : 'No'}
            </p>
          </div>
        </div>

        {/* Reasoning Note */}
        <div className="p-3.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-200">
          <span className="font-bold text-indigo-300 block mb-1">Reasoning Output:</span>
          {evalRes.reasoning}
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-lg shadow-indigo-600/20"
        >
          Close Inspection
        </button>

      </div>
    </div>
  );
};
