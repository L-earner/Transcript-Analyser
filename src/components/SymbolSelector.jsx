import { useState } from 'react';
import { POPULAR_SYMBOLS } from '../services/api';
import './SymbolSelector.css';

const SymbolSelector = ({ onAnalyze }) => {
  const [selectedSymbols, setSelectedSymbols] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const MAX_SELECTIONS = 5;

  const handleSymbolToggle = (symbolValue) => {
    setSelectedSymbols((prev) => {
      if (prev.includes(symbolValue)) {
        // Remove if already selected
        return prev.filter((s) => s !== symbolValue);
      } else {
        // Add if not at max
        if (prev.length < MAX_SELECTIONS) {
          return [...prev, symbolValue];
        }
        return prev;
      }
    });
  };

  const handleAnalyze = async () => {
    if (selectedSymbols.length === 0) {
      return;
    }

    setIsLoading(true);
    try {
      await onAnalyze(selectedSymbols);
    } catch (error) {
      console.error('Error analyzing:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setSelectedSymbols([]);
  };

  return (
    <div className="symbol-selector">
      <div className="selector-header">
        <h2>Select Symbols to Analyze</h2>
        <p className="selector-subtitle">
          Choose up to {MAX_SELECTIONS} companies to analyze their latest earnings call transcripts
        </p>
      </div>

      <div className="selection-info">
        <span className="selection-count">
          {selectedSymbols.length} / {MAX_SELECTIONS} selected
        </span>
        {selectedSymbols.length > 0 && (
          <button className="clear-button" onClick={handleClear}>
            Clear All
          </button>
        )}
      </div>

      <div className="symbols-grid">
        {POPULAR_SYMBOLS.map((symbol) => {
          const isSelected = selectedSymbols.includes(symbol.value);
          const isDisabled = !isSelected && selectedSymbols.length >= MAX_SELECTIONS;

          return (
            <button
              key={symbol.value}
              className={`symbol-card ${isSelected ? 'selected' : ''} ${isDisabled ? 'disabled' : ''}`}
              onClick={() => handleSymbolToggle(symbol.value)}
              disabled={isDisabled}
            >
              <div className="symbol-ticker">{symbol.value}</div>
              <div className="symbol-name">
                {symbol.label.split('(')[0].trim()}
              </div>
              {isSelected && (
                <div className="selected-badge">
                  ✓
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div className="analyze-section">
        <button
          className="analyze-button"
          onClick={handleAnalyze}
          disabled={selectedSymbols.length === 0 || isLoading}
        >
          {isLoading ? (
            <>
              <span className="spinner-small"></span>
              Analyzing...
            </>
          ) : (
            `Analyze ${selectedSymbols.length > 0 ? selectedSymbols.length : ''} ${
              selectedSymbols.length === 1 ? 'Transcript' : 'Transcripts'
            }`
          )}
        </button>
      </div>

      {selectedSymbols.length > 0 && (
        <div className="selected-list">
          <h3>Selected Symbols:</h3>
          <div className="selected-tags">
            {selectedSymbols.map((symbol) => {
              const symbolInfo = POPULAR_SYMBOLS.find((s) => s.value === symbol);
              return (
                <span key={symbol} className="selected-tag">
                  {symbol}
                  <button
                    className="remove-tag"
                    onClick={() => handleSymbolToggle(symbol)}
                    aria-label={`Remove ${symbol}`}
                  >
                    ×
                  </button>
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default SymbolSelector;
