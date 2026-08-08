// ============================================================
// LOGS COMPONENT
// ============================================================

import { Terminal, Info, AlertTriangle, XCircle, CheckCircle } from 'lucide-react';
import { LogEntry } from '../types';
import { format } from 'date-fns';

interface LogsProps {
  logs: LogEntry[];
}

export const Logs = ({ logs }: LogsProps) => {
  const getLogIcon = (level: LogEntry['level']) => {
    switch (level) {
      case 'INFO':
        return <Info className="w-4 h-4 text-blue-400" />;
      case 'WARN':
        return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      case 'ERROR':
        return <XCircle className="w-4 h-4 text-red-400" />;
      case 'SUCCESS':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      default:
        return <Info className="w-4 h-4 text-slate-400" />;
    }
  };

  const getLogColor = (level: LogEntry['level']) => {
    switch (level) {
      case 'INFO':
        return 'text-blue-400';
      case 'WARN':
        return 'text-yellow-400';
      case 'ERROR':
        return 'text-red-400';
      case 'SUCCESS':
        return 'text-green-400';
      default:
        return 'text-slate-400';
    }
  };

  // Show logs in reverse order (newest first)
  const reversedLogs = [...logs].reverse();

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-700/50 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center">
          <Terminal className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-white">System Logs</h2>
          <p className="text-sm text-slate-400">{logs.length} log entries</p>
        </div>
      </div>

      <div className="max-h-96 overflow-y-auto font-mono text-sm">
        {reversedLogs.length === 0 ? (
          <div className="p-6 text-center text-slate-400">
            No logs yet. Click "Update Everything" to start.
          </div>
        ) : (
          <div className="divide-y divide-slate-700/30">
            {reversedLogs.map((log, idx) => (
              <div 
                key={idx} 
                className="px-4 py-3 hover:bg-slate-700/30 transition-colors flex items-start gap-3"
              >
                {getLogIcon(log.level)}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-medium ${getLogColor(log.level)}`}>
                      [{log.level}]
                    </span>
                    <span className="text-xs text-purple-400">
                      {log.module}
                    </span>
                    <span className="text-xs text-slate-500">
                      {format(new Date(log.timestamp), 'HH:mm:ss.SSS')}
                    </span>
                  </div>
                  <p className="text-slate-300 break-words">{log.message}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
