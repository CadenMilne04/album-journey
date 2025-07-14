const express = require('express');
const albumController = require('../controllers/albumController');

const router = express.Router();

// GET /api/albums/genre/:genre
router.get('/genre/:genre', albumController.getAlbumsByGenre);

// POST /api/albums/generate/:genre (for explicit ChatGPT generation)
router.post('/generate/:genre', albumController.generateAlbumsByGenre);

// GET /api/albums/cache (get cached genres)
router.get('/cache', albumController.getCachedGenres);

// DELETE /api/albums/cache (clear cache)
router.delete('/cache', albumController.clearCache);

// GET /api/albums/search-spotify/:album (test Spotify search)
router.get('/search-spotify/:album', albumController.searchSpotifyAlbum);

module.exports = router;
