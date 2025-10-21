import { useState, useEffect } from 'react';
import './TranscriptList.css';

const TranscriptList = ({ transcripts, onSelectTranscript, loading }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTranscripts, setFilteredTranscripts] = useState(transcripts);

  useEffect(() => {
    setFilteredTranscripts(transcripts);
  }, [transcripts]);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    if (query === '') {
      setFilteredTranscripts(transcripts);
    } else {
      const filtered = transcripts.filter(
        (transcript) =>
          transcript.company.toLowerCase().includes(query) ||
          transcript.ticker.toLowerCase().includes(query) ||
          transcript.quarter.toLowerCase().includes(query)
      );
      setFilteredTranscripts(filtered);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="transcript-list">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading transcripts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="transcript-list">
      <div className="search-container">
        <input
          type="text"
          placeholder="Search by company, ticker, or quarter..."
          value={searchQuery}
          onChange={handleSearch}
          className="search-input"
        />
      </div>

      {filteredTranscripts.length === 0 ? (
        <div className="no-results">
          <p>No transcripts found</p>
        </div>
      ) : (
        <div className="transcripts-grid">
          {filteredTranscripts.map((transcript) => (
            <div
              key={transcript.id}
              className="transcript-card"
              onClick={() => onSelectTranscript(transcript)}
            >
              <div className="transcript-card-header">
                <div className="company-info">
                  <h3>{transcript.company}</h3>
                  <span className="ticker">{transcript.ticker}</span>
                </div>
                <span className="quarter-badge">{transcript.quarter}</span>
              </div>
              <div className="transcript-card-body">
                <p className="transcript-title">{transcript.title}</p>
                <p className="transcript-date">{formatDate(transcript.date)}</p>
              </div>
              <div className="transcript-card-footer">
                <button className="view-button">View Summary →</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TranscriptList;
