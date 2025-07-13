const express = require('express');
const albumController = require('../controllers/albumController');

const router = express.Router();

// GET /api/albums/genre/:genre
router.get('/genre/:genre', albumController.getAlbumsByGenre);

module.exports = router;
