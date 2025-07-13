# Album Journey API

A simple Express API that serves album data for different music genres. Features intelligent caching with SQLite and free AI generation using Groq.

## Features

- **Smart Caching**: SQLite database stores generated album data to avoid repeated API calls
- **Groq AI Integration**: Uses free Groq API for generating new genre data
- **Fallback System**: Mock data as ultimate fallback
- **Cache Management**: Admin endpoints to view and clear cached data

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory:
```env
GROQ_API_KEY=your_groq_api_key_here
PORT=3001
```

3. Get a free Groq API key:
   - Go to [console.groq.com](https://console.groq.com)
   - Sign up for a free account
   - Generate an API key
   - Add it to your `.env` file

4. Start the server:
```bash
npm start
```

Or for development with auto-restart:
```bash
npm run dev
```

## How It Works

When you request album data for a genre:

1. **Check Cache First**: Looks in SQLite database for existing data
2. **Generate if Missing**: Uses Groq AI (free) to create new data if not cached
3. **Store Results**: Saves generated data to database for future requests
4. **Fallback**: Uses mock data if Groq is unavailable

This approach provides unlimited genre generation at no cost while ensuring fast responses for previously requested genres.

## API Endpoints

### GET /api/albums/genre/:genre
Returns album data for the specified genre. Checks cache first, generates with Groq if needed.

Example: `GET /api/albums/genre/jazz`
```json
{
  "albums": [...],
  "eras": [...],
  "links": [...],
  "source": "cache" // or "groq", "mock", "none"
}
```

### POST /api/albums/generate/:genre
Forces new generation using Groq AI (bypasses cache).

### GET /api/albums/cache
Returns list of cached genres with timestamps.

### DELETE /api/albums/cache
Clears all cached data.

### GET /api/health
Health check endpoint.

## Configuration

- **GROQ_API_KEY**: Your Groq API key for AI generation (free at console.groq.com)
- **PORT**: Server port (default: 3001)

## Database

- **File**: `albums.db` (SQLite database created automatically)
- **Table**: `album_cache` stores genre data with timestamps
- **Auto-cleanup**: Consider implementing TTL for cache entries in production

## Project Structure

```
├── server.js                  # Main server file
├── albums.db                  # SQLite database (auto-created)
├── routes/
│   └── albumRoutes.js          # API routes
├── controllers/
│   └── albumController.js      # Request handlers
├── services/
│   ├── albumService.js         # Main album data service
│   ├── groqService.js          # Groq AI integration
│   └── databaseService.js      # SQLite cache management
├── .env                        # Environment variables
└── package.json
```
