import React from 'react';
import { 
  CheckCircle2, 
  Activity, 
  Terminal, 
  RefreshCw, 
  FileCheck, 
  Sparkles,
  HelpCircle,
  ShieldCheck,
  Clock
} from 'lucide-react';
import { ActivityLogItem } from '../types';

interface AIActivityFeedProps {
  activities: ActivityLogItem[];
  isInvestigating?: boolean;
}

export const AIActivityFeed: React.FC<AIActivityFeedProps> = ({
  activities,
  isInvestigating = false
}) => {
  const getActivityIcon = (type: ActivityLogItem['type']) => {
    switch (type) {
      case 'upload':
        return <FileCheck className="w-3.5 h-3.5 text-cyan-700" />;
      case 'ai_analysis':
        return <Sparkles className="w-3.5 h-3.5 text-purple-600" />;
      case 'timeline':
        return <Clock className="w-3.5 h-3.5 text-blue-600" />;
      case 'uncertainty':
        return <HelpCircle className="w-3.5 h-3.5 text-amber-600" />;
      case 'tool_call':
        return <Terminal className="w-3.5 h-3.5 text-cyan-700" />;
      case 'reassessment':
        return <RefreshCw className="w-3.5 h-3.5 text-amber-700" />;
      case 'verification':
      case 'feedback':
        return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />;
      default:
        return <Activity className="w-3.5 h-3.5 text-slate-500" />;
    }
  };

  return (
    <div id="ai-activity-feed" className="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-2xl p-4 shadow-xs">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-700" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Investigation Activity Feed
          </h3>
        </div>
        <span className="text-[10px] font-mono text-slate-500">Observable Actions Only</span>
      </div>

      <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
        {activities.map((item, idx) => (
          <div 
            key={item.id || idx}
            className="flex items-start gap-2.5 text-xs p-2.5 rounded-xl bg-slate-50/80 border border-slate-200 backdrop-blur-md hover:bg-white transition-colors"
          >
            <div className="mt-0.5 shrink-0">
              {getActivityIcon(item.type)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold text-slate-900">{item.action}</span>
                <span className="font-mono text-[10px] text-slate-500 shrink-0">{item.timestamp}</span>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed mt-0.5">{item.detail}</p>
            </div>
          </div>
        ))}

        {isInvestigating && (
          <div className="flex items-center gap-2.5 text-xs p-2.5 rounded-xl bg-cyan-50 border border-cyan-300 backdrop-blur-md animate-pulse">
            <RefreshCw className="w-3.5 h-3.5 text-cyan-700 animate-spin" />
            <span className="text-cyan-900 font-semibold">Checking access records because authorization is unclear...</span>
          </div>
        )}
      </div>
    </div>
  );
};
