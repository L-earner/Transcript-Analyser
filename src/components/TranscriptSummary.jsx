import { useState, useEffect } from 'react';
import './TranscriptSummary.css';

const TranscriptSummary = ({ transcript, onBack, loading }) => {
  const [summary, setSummary] = useState(transcript?.summary || null);

  useEffect(() => {
    if (transcript?.summary) {
      setSummary(transcript.summary);
    }
  }, [transcript]);

  if (loading) {
    return (
      <div className="transcript-summary">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading summary...</p>
        </div>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="transcript-summary">
        <button className="back-button" onClick={onBack}>
          ← Back to List
        </button>
        <div className="error-message">
          <p>Summary not available</p>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getSentimentClass = (sentiment) => {
    const sentimentLower = sentiment.toLowerCase();
    if (sentimentLower.includes('positive')) return 'sentiment-positive';
    if (sentimentLower.includes('negative')) return 'sentiment-negative';
    return 'sentiment-neutral';
  };

  return (
    <div className="transcript-summary">
      <button className="back-button" onClick={onBack}>
        ← Back to List
      </button>

      <div className="summary-header">
        <div className="company-header">
          <h1>{transcript.company}</h1>
          <div className="header-badges">
            <span className="ticker-badge">{transcript.ticker}</span>
            <span className="quarter-badge">{transcript.quarter}</span>
          </div>
        </div>
        <p className="call-date">{formatDate(transcript.date)}</p>
        <h2 className="call-title">{transcript.title}</h2>
      </div>

      <div className="summary-content">
        {/* Financial Metrics */}
        <div className="section metrics-section">
          <h3 className="section-title">Financial Highlights</h3>
          <div className="metrics-grid">
            <div className="metric-card">
              <div className="metric-label">Revenue</div>
              <div className="metric-value">{summary.financialMetrics.revenue}</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Net Income</div>
              <div className="metric-value">{summary.financialMetrics.netIncome}</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">EPS</div>
              <div className="metric-value">{summary.financialMetrics.eps}</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Gross Margin</div>
              <div className="metric-value">{summary.financialMetrics.grossMargin}</div>
            </div>
          </div>
        </div>

        {/* Sentiment */}
        <div className="section sentiment-section">
          <h3 className="section-title">Overall Sentiment</h3>
          <div className={`sentiment-badge ${getSentimentClass(summary.sentiment)}`}>
            {summary.sentiment}
          </div>
        </div>

        {/* Key Highlights */}
        <div className="section">
          <h3 className="section-title">Key Highlights</h3>
          <ul className="highlights-list">
            {summary.keyHighlights.map((highlight, index) => (
              <li key={index}>{highlight}</li>
            ))}
          </ul>
        </div>

        {/* Management Outlook */}
        <div className="section">
          <h3 className="section-title">Management Outlook</h3>
          <p className="outlook-text">{summary.managementOutlook}</p>
        </div>

        {/* Q&A Highlights */}
        <div className="section">
          <h3 className="section-title">Q&A Session Highlights</h3>
          <ul className="qa-list">
            {summary.questionsHighlights.map((question, index) => (
              <li key={index}>{question}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TranscriptSummary;
