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
          <p>Loading professional analysis...</p>
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
          <p>Analysis not available</p>
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
    const sentimentLower = sentiment?.toLowerCase() || '';
    if (sentimentLower.includes('positive')) return 'sentiment-positive';
    if (sentimentLower.includes('negative') || sentimentLower.includes('concern')) return 'sentiment-negative';
    if (sentimentLower.includes('cautious')) return 'sentiment-caution';
    return 'sentiment-neutral';
  };

  // Handle both old simple format and new detailed format
  const isDetailedAnalysis = summary.executiveSummary || summary.financialPerformance;

  return (
    <div className="transcript-summary professional">
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
        {isDetailedAnalysis ? (
          // New detailed professional format
          <>
            {/* Executive Summary */}
            {summary.executiveSummary && (
              <div className="section executive-summary">
                <h3 className="section-title">Executive Summary</h3>
                <p className="executive-text">{summary.executiveSummary}</p>
              </div>
            )}

            {/* Financial Performance */}
            {summary.financialPerformance && (
              <div className="section financial-section">
                <h3 className="section-title">Financial Performance</h3>

                <div className="metrics-grid">
                  <div className="metric-card primary">
                    <div className="metric-label">Revenue</div>
                    <div className="metric-value">{summary.financialPerformance.revenue}</div>
                  </div>
                  <div className="metric-card primary">
                    <div className="metric-label">Net Income</div>
                    <div className="metric-value">{summary.financialPerformance.netIncome}</div>
                  </div>
                  <div className="metric-card primary">
                    <div className="metric-label">EPS</div>
                    <div className="metric-value">{summary.financialPerformance.eps}</div>
                  </div>
                </div>

                {summary.financialPerformance.revenueAnalysis && (
                  <div className="analysis-block">
                    <h4>Revenue Analysis</h4>
                    <p>{summary.financialPerformance.revenueAnalysis}</p>
                  </div>
                )}

                {summary.financialPerformance.margins && (
                  <div className="margins-block">
                    <h4>Margin Profile</h4>
                    <div className="margin-metrics">
                      {summary.financialPerformance.margins.gross && (
                        <div className="margin-item">
                          <span className="margin-label">Gross Margin:</span>
                          <span className="margin-value">{summary.financialPerformance.margins.gross}</span>
                        </div>
                      )}
                      {summary.financialPerformance.margins.operating && (
                        <div className="margin-item">
                          <span className="margin-label">Operating Margin:</span>
                          <span className="margin-value">{summary.financialPerformance.margins.operating}</span>
                        </div>
                      )}
                      {summary.financialPerformance.margins.net && (
                        <div className="margin-item">
                          <span className="margin-label">Net Margin:</span>
                          <span className="margin-value">{summary.financialPerformance.margins.net}</span>
                        </div>
                      )}
                    </div>
                    {summary.financialPerformance.marginAnalysis && (
                      <p className="margin-analysis">{summary.financialPerformance.marginAnalysis}</p>
                    )}
                  </div>
                )}

                {summary.financialPerformance.cashFlow && (
                  <div className="analysis-block">
                    <h4>Cash Flow</h4>
                    <p>{summary.financialPerformance.cashFlow}</p>
                  </div>
                )}

                {summary.financialPerformance.balanceSheet && (
                  <div className="analysis-block">
                    <h4>Balance Sheet Highlights</h4>
                    <p>{summary.financialPerformance.balanceSheet}</p>
                  </div>
                )}
              </div>
            )}

            {/* Operational Highlights */}
            {summary.operationalHighlights && (
              <div className="section operations-section">
                <h3 className="section-title">Operational Highlights</h3>

                {summary.operationalHighlights.businessSegments && summary.operationalHighlights.businessSegments.length > 0 && (
                  <div className="subsection">
                    <h4>Business Segments</h4>
                    <ul className="segment-list">
                      {summary.operationalHighlights.businessSegments.map((segment, index) => (
                        <li key={index}>{segment}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {summary.operationalHighlights.productPerformance && (
                  <div className="subsection">
                    <h4>Product Performance</h4>
                    <p>{summary.operationalHighlights.productPerformance}</p>
                  </div>
                )}

                {summary.operationalHighlights.geographicPerformance && (
                  <div className="subsection">
                    <h4>Geographic Performance</h4>
                    <p>{summary.operationalHighlights.geographicPerformance}</p>
                  </div>
                )}

                {summary.operationalHighlights.keyMetrics && (
                  <div className="subsection">
                    <h4>Key Operating Metrics</h4>
                    <p>{summary.operationalHighlights.keyMetrics}</p>
                  </div>
                )}
              </div>
            )}

            {/* Strategic Initiatives */}
            {summary.strategicInitiatives && summary.strategicInitiatives.length > 0 && (
              <div className="section strategy-section">
                <h3 className="section-title">Strategic Initiatives</h3>
                <ul className="strategy-list">
                  {summary.strategicInitiatives.map((initiative, index) => (
                    <li key={index}>{initiative}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Competitive Position */}
            {summary.competitivePosition && (
              <div className="section competitive-section">
                <h3 className="section-title">Competitive Position</h3>

                {summary.competitivePosition.marketShare && (
                  <div className="subsection">
                    <h4>Market Share & Dynamics</h4>
                    <p>{summary.competitivePosition.marketShare}</p>
                  </div>
                )}

                {summary.competitivePosition.competitiveAdvantages && (
                  <div className="subsection">
                    <h4>Competitive Advantages</h4>
                    <p>{summary.competitivePosition.competitiveAdvantages}</p>
                  </div>
                )}

                {summary.competitivePosition.threats && (
                  <div className="subsection risk">
                    <h4>Competitive Threats</h4>
                    <p>{summary.competitivePosition.threats}</p>
                  </div>
                )}
              </div>
            )}

            {/* Risk Factors */}
            {summary.riskFactors && summary.riskFactors.length > 0 && (
              <div className="section risk-section">
                <h3 className="section-title">Risk Factors & Concerns</h3>
                <ul className="risk-list">
                  {summary.riskFactors.map((risk, index) => (
                    <li key={index}>{risk}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Guidance and Outlook */}
            {summary.guidanceAndOutlook && (
              <div className="section guidance-section">
                <h3 className="section-title">Guidance & Outlook</h3>

                <div className="guidance-grid">
                  {summary.guidanceAndOutlook.nextQuarter && (
                    <div className="guidance-card">
                      <h4>Next Quarter</h4>
                      <p>{summary.guidanceAndOutlook.nextQuarter}</p>
                    </div>
                  )}

                  {summary.guidanceAndOutlook.fullYear && (
                    <div className="guidance-card">
                      <h4>Full Year</h4>
                      <p>{summary.guidanceAndOutlook.fullYear}</p>
                    </div>
                  )}

                  {summary.guidanceAndOutlook.longTerm && (
                    <div className="guidance-card">
                      <h4>Long-Term</h4>
                      <p>{summary.guidanceAndOutlook.longTerm}</p>
                    </div>
                  )}
                </div>

                {summary.guidanceAndOutlook.assumptions && (
                  <div className="subsection">
                    <h4>Key Assumptions</h4>
                    <p>{summary.guidanceAndOutlook.assumptions}</p>
                  </div>
                )}
              </div>
            )}

            {/* Management Tone */}
            {summary.managementTone && (
              <div className="section tone-section">
                <h3 className="section-title">Management Tone & Confidence</h3>

                <div className="tone-grid">
                  {summary.managementTone.sentiment && (
                    <div className="tone-card">
                      <div className="tone-label">Sentiment</div>
                      <div className={`tone-badge ${getSentimentClass(summary.managementTone.sentiment)}`}>
                        {summary.managementTone.sentiment}
                      </div>
                    </div>
                  )}

                  {summary.managementTone.confidence && (
                    <div className="tone-card">
                      <div className="tone-label">Confidence Level</div>
                      <p>{summary.managementTone.confidence}</p>
                    </div>
                  )}

                  {summary.managementTone.transparency && (
                    <div className="tone-card">
                      <div className="tone-label">Transparency</div>
                      <p>{summary.managementTone.transparency}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Q&A Insights */}
            {summary.qnaInsights && (
              <div className="section qna-section">
                <h3 className="section-title">Q&A Insights</h3>

                {summary.qnaInsights.analystConcerns && summary.qnaInsights.analystConcerns.length > 0 && (
                  <div className="subsection">
                    <h4>Analyst Concerns & Management Responses</h4>
                    <ul className="concern-list">
                      {summary.qnaInsights.analystConcerns.map((concern, index) => (
                        <li key={index}>{concern}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {summary.qnaInsights.keyQuestions && summary.qnaInsights.keyQuestions.length > 0 && (
                  <div className="subsection">
                    <h4>Key Questions & Strategic Insights</h4>
                    <ul className="question-list">
                      {summary.qnaInsights.keyQuestions.map((question, index) => (
                        <li key={index}>{question}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {summary.qnaInsights.unaddressed && (
                  <div className="subsection caution">
                    <h4>Unaddressed Topics</h4>
                    <p>{summary.qnaInsights.unaddressed}</p>
                  </div>
                )}
              </div>
            )}

            {/* Investment Implications */}
            {summary.investmentImplications && (
              <div className="section investment-section highlight">
                <h3 className="section-title">Investment Implications</h3>

                {summary.investmentImplications.keyTakeaways && summary.investmentImplications.keyTakeaways.length > 0 && (
                  <div className="subsection">
                    <h4>Key Investment Takeaways</h4>
                    <ul className="takeaway-list">
                      {summary.investmentImplications.keyTakeaways.map((takeaway, index) => (
                        <li key={index}>{takeaway}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {summary.investmentImplications.catalysts && (
                  <div className="subsection">
                    <h4>Upcoming Catalysts</h4>
                    <p>{summary.investmentImplications.catalysts}</p>
                  </div>
                )}

                {summary.investmentImplications.concerns && (
                  <div className="subsection">
                    <h4>Investment Concerns</h4>
                    <p>{summary.investmentImplications.concerns}</p>
                  </div>
                )}

                {summary.investmentImplications.valuation && (
                  <div className="subsection">
                    <h4>Valuation Comments</h4>
                    <p>{summary.investmentImplications.valuation}</p>
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          // Fallback to old simple format
          <>
            {summary.financialMetrics && (
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
            )}

            {summary.sentiment && (
              <div className="section sentiment-section">
                <h3 className="section-title">Overall Sentiment</h3>
                <div className={`sentiment-badge ${getSentimentClass(summary.sentiment)}`}>
                  {summary.sentiment}
                </div>
              </div>
            )}

            {summary.keyHighlights && summary.keyHighlights.length > 0 && (
              <div className="section">
                <h3 className="section-title">Key Highlights</h3>
                <ul className="highlights-list">
                  {summary.keyHighlights.map((highlight, index) => (
                    <li key={index}>{highlight}</li>
                  ))}
                </ul>
              </div>
            )}

            {summary.managementOutlook && (
              <div className="section">
                <h3 className="section-title">Management Outlook</h3>
                <p className="outlook-text">{summary.managementOutlook}</p>
              </div>
            )}

            {summary.questionsHighlights && summary.questionsHighlights.length > 0 && (
              <div className="section">
                <h3 className="section-title">Q&A Session Highlights</h3>
                <ul className="qa-list">
                  {summary.questionsHighlights.map((question, index) => (
                    <li key={index}>{question}</li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default TranscriptSummary;
