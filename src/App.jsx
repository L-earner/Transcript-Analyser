import { useState } from 'react';
import SymbolSelector from './components/SymbolSelector';
import TranscriptList from './components/TranscriptList';
import TranscriptSummary from './components/TranscriptSummary';
import { getMultipleTranscripts, analyzeTranscript } from './services/api';
import './App.css';

function App() {
  const [view, setView] = useState('selector'); // 'selector', 'list', 'summary'
  const [analyzedTranscripts, setAnalyzedTranscripts] = useState([]);
  const [selectedTranscript, setSelectedTranscript] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAnalyze = async (symbols) => {
    setLoading(true);
    setError(null);

    try {
      // Fetch transcripts from API
      const transcripts = await getMultipleTranscripts(symbols);

      if (transcripts.length === 0) {
        setError('No transcripts found for the selected symbols. Please try different symbols.');
        setLoading(false);
        return;
      }

      // Analyze each transcript
      const analyzed = transcripts
        .map((transcript) => analyzeTranscript(transcript))
        .filter((result) => result !== null);

      if (analyzed.length === 0) {
        setError('Unable to analyze the transcripts. Please try again.');
        setLoading(false);
        return;
      }

      setAnalyzedTranscripts(analyzed);
      setView('list');
    } catch (error) {
      console.error('Error analyzing transcripts:', error);
      setError(
        error.message || 'Failed to fetch transcripts. Please check your API key and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSelectTranscript = (transcript) => {
    setSelectedTranscript(transcript);
    setView('summary');
  };

  const handleBack = () => {
    if (view === 'summary') {
      setView('list');
      setSelectedTranscript(null);
    } else if (view === 'list') {
      setView('selector');
      setAnalyzedTranscripts([]);
    }
  };

  const handleNewAnalysis = () => {
    setView('selector');
    setAnalyzedTranscripts([]);
    setSelectedTranscript(null);
    setError(null);
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">Earnings Call Transcript Analyzer</h1>
          <p className="app-subtitle">
            {view === 'selector' && 'Select companies to analyze their latest earnings call transcripts'}
            {view === 'list' && 'View analyzed transcripts and insights'}
            {view === 'summary' && 'Detailed transcript analysis and summary'}
          </p>
        </div>
      </header>

      <main className="app-main">
        <div className="container">
          {error && (
            <div className="error-banner">
              <span className="error-icon">⚠️</span>
              <span>{error}</span>
              <button className="error-close" onClick={() => setError(null)}>
                ×
              </button>
            </div>
          )}

          {view === 'selector' && (
            <SymbolSelector onAnalyze={handleAnalyze} />
          )}

          {view === 'list' && (
            <div className="list-view">
              <div className="list-header">
                <button className="new-analysis-button" onClick={handleNewAnalysis}>
                  ← New Analysis
                </button>
                <h2>Analyzed Transcripts ({analyzedTranscripts.length})</h2>
              </div>
              <TranscriptList
                transcripts={analyzedTranscripts}
                onSelectTranscript={handleSelectTranscript}
                loading={loading}
              />
            </div>
          )}

          {view === 'summary' && selectedTranscript && (
            <TranscriptSummary
              transcript={selectedTranscript}
              onBack={handleBack}
              loading={false}
            />
          )}

          {loading && (
            <div className="loading-overlay">
              <div className="loading-content">
                <div className="spinner-large"></div>
                <h3>Analyzing Transcripts...</h3>
                <p>Fetching and analyzing earnings call data from the API</p>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="app-footer">
        <p>
          Powered by Financial Modeling Prep API | Built with React and Vite
        </p>
      </footer>
    </div>
  );
}

export default App;
