# Offer Intelligence

Upload an offer letter and get initial AI-powered insight into compensation, terms, risks, and negotiation areas.

## Problem

Candidates often struggle to understand offer letters, especially compensation breakdowns, notice periods, variable pay, bonds, probation, and hidden clauses.

## Current Features

- Offer letter upload
- Supports PDF, DOCX, TXT
- Backend document parsing
- Extracted text preview
- Initial AI insight/summary
- Uploaded offer letter list
- Local in-memory state for current session

## Tech Stack

Frontend
- Next.js 14 App Router
- React 18
- TypeScript
- Tailwind CSS

Backend
- Node.js
- Express
- Multer

Document Processing
- pdf-parse
- mammoth

AI
- OpenAI API

## Current Limitations

- No database yet
- No auth yet
- History is lost on refresh
- AI output is currently early-stage
- Structured offer extraction and risk engine are in progress
- API key must be configured locally in `backend/.env`

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Create the backend environment file:

```bash
cp backend/.env.example backend/.env
```

3. Add your OpenAI API key to `backend/.env`:

```env
OPENAI_API_KEY=your_openai_api_key_here
```

4. Start the backend:

```bash
npm run dev:backend
```

5. Start the full app:

```bash
npm run dev
```

6. Open the frontend:

```text
http://localhost:3000
```

## Roadmap

- Structured offer extraction
- Rule-based risk engine
- Offer score
- Recommendation section
- Persistent history
- Compare two offers
- Auth later

## Security Note

Real API keys should never be committed to the repository. Use `backend/.env` for local secrets only. Environment files are ignored by Git.
