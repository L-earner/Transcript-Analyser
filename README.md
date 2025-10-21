# Earnings Call Transcript Analyzer

A modern, beautiful React-based web application for browsing and analyzing earnings call transcripts from leading companies. Built with React, Vite, and a focus on user experience.

![React](https://img.shields.io/badge/React-18-blue)
![Vite](https://img.shields.io/badge/Vite-Latest-646CFF)
![License](https://img.shields.io/badge/License-MIT-green)

## Features

- **Browse Transcripts**: View earnings call transcripts from major companies
- **Smart Search**: Search by company name, ticker symbol, or quarter
- **Detailed Summaries**: View comprehensive summaries including:
  - Key financial highlights
  - Revenue, net income, EPS, and gross margin
  - Overall sentiment analysis
  - Management outlook
  - Q&A session highlights
- **Beautiful UI**: Modern, responsive design with smooth animations
- **Real-time Data**: Connect to your API endpoint for live data
- **Demo Mode**: Includes mock data for testing and demonstration

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Axios** - HTTP client for API calls
- **CSS3** - Modern styling with gradients and animations

## Getting Started

### Prerequisites

- Node.js 16+ and npm

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

3. Configure your API endpoint (optional):
```bash
cp .env.example .env
```

Edit `.env` and set your API base URL:
```
VITE_API_BASE_URL=https://your-api-endpoint.com
```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
Transcript-Analyser/
├── src/
│   ├── components/
│   │   ├── TranscriptList.jsx          # List/search component
│   │   ├── TranscriptList.css
│   │   ├── TranscriptSummary.jsx       # Summary display component
│   │   └── TranscriptSummary.css
│   ├── services/
│   │   └── api.js                      # API service & mock data
│   ├── App.jsx                         # Main app component
│   ├── App.css
│   ├── index.css                       # Global styles
│   └── main.jsx                        # Entry point
├── public/                             # Static assets
├── .env.example                        # Environment variables template
├── package.json
└── README.md
```

## API Integration

### Using Mock Data (Default)

The app comes with mock data for demonstration purposes. No API setup required!

### Connecting to a Real API

To connect to your actual earnings call transcript API:

1. Update `.env` with your API endpoint
2. In `src/App.jsx`, uncomment the real API calls and comment out the mock calls:

```javascript
// Replace this:
const data = await getMockTranscripts();

// With this:
const data = await getTranscripts();
```

### Expected API Endpoints

Your API should provide the following endpoints:

#### GET /transcripts
Returns a list of available transcripts:
```json
[
  {
    "id": "1",
    "company": "Apple Inc.",
    "ticker": "AAPL",
    "quarter": "Q4 2024",
    "date": "2024-10-31",
    "title": "Apple Q4 2024 Earnings Call"
  }
]
```

#### GET /transcripts/:id/summary
Returns detailed summary for a specific transcript:
```json
{
  "id": "1",
  "company": "Apple Inc.",
  "ticker": "AAPL",
  "quarter": "Q4 2024",
  "date": "2024-10-31",
  "title": "Apple Q4 2024 Earnings Call",
  "summary": {
    "keyHighlights": ["...", "..."],
    "financialMetrics": {
      "revenue": "$94.9B",
      "netIncome": "$22.9B",
      "eps": "$1.46",
      "grossMargin": "46.2%"
    },
    "sentiment": "Positive",
    "managementOutlook": "...",
    "questionsHighlights": ["...", "..."]
  }
}
```

#### GET /transcripts/search?q=query
Search transcripts by query string

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Customization

### Styling

The app uses CSS custom properties and gradients. Main colors can be customized in the component CSS files:

- Header gradient: `src/App.css` and `src/components/TranscriptSummary.css`
- Background gradient: `src/App.css`
- Accent colors: Throughout component CSS files

### Adding Features

The modular component structure makes it easy to add new features:

1. Create new components in `src/components/`
2. Add API methods in `src/services/api.js`
3. Import and use in `src/App.jsx`

## Demo Companies Included

The mock data includes transcripts from:
- Apple Inc. (AAPL)
- Microsoft Corporation (MSFT)
- Alphabet Inc. (GOOGL)
- Amazon.com Inc. (AMZN)
- Tesla Inc. (TSLA)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## Support

For issues and questions, please open an issue on GitHub.

---

Built with React + Vite
