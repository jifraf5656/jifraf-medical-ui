import React from 'react';
import { Activity, ShieldCheck, Database, Zap, FileText, Server } from 'lucide-react';

export function AnalyzerAdapterStatusPanel() {
  const adapters = [
    { id: 'ekg', name: 'EKG analyzer', type: 'metadata only', icon: Activity, status: 'STUB' },
    { id: 'rad', name: 'Radyoloji analyzer', type: 'metadata only', icon: ShieldCheck, status: 'STUB' },
    { id: 'lung', name: 'Solunum sesi analyzer', type: 'metadata only', icon: Zap, status: 'STUB' },
    { id: 'heart', name: 'Kalp sesi analyzer', type: 'metadata only', icon: Activity, status: 'STUB' },
    { id: 'lab', name: 'Lab analyzer', type: 'structured values only', icon: Database, status: 'STUB' },
    { id: 'note', name: 'Klinik not analyzer', type: 'text metadata only', icon: FileText, status: 'STUB' }
  ];

  return (
    <div className="bg-[#020d20] border border-slate-700/50 rounded-xl p-4 shadow-[0_0_15px_rgba(0,0,0,0.2)]">
      <h3 className="text-sm font-bold text-slate-200 uppercase tracking-widest font-mono mb-4 flex items-center gap-2">
        <Server className="w-4 h-4 text-cyan-400" />
        Analyzer Adapter Status
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {adapters.map((adapter) => (
          <div key={adapter.id} className="bg-[#0a1128] border border-slate-800 rounded-lg p-3">
            <div className="flex justify-between items-center mb-2 border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <adapter.icon className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-bold text-slate-300">{adapter.name}</span>
              </div>
              <span className="text-[10px] font-mono bg-cyan-950/40 text-cyan-400 border border-cyan-500/20 px-2 py-0.5 rounded">
                {adapter.status}
              </span>
            </div>
            <div className="text-[10px] text-slate-500 font-mono mb-2">Input Mode: <span className="text-slate-400">{adapter.type}</span></div>
            <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
              <div className="flex items-center justify-between bg-slate-900/50 p-1.5 rounded">
                <span className="text-slate-500">Real Recog:</span>
                <span className="text-emerald-500 font-bold">NO</span>
              </div>
              <div className="flex items-center justify-between bg-slate-900/50 p-1.5 rounded">
                <span className="text-slate-500">External AI:</span>
                <span className="text-emerald-500 font-bold">NO</span>
              </div>
              <div className="flex items-center justify-between bg-slate-900/50 p-1.5 rounded">
                <span className="text-slate-500">Training:</span>
                <span className="text-emerald-500 font-bold">NO</span>
              </div>
              <div className="flex items-center justify-between bg-slate-900/50 p-1.5 rounded">
                <span className="text-slate-500">Live Connect:</span>
                <span className="text-emerald-500 font-bold">NO</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
