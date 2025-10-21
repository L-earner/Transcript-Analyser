# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React-based earnings call transcript analyzer frontend application. It displays earnings call transcripts from major companies with detailed financial summaries, sentiment analysis, and Q&A highlights. The app currently uses mock data but is designed to connect to a backend API.

## Development Commands

### Start Development Server
```bash
npm run dev
```
Development server runs on port 5000 (configured for hosted environments with WSS HMR).

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```
Preview server also runs on port 5000.

### Lint Code
```bash
npm run lint
```

## Architecture

### Component Structure
The app follows a simple component hierarchy:
- `App.jsx` - Main container managing state for transcript list and selected transcript
- `TranscriptList.jsx` - Displays grid of transcript cards with client-side search
- `TranscriptSummary.jsx` - Shows detailed summary view for a selected transcript

### State Management
All state is managed in App.jsx using React hooks:
- `transcripts` - List of all transcripts
- `selectedTranscript` - Currently viewed transcript with full summary
- `loading` / `summaryLoading` - Loading states for async operations

The app switches between list view and detail view based on whether `selectedTranscript` is null.

### API Integration
`src/services/api.js` contains both real API functions and mock data functions:
- **Mock functions** (currently used): `getMockTranscripts()`, `getMockTranscriptSummary(id)`
- **Real API functions** (ready to use): `getTranscripts()`, `getTranscriptSummary(id)`, `searchTranscripts(query)`

To switch from mock to real API:
1. Set `VITE_API_BASE_URL` in `.env`
2. In `App.jsx`, replace `getMockTranscripts()` with `getTranscripts()` and `getMockTranscriptSummary(id)` with `getTranscriptSummary(id)`

### Expected API Contract
The backend API should provide:
- `GET /transcripts` - Returns array of transcript metadata
- `GET /transcripts/:id/summary` - Returns full transcript with summary object
- `GET /transcripts/search?q=query` - Returns filtered transcripts

Each transcript object should include: `id`, `company`, `ticker`, `quarter`, `date`, `title`

Summary object should include: `keyHighlights`, `financialMetrics`, `sentiment`, `managementOutlook`, `questionsHighlights`

### Vite Configuration
The server is configured for hosted environments:
- Listens on `0.0.0.0:5000`
- HMR uses WSS protocol on port 443 (for reverse proxy setups)
- Strict port enforcement enabled

## Tech Stack
- React 19
- Vite 7 (build tool & dev server)
- Axios (HTTP client)
- ESLint with React hooks and React Refresh plugins
- No state management library - using React hooks
- No routing library - single page with conditional rendering
