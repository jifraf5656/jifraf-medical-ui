import React from 'react'
import JifrafMedicalIntelligenceApp from './JifrafMedicalApp'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("JIF-MED React Error Boundary Caught Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="fixed inset-0 bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 font-sans">
          <div className="max-w-md bg-slate-900 border border-cyan-500/50 rounded-2xl p-6 shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-cyan-950 border border-cyan-400 flex items-center justify-center mx-auto text-cyan-400 font-mono font-bold text-lg">
              🛡️
            </div>
            <h2 className="text-base font-bold text-cyan-300 uppercase tracking-wider font-mono">
              JIF-MED Sistem Kurtarma Ekranı
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Geçici bir ortam hatası algılandı. Çalışmanız koruma altına alındı.
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg cursor-pointer transition-all"
            >
              Uygulamayı Yeniden Başlat
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  return (
    <ErrorBoundary>
      <JifrafMedicalIntelligenceApp />
    </ErrorBoundary>
  );
}

export default App;
