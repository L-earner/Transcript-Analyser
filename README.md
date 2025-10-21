# Earnings Call Transcript Analyzer

A modern, beautiful React-based web application for analyzing earnings call transcripts from leading companies. Select up to 5 companies, fetch their latest earnings call transcripts via the Financial Modeling Prep API, and view AI-powered analysis with key insights.

![React](https://img.shields.io/badge/React-18-blue)
![Vite](https://img.shields.io/badge/Vite-Latest-646CFF)
![License](https://img.shields.io/badge/License-MIT-green)

## Features

- **Multi-Symbol Selection**: Choose up to 5 companies from a curated list of popular stocks
- **Real-time API Integration**: Fetches latest earnings call transcripts from Financial Modeling Prep API
- **Smart Analysis**: Automatically analyzes transcripts to extract:
  - Key financial highlights
  - Revenue, net income, EPS, and gross margin metrics
  - Sentiment analysis (Positive, Neutral, Negative)
  - Management outlook and forward guidance
  - Q&A session highlights
- **Beautiful UI**: Modern, responsive design with gradient cards and smooth animations
- **Secure API Key Management**: Environment-based configuration keeps your API key safe
- **Error Handling**: Robust error handling with user-friendly messages

## Tech Stack

- **React 18** - UI framework with hooks
- **Vite** - Lightning-fast build tool and dev server
- **Axios** - HTTP client for API calls
- **Financial Modeling Prep API** - Real earnings call transcript data
- **CSS3** - Modern styling with gradients, animations, and responsive design

## Getting Started

### Prerequisites

- Node.js 16+ and npm
- Financial Modeling Prep API key (get one free at [financialmodelingprep.com](https://financialmodelingprep.com/developer/docs/))

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Transcript-Analyser
```

2. Install dependencies:
```bash
npm install
```

3. **Configure your API key** (IMPORTANT):
```bash
cp .env.example .env
```

Edit `.env` and add your Financial Modeling Prep API key:
```
VITE_FMP_API_KEY=your_actual_api_key_here
VITE_FMP_API_BASE_URL=https://financialmodelingprep.com/api/v3
```

⚠️ **Security Note**: Never commit your `.env` file! It's already in `.gitignore` to prevent accidental commits.

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

## How to Use

### Step 1: Select Symbols
- Choose up to 5 companies from the dropdown list
- Includes popular stocks like AAPL, MSFT, GOOGL, AMZN, TSLA, and more
- Selected symbols are highlighted with a checkmark

### Step 2: Analyze
- Click the "Analyze Transcripts" button
- The app fetches the latest earnings call transcripts from the API
- Automatic analysis extracts key insights and metrics

### Step 3: Browse Results
- View all analyzed transcripts in a card grid
- Search by company name, ticker, or quarter
- Click any card to see detailed analysis

### Step 4: View Details
- See comprehensive breakdown of the earnings call
- Financial metrics dashboard
- Sentiment analysis
- Key highlights and management outlook
- Q&A session insights

## Project Structure

```
Transcript-Analyser/
├── src/
│   ├── components/
│   │   ├── SymbolSelector.jsx         # Multi-select symbol picker
│   │   ├── SymbolSelector.css
│   │   ├── TranscriptList.jsx         # List/search component
│   │   ├── TranscriptList.css
│   │   ├── TranscriptSummary.jsx      # Detailed summary view
│   │   └── TranscriptSummary.css
│   ├── services/
│   │   └── api.js                     # API integration & analysis
│   ├── App.jsx                        # Main app component
│   ├── App.css
│   ├── index.css                      # Global styles
│   └── main.jsx                       # Entry point
├── .env                               # Your API key (DO NOT COMMIT)
├── .env.example                       # Template for API configuration
├── .gitignore                         # Includes .env
├── package.json
└── README.md
```

## API Integration

### Financial Modeling Prep API

This app uses the [Financial Modeling Prep API](https://financialmodelingprep.com/) to fetch earnings call transcripts.

**Endpoint Used:**
```
GET https://financialmodelingprep.com/api/v3/earning_call_transcript/{SYMBOL}?apikey={YOUR_KEY}
```

**Response Format:**
```json
[
  {
    "symbol": "AAPL",
    "quarter": 4,
    "year": 2024,
    "date": "2024-10-31",
    "content": "Full transcript text..."
  }
]
```

### Analysis Features

The app performs intelligent analysis on each transcript:

1. **Financial Metrics Extraction**: Uses regex patterns to find revenue, net income, EPS, and margin data
2. **Sentiment Analysis**: Counts positive vs. negative keywords to determine overall sentiment
3. **Key Highlights**: Extracts important mentions of growth, products, and strategic initiatives
4. **Management Outlook**: Identifies forward-looking statements and guidance
5. **Q&A Insights**: Analyzes question topics and management responses

## Security Best Practices

✅ **What we do:**
- Store API keys in environment variables (`.env`)
- Add `.env` to `.gitignore` to prevent commits
- Validate API key presence on app load
- Use HTTPS for all API calls
- Provide `.env.example` as a template

❌ **What you should NEVER do:**
- Commit `.env` files to version control
- Share your API key publicly
- Hardcode API keys in source files
- Push API keys to GitHub/GitLab

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Available Symbols

The app includes 15 popular symbols:
- AAPL (Apple)
- MSFT (Microsoft)
- GOOGL (Alphabet)
- AMZN (Amazon)
- TSLA (Tesla)
- META (Meta)
- NVDA (NVIDIA)
- JPM (JPMorgan Chase)
- V (Visa)
- WMT (Walmart)
- DIS (Disney)
- NFLX (Netflix)
- BA (Boeing)
- INTC (Intel)
- AMD (AMD)

Want to add more? Edit `POPULAR_SYMBOLS` in `src/services/api.js`

## Customization

### Adding More Symbols

Edit `src/services/api.js`:
```javascript
export const POPULAR_SYMBOLS = [
  // ... existing symbols
  { value: 'TICKER', label: 'Company Name (TICKER)' },
];
```

### Styling

Customize colors and gradients in component CSS files:
- Header gradient: `src/App.css` and `src/components/TranscriptSummary.css`
- Background: `src/App.css`
- Accent colors: Individual component CSS files

### Analysis Logic

Modify extraction and analysis in `src/services/api.js`:
- `extractFinancialMetrics()` - Financial data extraction
- `analyzeSentiment()` - Sentiment analysis logic
- `extractKeyHighlights()` - Highlight extraction
- `extractManagementOutlook()` - Outlook extraction

## Troubleshooting

### "API key is missing" error
- Make sure you created `.env` file
- Check that `VITE_FMP_API_KEY` is set correctly
- Restart the dev server after creating `.env`

### "Invalid API key" error
- Verify your API key at [Financial Modeling Prep](https://financialmodelingprep.com/)
- Check for extra spaces in `.env` file
- Make sure you're using a valid, active API key

### No transcripts found
- The selected company might not have recent earnings calls
- Try different symbols
- Check if the API is accessible in your region

### Build fails
- Run `npm install` to ensure all dependencies are installed
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check Node.js version (16+ required)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For issues and questions:
- Open an issue on GitHub
- Check the troubleshooting section above
- Review the [Financial Modeling Prep API docs](https://financialmodelingprep.com/developer/docs/)

## Acknowledgments

- Data provided by [Financial Modeling Prep](https://financialmodelingprep.com/)
- Built with [React](https://react.dev/) and [Vite](https://vitejs.dev/)

---

Built with React + Vite | Powered by Financial Modeling Prep API
