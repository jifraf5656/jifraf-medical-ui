import React from 'react';
import { Lock, Info } from 'lucide-react';
import { LearningPipelineStatusCard } from './LearningPipelineStatusCard';
import { AnalyzerAdapterStatusPanel } from './AnalyzerAdapterStatusPanel';

export function LearningReviewDashboard() {
  const safetyLocks = [
    { name: 'Otomatik eğitim', value: 'KAPALI' },
    { name: 'Fine-tuning', value: 'KAPALI' },
    { name: 'Vector DB', value: 'KAPALI' },
    { name: 'Embedding', value: 'KAPALI' },
    { name: 'External AI', value: 'KAPALI' },
    { name: 'Canlı AI davranış değişikliği', value: 'KAPALI' },
    { name: 'Üretim belleğine yazma', value: 'KAPALI' }
  ];

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="bg-cyan-950/20 border border-cyan-500/30 rounded-xl p-4 flex items-start gap-3">
        <Info className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
        <p className="text-xs text-cyan-100 font-sans leading-relaxed">
          Bu panel öğrenme omurgasının durumunu gösterir. Yüklenen veriler otomatik olarak AI'yi eğitmez. Analyzer adapterları şu anda yalnızca güvenli metadata/stub modundadır. Gerçek görüntü veya ses tanıma aktif değildir. Dashboard is visibility/readiness only.
        </p>
      </div>

      <div className="bg-[#0f172a] border border-red-500/30 rounded-xl p-4 shadow-[0_0_15px_rgba(239,68,68,0.05)]">
        <h3 className="text-xs font-bold text-red-400 uppercase tracking-widest font-mono mb-3 flex items-center gap-2">
          <Lock className="w-4 h-4" />
          Safety Lock Summary
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {safetyLocks.map((lock) => (
            <div key={lock.name} className="bg-[#020814] border border-slate-800 rounded p-2 flex justify-between items-center text-[10px] font-mono">
              <span className="text-slate-400">{lock.name}:</span>
              <span className="text-emerald-500 font-bold tracking-wider">{lock.value}</span>
            </div>
          ))}
        </div>
      </div>

      <LearningPipelineStatusCard />
      <AnalyzerAdapterStatusPanel />
    </div>
  );
}
