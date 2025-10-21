import axios from 'axios';

// Get API credentials from environment variables
const API_KEY = import.meta.env.VITE_FMP_API_KEY;
const API_BASE_URL = import.meta.env.VITE_FMP_API_BASE_URL || 'https://financialmodelingprep.com/api/v3';

// Validate API key is present
if (!API_KEY) {
  console.error('API key is missing. Please set VITE_FMP_API_KEY in your .env file');
}

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

/**
 * Popular stock symbols for user selection
 */
export const POPULAR_SYMBOLS = [
  { value: 'AAPL', label: 'Apple Inc. (AAPL)' },
  { value: 'MSFT', label: 'Microsoft Corporation (MSFT)' },
  { value: 'GOOGL', label: 'Alphabet Inc. (GOOGL)' },
  { value: 'AMZN', label: 'Amazon.com Inc. (AMZN)' },
  { value: 'TSLA', label: 'Tesla Inc. (TSLA)' },
  { value: 'META', label: 'Meta Platforms Inc. (META)' },
  { value: 'NVDA', label: 'NVIDIA Corporation (NVDA)' },
  { value: 'JPM', label: 'JPMorgan Chase & Co. (JPM)' },
  { value: 'V', label: 'Visa Inc. (V)' },
  { value: 'WMT', label: 'Walmart Inc. (WMT)' },
  { value: 'DIS', label: 'The Walt Disney Company (DIS)' },
  { value: 'NFLX', label: 'Netflix Inc. (NFLX)' },
  { value: 'BA', label: 'The Boeing Company (BA)' },
  { value: 'INTC', label: 'Intel Corporation (INTC)' },
  { value: 'AMD', label: 'Advanced Micro Devices Inc. (AMD)' },
];

/**
 * Fetch earnings call transcript for a specific symbol
 * @param {string} symbol - Stock ticker symbol
 * @returns {Promise<Array>} Array of transcripts
 */
export const getEarningsCallTranscript = async (symbol) => {
  try {
    const response = await api.get(`/earning_call_transcript/${symbol}`, {
      params: { apikey: API_KEY },
    });

    console.log(`Fetched transcript for ${symbol}:`, response.data ? 'Success' : 'No data');

    return response.data;
  } catch (error) {
    console.error(`Error fetching transcript for ${symbol}:`, error);
    if (error.response?.status === 401) {
      throw new Error('Invalid API key. Please check your VITE_FMP_API_KEY');
    }
    throw error;
  }
};

/**
 * Fetch transcripts for multiple symbols
 * @param {Array<string>} symbols - Array of stock ticker symbols
 * @returns {Promise<Array>} Array of transcript data with symbol info
 */
export const getMultipleTranscripts = async (symbols) => {
  try {
    const promises = symbols.map(async (symbol) => {
      try {
        const transcripts = await getEarningsCallTranscript(symbol);
        // Get the most recent transcript
        if (transcripts && transcripts.length > 0) {
          const latest = transcripts[0];
          console.log(`Latest transcript for ${symbol}:`, {
            quarter: latest.quarter,
            year: latest.year,
            date: latest.date,
            hasContent: !!latest.content,
            contentLength: latest.content?.length || 0
          });
          return {
            symbol,
            ...latest,
          };
        }
        return null;
      } catch (error) {
        console.error(`Failed to fetch ${symbol}:`, error);
        return null;
      }
    });

    const results = await Promise.all(promises);
    return results.filter((result) => result !== null);
  } catch (error) {
    console.error('Error fetching multiple transcripts:', error);
    throw error;
  }
};

/**
 * Analyze transcript content using AI-like keyword extraction
 * @param {Object} transcript - Transcript object
 * @returns {Object} Analysis results
 */
export const analyzeTranscript = (transcript) => {
  if (!transcript || !transcript.content) {
    console.warn('No transcript content to analyze');
    return null;
  }

  console.log(`Analyzing transcript for ${transcript.symbol}...`);

  const content = transcript.content.toLowerCase();
  const originalContent = transcript.content;

  // Extract key metrics and themes
  const analysis = {
    id: `${transcript.symbol}-${transcript.quarter}-${transcript.year}`,
    company: getCompanyName(transcript.symbol),
    ticker: transcript.symbol,
    quarter: `Q${transcript.quarter} ${transcript.year}`,
    date: transcript.date,
    title: `${getCompanyName(transcript.symbol)} Q${transcript.quarter} ${transcript.year} Earnings Call`,
    summary: {
      keyHighlights: extractKeyHighlights(content, originalContent, transcript),
      financialMetrics: extractFinancialMetrics(content, originalContent),
      sentiment: analyzeSentiment(content),
      managementOutlook: extractManagementOutlook(content, originalContent),
      questionsHighlights: extractQAHighlights(content, originalContent),
    },
  };

  console.log(`Analysis complete for ${transcript.symbol}:`, {
    highlights: analysis.summary.keyHighlights.length,
    metrics: analysis.summary.financialMetrics,
    sentiment: analysis.summary.sentiment
  });

  return analysis;
};

/**
 * Get company name from symbol
 */
const getCompanyName = (symbol) => {
  const company = POPULAR_SYMBOLS.find((s) => s.value === symbol);
  return company ? company.label.split('(')[0].trim() : symbol;
};

/**
 * Extract key highlights from transcript
 */
const extractKeyHighlights = (content, originalContent, transcript) => {
  const highlights = [];
  const sentences = originalContent.split(/[.!?]+/).filter(s => s.trim().length > 50);

  // Look for revenue mentions with various formats
  const revenuePatterns = [
    /revenue[s]?\s+(?:of\s+|was\s+|reached\s+|totaled\s+|came\s+in\s+at\s+)?[\$€£]?\s*(\d+\.?\d*)\s*(billion|million|thousand)/gi,
    /(\d+\.?\d*)\s*(billion|million)\s+(?:in\s+)?revenue/gi,
    /total\s+revenue\s+.*?(\d+\.?\d*)\s*(billion|million)/gi
  ];

  for (const pattern of revenuePatterns) {
    const matches = [...originalContent.matchAll(pattern)];
    if (matches.length > 0) {
      const match = matches[0];
      const amount = match[1];
      const unit = match[2];
      highlights.push(`Revenue of $${amount} ${unit} reported for the quarter`);
      break;
    }
  }

  // Look for growth percentage
  const growthPatterns = [
    /grew\s+(\d+)%/gi,
    /growth\s+of\s+(\d+)%/gi,
    /increased\s+(\d+)%/gi,
    /up\s+(\d+)%/gi,
    /(\d+)%\s+(?:year-over-year|yoy)\s+growth/gi
  ];

  for (const pattern of growthPatterns) {
    const match = content.match(pattern);
    if (match) {
      const percent = match[0].match(/(\d+)/)[1];
      highlights.push(`Achieved ${percent}% growth year-over-year`);
      break;
    }
  }

  // Look for key business terms
  const keyTerms = [
    { term: /artificial intelligence|ai\s+/gi, message: 'Discussed artificial intelligence and AI initiatives' },
    { term: /cloud\s+(?:computing|services|revenue|business)/gi, message: 'Highlighted cloud business performance' },
    { term: /market\s+share/gi, message: 'Addressed market share and competitive positioning' },
    { term: /new\s+product/gi, message: 'Announced new product launches and innovations' },
    { term: /guidance|outlook/gi, message: 'Provided forward guidance and outlook' },
    { term: /margin\s+expansion/gi, message: 'Reported margin expansion' },
    { term: /record\s+(?:revenue|earnings|quarter)/gi, message: 'Achieved record financial results' },
  ];

  keyTerms.forEach(({ term, message }) => {
    if (term.test(content) && highlights.length < 5) {
      highlights.push(message);
    }
  });

  // Extract interesting sentences that mention key topics
  const topicKeywords = ['strong', 'growth', 'increase', 'record', 'expand', 'innovation', 'leading'];
  if (highlights.length < 5) {
    for (const sentence of sentences.slice(0, 50)) {
      const lowerSentence = sentence.toLowerCase();
      if (topicKeywords.some(kw => lowerSentence.includes(kw)) && highlights.length < 5) {
        const cleanSentence = sentence.trim().substring(0, 120);
        if (cleanSentence.length > 40) {
          highlights.push(cleanSentence + (sentence.length > 120 ? '...' : ''));
        }
      }
    }
  }

  // Default highlights if none found
  if (highlights.length === 0) {
    highlights.push(`Quarterly earnings call for Q${transcript.quarter} ${transcript.year}`);
    highlights.push('Management discussed financial performance and strategic priorities');
    highlights.push('Analyst Q&A session covered key business drivers and outlook');
  }

  return highlights.slice(0, 5);
};

/**
 * Extract financial metrics from transcript
 */
const extractFinancialMetrics = (content, originalContent) => {
  const metrics = {
    revenue: 'N/A',
    netIncome: 'N/A',
    eps: 'N/A',
    grossMargin: 'N/A',
  };

  // Extract revenue with multiple patterns
  const revenuePatterns = [
    /revenue[s]?\s+(?:of\s+|was\s+|reached\s+|totaled\s+)?[\$]?\s*(\d+\.?\d*)\s*(billion|million)/i,
    /total\s+revenue\s+.*?[\$]?\s*(\d+\.?\d*)\s*(billion|million)/i,
    /(\d+\.?\d*)\s*(billion|million)\s+in\s+revenue/i
  ];

  for (const pattern of revenuePatterns) {
    const match = originalContent.match(pattern);
    if (match) {
      metrics.revenue = `$${match[1]}${match[2][0].toUpperCase()}`;
      break;
    }
  }

  // Extract net income
  const incomePatterns = [
    /net\s+income\s+(?:of\s+|was\s+)?[\$]?\s*(\d+\.?\d*)\s*(billion|million)/i,
    /earnings\s+(?:of\s+|was\s+)?[\$]?\s*(\d+\.?\d*)\s*(billion|million)/i,
    /profit\s+(?:of\s+|was\s+)?[\$]?\s*(\d+\.?\d*)\s*(billion|million)/i
  ];

  for (const pattern of incomePatterns) {
    const match = originalContent.match(pattern);
    if (match) {
      metrics.netIncome = `$${match[1]}${match[2][0].toUpperCase()}`;
      break;
    }
  }

  // Extract EPS with multiple patterns
  const epsPatterns = [
    /(?:earnings|eps)\s+per\s+share\s+(?:of\s+|was\s+)?[\$]?\s*(\d+\.?\d*)/i,
    /eps\s+(?:of\s+|was\s+)?[\$]?\s*(\d+\.?\d*)/i,
    /diluted\s+eps\s+(?:of\s+|was\s+)?[\$]?\s*(\d+\.?\d*)/i,
    /per\s+share\s+(?:of\s+|was\s+)?[\$]?\s*(\d+\.?\d*)/i
  ];

  for (const pattern of epsPatterns) {
    const match = originalContent.match(pattern);
    if (match) {
      metrics.eps = `$${match[1]}`;
      break;
    }
  }

  // Extract gross margin
  const marginPatterns = [
    /gross\s+margin\s+(?:of\s+|was\s+)?(\d+\.?\d*)%/i,
    /operating\s+margin\s+(?:of\s+|was\s+)?(\d+\.?\d*)%/i,
    /margin\s+(?:of\s+|was\s+)?(\d+\.?\d*)%/i
  ];

  for (const pattern of marginPatterns) {
    const match = originalContent.match(pattern);
    if (match) {
      metrics.grossMargin = `${match[1]}%`;
      break;
    }
  }

  return metrics;
};

/**
 * Analyze sentiment of the transcript
 */
const analyzeSentiment = (content) => {
  const positiveWords = [
    'strong', 'growth', 'increase', 'positive', 'exceed', 'success', 'improved',
    'momentum', 'optimistic', 'record', 'excellent', 'outstanding', 'pleased',
    'confident', 'expansion', 'opportunity', 'innovative', 'leader', 'best'
  ];

  const negativeWords = [
    'decline', 'decrease', 'weak', 'challenge', 'difficult', 'concern', 'loss',
    'lower', 'negative', 'disappointing', 'headwind', 'pressure', 'uncertain',
    'risk', 'adverse', 'below'
  ];

  let positiveCount = 0;
  let negativeCount = 0;

  positiveWords.forEach((word) => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    const matches = content.match(regex);
    if (matches) positiveCount += matches.length;
  });

  negativeWords.forEach((word) => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    const matches = content.match(regex);
    if (matches) negativeCount += matches.length;
  });

  console.log('Sentiment analysis:', { positiveCount, negativeCount });

  const ratio = positiveCount / (negativeCount || 1);

  if (ratio > 2.0) return 'Very Positive';
  if (ratio > 1.3) return 'Positive';
  if (ratio > 0.9) return 'Neutral to Positive';
  if (ratio > 0.6) return 'Neutral';
  if (ratio > 0.4) return 'Neutral to Negative';
  return 'Mixed';
};

/**
 * Extract management outlook
 */
const extractManagementOutlook = (content, originalContent) => {
  const sentences = originalContent.split(/[.!?]+/).filter(s => s.trim().length > 50);

  // Look for forward-looking statements
  const outlookKeywords = [
    'expect', 'anticipate', 'outlook', 'guidance', 'forecast', 'looking ahead',
    'going forward', 'next quarter', 'next year', 'future', 'plan to', 'intend to',
    'will continue', 'remain confident', 'positioned to'
  ];

  for (const sentence of sentences) {
    const lowerSentence = sentence.toLowerCase();
    for (const keyword of outlookKeywords) {
      if (lowerSentence.includes(keyword)) {
        const cleanSentence = sentence.trim();
        if (cleanSentence.length > 60 && cleanSentence.length < 300) {
          return cleanSentence;
        }
      }
    }
  }

  return 'Management expressed confidence in the company\'s strategic direction and expects continued execution on key initiatives in upcoming quarters.';
};

/**
 * Extract Q&A highlights
 */
const extractQAHighlights = (content, originalContent) => {
  const highlights = [];
  const sentences = originalContent.split(/[.!?]+/).filter(s => s.trim().length > 40);

  // Check for Q&A section markers
  const qaStart = content.search(/question[s]?\s+and\s+answer|q\s*&\s*a|operator:/i);

  const qaTopics = [
    { pattern: /compet(?:ition|itive)/gi, highlight: 'Addressed questions about competitive landscape and market positioning' },
    { pattern: /margin[s]?|profitability/gi, highlight: 'Discussed margin trends and profitability outlook' },
    { pattern: /capital\s+allocation|buyback|dividend/gi, highlight: 'Provided insights on capital allocation strategy' },
    { pattern: /supply\s+chain/gi, highlight: 'Addressed supply chain dynamics and challenges' },
    { pattern: /product\s+(?:roadmap|pipeline|launch)/gi, highlight: 'Discussed product roadmap and innovation pipeline' },
    { pattern: /customer|demand/gi, highlight: 'Provided color on customer demand trends' },
    { pattern: /international|geographic/gi, highlight: 'Addressed international expansion and geographic performance' },
  ];

  if (qaStart !== -1) {
    qaTopics.forEach(({ pattern, highlight }) => {
      if (pattern.test(content) && highlights.length < 5) {
        highlights.push(highlight);
      }
    });
  }

  // If we found Q&A section but no specific topics, add generic highlights
  if (highlights.length === 0 && qaStart !== -1) {
    // Try to extract actual Q&A exchanges
    const qaSection = originalContent.substring(qaStart);
    const qaLines = qaSection.split('\n').filter(line => line.trim().length > 60);

    for (const line of qaLines.slice(0, 5)) {
      if (highlights.length < 3) {
        const cleanLine = line.trim().substring(0, 120);
        if (cleanLine.length > 50) {
          highlights.push(cleanLine + (line.length > 120 ? '...' : ''));
        }
      }
    }
  }

  // Default Q&A highlights
  if (highlights.length === 0) {
    highlights.push('Responded to analyst questions on financial performance and outlook');
    highlights.push('Discussed strategic priorities and key business drivers');
    highlights.push('Provided detailed insights into operational metrics and trends');
  }

  return highlights.slice(0, 5);
};

export default api;
