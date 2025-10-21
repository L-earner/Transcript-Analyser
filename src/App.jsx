import { useState, useEffect } from 'react';
import TranscriptList from './components/TranscriptList';
import TranscriptSummary from './components/TranscriptSummary';
import { getMockTranscripts, getMockTranscriptSummary } from './services/api';
import './App.css';

function App() {
  const [transcripts, setTranscripts] = useState([]);
  const [selectedTranscript, setSelectedTranscript] = useState(null);
  const [loading, setLoading] = useState(false);
  const [summaryLoading, setSummaryLoading] = useState(false);

  useEffect(() => {
    loadTranscripts();
  }, []);

  const loadTranscripts = async () => {
    setLoading(true);
    try {
      // Using mock data for demo - replace with actual API call
      // const data = await getTranscripts();
      const data = await getMockTranscripts();
      setTranscripts(data);
    } catch (error) {
      console.error('Error loading transcripts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectTranscript = async (transcript) => {
    setSummaryLoading(true);
    try {
      // Using mock data for demo - replace with actual API call
      // const summary = await getTranscriptSummary(transcript.id);
      const fullTranscript = await getMockTranscriptSummary(transcript.id);
      setSelectedTranscript(fullTranscript);
    } catch (error) {
      console.error('Error loading transcript summary:', error);
    } finally {
      setSummaryLoading(false);
    }
  };

  const handleBack = () => {
    setSelectedTranscript(null);
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">Earnings Call Transcript Analyzer</h1>
          <p className="app-subtitle">
            Explore and analyze earnings call transcripts from leading companies
          </p>
        </div>
      </header>

      <main className="app-main">
        <div className="container">
          {selectedTranscript ? (
            <TranscriptSummary
              transcript={selectedTranscript}
              onBack={handleBack}
              loading={summaryLoading}
            />
          ) : (
            <TranscriptList
              transcripts={transcripts}
              onSelectTranscript={handleSelectTranscript}
              loading={loading}
            />
          )}
        </div>
      </main>

      <footer className="app-footer">
        <p>
          Built with React and Vite | Data updates in real-time from API
        </p>
      </footer>
    </div>
  );
}

export default App;
