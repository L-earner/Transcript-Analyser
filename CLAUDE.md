# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React-based earnings call transcript analyzer frontend application. It displays earnings call transcripts from major companies with detailed financial summaries, sentiment analysis, and Q&A highlights. The app currently uses mock data but is designed to connect to a backend API.

## Development Commands

### Start Development Server
```bash
npm run dev
```
Development server runs on port 5173 (default Vite port).

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Lint Code
```bash
npm run lint
```

## Architecture

### Component Structure
The app follows a simple component hierarchy:
- `App.jsx` - Main container managing multi-view state (selector → list → summary)
- `SymbolSelector.jsx` - Multi-select interface for choosing up to 5 stocks
- `TranscriptList.jsx` - Displays grid of transcript cards with client-side search
- `TranscriptSummary.jsx` - Shows detailed summary view for a selected transcript

### State Management
All state is managed in App.jsx using React hooks:
- `view` - Current view: 'selector', 'list', or 'summary'
- `analyzedTranscripts` - List of analyzed transcripts
- `selectedTranscript` - Currently viewed transcript with full summary
- `loading` - Loading state for async operations
- `error` - Error messages to display to user

The app switches between three views: selector for choosing stocks, list for browsing results, and summary for detailed analysis.

### API Integration
`src/services/api.js` contains the Financial Modeling Prep API integration:

**Key Functions:**
- `getEarningsCallTranscript(symbol)` - Fetches latest transcript for a single symbol
- `getMultipleTranscripts(symbols)` - Fetches transcripts for multiple symbols in parallel
- `analyzeTranscript(transcript)` - Analyzes transcript content to extract insights

**Analysis Features:**
The analysis functions extract data from raw transcript text using regex patterns and keyword matching:
- `extractFinancialMetrics()` - Finds revenue, net income, EPS, margins using multiple regex patterns
- `analyzeSentiment()` - Counts positive vs negative keywords to determine sentiment
- `extractKeyHighlights()` - Identifies important mentions of growth, products, initiatives
- `extractManagementOutlook()` - Finds forward-looking statements
- `extractQAHighlights()` - Analyzes Q&A section for common topics

**Console Logging:**
The API service includes extensive console logging for debugging:
- API fetch success/failure
- Transcript content length
- Analysis extraction results
- Sentiment word counts

### Expected API Response Format
Financial Modeling Prep returns earnings call transcripts in this format:
```json
[
  {
    "symbol": "AAPL",
    "quarter": 4,
    "year": 2024,
    "date": "2024-10-31",
    "content": "Full transcript text with all spoken content..."
  }
]
```

The `content` field contains the full transcript text which is then analyzed by the extraction functions.

### Security Configuration
API keys are stored in `.env` file:
```
VITE_FMP_API_KEY=your_api_key_here
VITE_FMP_API_BASE_URL=https://financialmodelingprep.com/api/v3
```

**IMPORTANT:**
- `.env` is in `.gitignore` and must NEVER be committed
- Use `.env.example` as a template
- API key is accessed via `import.meta.env.VITE_FMP_API_KEY`

## Tech Stack
- React 18 (with hooks)
- Vite 7 (build tool & dev server)
- Axios (HTTP client)
- Financial Modeling Prep API (earnings call data)
- ESLint with React hooks and React Refresh plugins
- No state management library - using React hooks
- No routing library - multi-view conditional rendering

## Available Symbols
The app includes 15 pre-configured popular symbols in `POPULAR_SYMBOLS`:
AAPL, MSFT, GOOGL, AMZN, TSLA, META, NVDA, JPM, V, WMT, DIS, NFLX, BA, INTC, AMD

To add more symbols, edit the `POPULAR_SYMBOLS` array in `src/services/api.js`.

## Analysis Improvements
Recent updates improved the transcript analysis to handle real Financial Modeling Prep data:
- Multiple regex patterns for each financial metric (revenue, EPS, margins, etc.)
- Better sentence extraction from transcript content
- More comprehensive keyword lists for sentiment analysis
- Handling of both lowercase and original case content
- Debug logging throughout the analysis pipeline

## Troubleshooting

### No analysis results showing
- Check browser console for debug logs from the API service
- Verify transcript content is being fetched (check content length in logs)
- Ensure regex patterns match the actual transcript format
- Check that the API key is valid and not rate-limited

### "N/A" showing for financial metrics
- The regex patterns may not match the specific wording in that transcript
- Check console logs to see what patterns are being tried
- Financial data may not be mentioned in some transcripts
- Try different symbols to verify the analysis logic

### Build or runtime errors
- Ensure all dependencies are installed: `npm install`
- Check Node.js version (16+ required)
- Verify `.env` file exists with valid API key
- Clear build cache: `rm -rf dist && npm run build`
