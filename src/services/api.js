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
          return {
            symbol,
            ...transcripts[0],
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
 * @param {string} content - Transcript content
 * @returns {Object} Analysis results
 */
export const analyzeTranscript = (transcript) => {
  if (!transcript || !transcript.content) {
    return null;
  }

  const content = transcript.content.toLowerCase();

  // Extract key metrics and themes
  const analysis = {
    id: `${transcript.symbol}-${transcript.quarter}-${transcript.year}`,
    company: getCompanyName(transcript.symbol),
    ticker: transcript.symbol,
    quarter: `${transcript.quarter} ${transcript.year}`,
    date: transcript.date,
    title: `${getCompanyName(transcript.symbol)} ${transcript.quarter} ${transcript.year} Earnings Call`,
    summary: {
      keyHighlights: extractKeyHighlights(content, transcript),
      financialMetrics: extractFinancialMetrics(content),
      sentiment: analyzeSentiment(content),
      managementOutlook: extractManagementOutlook(content),
      questionsHighlights: extractQAHighlights(content),
    },
  };

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
const extractKeyHighlights = (content, transcript) => {
  const highlights = [];

  // Look for revenue mentions
  const revenueMatch = content.match(/revenue[s]?\s+(?:of\s+|was\s+|reached\s+)?[\$]?(\d+\.?\d*)\s*(billion|million)/i);
  if (revenueMatch) {
    highlights.push(`Revenue ${revenueMatch[0].includes('grew') || content.includes('increase') ? 'grew to' : 'reached'} ${revenueMatch[0].match(/[\$]?\d+\.?\d*\s*(?:billion|million)/i)[0]}`);
  }

  // Look for growth mentions
  if (content.includes('growth') || content.includes('increase')) {
    const growthMatch = content.match(/(\d+)%\s+(?:growth|increase|up)/i);
    if (growthMatch) {
      highlights.push(`Strong growth of ${growthMatch[1]}% reported`);
    }
  }

  // Look for product/service mentions
  if (content.includes('new product') || content.includes('launch')) {
    highlights.push('Announced new product launches and initiatives');
  }

  // Look for market expansion
  if (content.includes('expand') || content.includes('market')) {
    highlights.push('Discussed market expansion strategies');
  }

  // Look for AI/innovation mentions
  if (content.includes('artificial intelligence') || content.includes('ai') || content.includes('innovation')) {
    highlights.push('Emphasized investments in AI and innovation');
  }

  // Default highlights if none found
  if (highlights.length === 0) {
    highlights.push(`Quarterly earnings call for ${transcript.quarter} ${transcript.year}`);
    highlights.push('Detailed financial performance and strategic initiatives discussed');
    highlights.push('Management provided outlook for upcoming quarters');
  }

  return highlights.slice(0, 5);
};

/**
 * Extract financial metrics from transcript
 */
const extractFinancialMetrics = (content) => {
  const metrics = {
    revenue: 'N/A',
    netIncome: 'N/A',
    eps: 'N/A',
    grossMargin: 'N/A',
  };

  // Extract revenue
  const revenueMatch = content.match(/revenue[s]?\s+(?:of\s+|was\s+|reached\s+)?[\$]?(\d+\.?\d*)\s*(billion|million)/i);
  if (revenueMatch) {
    metrics.revenue = `$${revenueMatch[1]}${revenueMatch[2][0].toUpperCase()}`;
  }

  // Extract net income
  const incomeMatch = content.match(/net\s+income[s]?\s+(?:of\s+|was\s+)?[\$]?(\d+\.?\d*)\s*(billion|million)/i);
  if (incomeMatch) {
    metrics.netIncome = `$${incomeMatch[1]}${incomeMatch[2][0].toUpperCase()}`;
  }

  // Extract EPS
  const epsMatch = content.match(/(?:earnings|eps)\s+per\s+share[s]?\s+(?:of\s+|was\s+)?[\$]?(\d+\.?\d*)/i);
  if (epsMatch) {
    metrics.eps = `$${epsMatch[1]}`;
  }

  // Extract gross margin
  const marginMatch = content.match(/gross\s+margin[s]?\s+(?:of\s+|was\s+)?(\d+\.?\d*)%/i);
  if (marginMatch) {
    metrics.grossMargin = `${marginMatch[1]}%`;
  }

  return metrics;
};

/**
 * Analyze sentiment of the transcript
 */
const analyzeSentiment = (content) => {
  const positiveWords = ['strong', 'growth', 'increase', 'positive', 'exceed', 'success', 'improved', 'momentum', 'optimistic', 'record'];
  const negativeWords = ['decline', 'decrease', 'weak', 'challenge', 'difficult', 'concern', 'loss', 'lower', 'negative'];

  let positiveCount = 0;
  let negativeCount = 0;

  positiveWords.forEach((word) => {
    const regex = new RegExp(word, 'gi');
    const matches = content.match(regex);
    if (matches) positiveCount += matches.length;
  });

  negativeWords.forEach((word) => {
    const regex = new RegExp(word, 'gi');
    const matches = content.match(regex);
    if (matches) negativeCount += matches.length;
  });

  const ratio = positiveCount / (negativeCount || 1);

  if (ratio > 1.5) return 'Very Positive';
  if (ratio > 1.0) return 'Positive';
  if (ratio > 0.7) return 'Neutral to Positive';
  if (ratio > 0.5) return 'Neutral';
  return 'Mixed';
};

/**
 * Extract management outlook
 */
const extractManagementOutlook = (content) => {
  // Look for forward-looking statements
  const outlookKeywords = ['outlook', 'expect', 'anticipate', 'forward', 'future', 'guidance', 'next quarter'];

  for (const keyword of outlookKeywords) {
    const keywordIndex = content.indexOf(keyword);
    if (keywordIndex !== -1) {
      // Extract a sentence around this keyword
      const start = Math.max(0, keywordIndex - 100);
      const end = Math.min(content.length, keywordIndex + 200);
      let excerpt = content.substring(start, end);

      // Find sentence boundaries
      const sentenceStart = excerpt.lastIndexOf('.', 100);
      const sentenceEnd = excerpt.indexOf('.', 100);

      if (sentenceStart !== -1 && sentenceEnd !== -1) {
        excerpt = excerpt.substring(sentenceStart + 1, sentenceEnd).trim();
        if (excerpt.length > 50) {
          return excerpt.charAt(0).toUpperCase() + excerpt.slice(1) + '.';
        }
      }
    }
  }

  return 'Management expressed confidence in the company\'s strategic direction and expects continued execution on key initiatives in upcoming quarters.';
};

/**
 * Extract Q&A highlights
 */
const extractQAHighlights = (content) => {
  const highlights = [];

  // Check for Q&A section
  const qaIndex = content.indexOf('question');

  if (qaIndex !== -1) {
    // Look for common Q&A topics
    if (content.includes('competition') || content.includes('competitive')) {
      highlights.push('Addressed questions about competitive landscape and market positioning');
    }
    if (content.includes('margin') || content.includes('profitability')) {
      highlights.push('Discussed margin trends and profitability outlook');
    }
    if (content.includes('capital allocation') || content.includes('buyback')) {
      highlights.push('Provided insights on capital allocation strategy');
    }
  }

  // Default Q&A highlights
  if (highlights.length === 0) {
    highlights.push('Responded to analyst questions on financial performance');
    highlights.push('Discussed strategic priorities and market opportunities');
    highlights.push('Provided color on key business drivers and trends');
  }

  return highlights.slice(0, 5);
};

export default api;
