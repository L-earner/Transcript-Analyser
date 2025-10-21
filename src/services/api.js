import axios from 'axios';

// Configure your API endpoint here
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.example.com';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Fetch all available earnings call transcripts
 * @returns {Promise<Array>} List of transcripts
 */
export const getTranscripts = async (params = {}) => {
  try {
    const response = await api.get('/transcripts', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching transcripts:', error);
    throw error;
  }
};

/**
 * Fetch a specific transcript by ID
 * @param {string} id - Transcript ID
 * @returns {Promise<Object>} Transcript details with summary
 */
export const getTranscriptById = async (id) => {
  try {
    const response = await api.get(`/transcripts/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching transcript ${id}:`, error);
    throw error;
  }
};

/**
 * Search transcripts by company name or ticker
 * @param {string} query - Search query
 * @returns {Promise<Array>} Filtered list of transcripts
 */
export const searchTranscripts = async (query) => {
  try {
    const response = await api.get('/transcripts/search', {
      params: { q: query },
    });
    return response.data;
  } catch (error) {
    console.error('Error searching transcripts:', error);
    throw error;
  }
};

/**
 * Get transcript summary
 * @param {string} id - Transcript ID
 * @returns {Promise<Object>} Transcript summary
 */
export const getTranscriptSummary = async (id) => {
  try {
    const response = await api.get(`/transcripts/${id}/summary`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching summary for transcript ${id}:`, error);
    throw error;
  }
};

// Mock data for development/demo purposes
export const getMockTranscripts = () => {
  return Promise.resolve([
    {
      id: '1',
      company: 'Apple Inc.',
      ticker: 'AAPL',
      quarter: 'Q4 2024',
      date: '2024-10-31',
      title: 'Apple Q4 2024 Earnings Call',
    },
    {
      id: '2',
      company: 'Microsoft Corporation',
      ticker: 'MSFT',
      quarter: 'Q4 2024',
      date: '2024-10-30',
      title: 'Microsoft Q4 2024 Earnings Call',
    },
    {
      id: '3',
      company: 'Alphabet Inc.',
      ticker: 'GOOGL',
      quarter: 'Q3 2024',
      date: '2024-10-29',
      title: 'Alphabet Q3 2024 Earnings Call',
    },
    {
      id: '4',
      company: 'Amazon.com Inc.',
      ticker: 'AMZN',
      quarter: 'Q3 2024',
      date: '2024-10-26',
      title: 'Amazon Q3 2024 Earnings Call',
    },
    {
      id: '5',
      company: 'Tesla Inc.',
      ticker: 'TSLA',
      quarter: 'Q3 2024',
      date: '2024-10-23',
      title: 'Tesla Q3 2024 Earnings Call',
    },
  ]);
};

export const getMockTranscriptSummary = (id) => {
  const summaries = {
    '1': {
      id: '1',
      company: 'Apple Inc.',
      ticker: 'AAPL',
      quarter: 'Q4 2024',
      date: '2024-10-31',
      title: 'Apple Q4 2024 Earnings Call',
      summary: {
        keyHighlights: [
          'Revenue reached $94.9 billion, up 6% year-over-year',
          'iPhone revenue grew 8% to $46.2 billion',
          'Services revenue set an all-time record at $25.0 billion',
          'Strong performance in emerging markets, particularly India',
          'Announced new AI features coming to iOS 18.2',
        ],
        financialMetrics: {
          revenue: '$94.9B',
          netIncome: '$22.9B',
          eps: '$1.46',
          grossMargin: '46.2%',
        },
        sentiment: 'Positive',
        managementOutlook: 'Management expressed confidence in continued growth driven by strong product lineup and expanding services ecosystem. Emphasized investments in AI and machine learning capabilities.',
        questionsHighlights: [
          'Discussed supply chain improvements and production efficiency',
          'Addressed competitive landscape in smartphone market',
          'Provided insights on Vision Pro adoption and future roadmap',
        ],
      },
    },
    '2': {
      id: '2',
      company: 'Microsoft Corporation',
      ticker: 'MSFT',
      quarter: 'Q4 2024',
      date: '2024-10-30',
      title: 'Microsoft Q4 2024 Earnings Call',
      summary: {
        keyHighlights: [
          'Revenue increased 13% to $65.6 billion',
          'Cloud revenue grew 20% year-over-year',
          'Azure growth accelerated to 29%',
          'AI services contributing significantly to cloud growth',
          'GitHub Copilot reaching 1 million paid subscribers',
        ],
        financialMetrics: {
          revenue: '$65.6B',
          netIncome: '$24.7B',
          eps: '$3.30',
          grossMargin: '69.0%',
        },
        sentiment: 'Very Positive',
        managementOutlook: 'Strong optimism around AI integration across product portfolio. Expect continued momentum in cloud services and enterprise adoption of AI tools.',
        questionsHighlights: [
          'AI monetization strategies and ROI for customers',
          'Competition in cloud infrastructure market',
          'Gaming division performance and Activision integration',
        ],
      },
    },
    '3': {
      id: '3',
      company: 'Alphabet Inc.',
      ticker: 'GOOGL',
      quarter: 'Q3 2024',
      date: '2024-10-29',
      title: 'Alphabet Q3 2024 Earnings Call',
      summary: {
        keyHighlights: [
          'Total revenue grew 11% to $88.3 billion',
          'Search advertising revenue increased 10%',
          'YouTube advertising revenue up 13%',
          'Google Cloud revenue grew 35% to $11.4 billion',
          'Significant progress in AI model development',
        ],
        financialMetrics: {
          revenue: '$88.3B',
          netIncome: '$26.3B',
          eps: '$2.12',
          grossMargin: '57.0%',
        },
        sentiment: 'Positive',
        managementOutlook: 'Optimistic about AI-driven search improvements and cloud growth. Focused on responsible AI development and integration across products.',
        questionsHighlights: [
          'Impact of AI on search experience and monetization',
          'Cloud competitive positioning',
          'Regulatory challenges and responses',
        ],
      },
    },
    '4': {
      id: '4',
      company: 'Amazon.com Inc.',
      ticker: 'AMZN',
      quarter: 'Q3 2024',
      date: '2024-10-26',
      title: 'Amazon Q3 2024 Earnings Call',
      summary: {
        keyHighlights: [
          'Net sales increased 11% to $158.9 billion',
          'AWS revenue grew 19% to $27.5 billion',
          'Operating income improved to $17.4 billion',
          'Prime membership continues strong growth',
          'Significant investments in AI and logistics automation',
        ],
        financialMetrics: {
          revenue: '$158.9B',
          netIncome: '$15.3B',
          eps: '$1.43',
          operatingMargin: '11.0%',
        },
        sentiment: 'Positive',
        managementOutlook: 'Expect strong holiday season performance. Continued focus on cost optimization and improving delivery speeds. AWS showing accelerating growth.',
        questionsHighlights: [
          'Holiday season outlook and inventory management',
          'AWS growth drivers and AI workload adoption',
          'International expansion plans',
        ],
      },
    },
    '5': {
      id: '5',
      company: 'Tesla Inc.',
      ticker: 'TSLA',
      quarter: 'Q3 2024',
      date: '2024-10-23',
      title: 'Tesla Q3 2024 Earnings Call',
      summary: {
        keyHighlights: [
          'Record quarterly revenue of $25.2 billion',
          'Delivered 462,890 vehicles in Q3',
          'Energy storage deployments increased 73% year-over-year',
          'Cybertruck production ramping up',
          'Full Self-Driving improvements with version 12',
        ],
        financialMetrics: {
          revenue: '$25.2B',
          netIncome: '$2.2B',
          eps: '$0.72',
          grossMargin: '19.8%',
        },
        sentiment: 'Neutral to Positive',
        managementOutlook: 'Focused on scaling production and reducing costs. Emphasized robotaxi development and AI capabilities. Energy business showing strong momentum.',
        questionsHighlights: [
          'Timeline for next-generation vehicle platform',
          'FSD progress and regulatory approval path',
          'Competition in EV market and pricing strategy',
        ],
      },
    },
  };

  return Promise.resolve(summaries[id] || summaries['1']);
};

export default api;
