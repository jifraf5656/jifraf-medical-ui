import React from 'react';
import { Network, ArrowRight } from 'lucide-react';

export function LearningPipelineStatusCard() {
  const steps = [
    { name: 'Intake/Governance', status: 'LOCKED' },
    { name: 'Pattern Memory', status: 'LOCKED' },
    { name: 'Expert Review', status: 'LOCKED' },
    { name: 'Similarity Sandbox', status: 'LOCKED' },
    { name: 'Feature Bridge', status: 'LOCKED' },
    { name: 'Advisory Report', status: 'READY' }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'READY': return 'text-emerald-400 bg-emerald-950/40 border-emerald-500/20';
      case 'LOCKED': return 'text-cyan-400 bg-cyan-950/40 border-cyan-500/20';
      case 'PENDING': return 'text-amber-400 bg-amber-950/40 border-amber-500/20';
      case 'NEEDS_REVIEW': return 'text-amber-400 bg-amber-950/40 border-amber-500/20';
      case 'BLOCKED': return 'text-red-400 bg-red-950/40 border-red-500/20';
      default: return 'text-slate-400 bg-slate-900/50 border-slate-800';
    }
  };

  return (
    <div className="bg-[#020d20] border border-slate-700/50 rounded-xl p-4 shadow-[0_0_15px_rgba(0,0,0,0.2)] mb-4 overflow-x-auto">
      <h3 className="text-sm font-bold text-slate-200 uppercase tracking-widest font-mono mb-4 flex items-center gap-2">
        <Network className="w-4 h-4 text-cyan-400" />
        Current Chain Display
      </h3>
      <div className="flex items-center flex-nowrap min-w-max gap-2 text-xs font-mono font-bold">
        {steps.map((step, idx) => (
          <React.Fragment key={step.name}>
            <div className={`px-2 py-1.5 rounded border flex flex-col gap-1 items-center justify-center min-w-[120px] ${getStatusColor(step.status)}`}>
              <span className="text-[10px] text-slate-300 font-sans tracking-wide">{step.name}</span>
              <span>{step.status}</span>
            </div>
            {idx < steps.length - 1 && <ArrowRight className="w-4 h-4 text-slate-600 shrink-0" />}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
