const albumService = require('../services/albumService');
const groqService = require('../services/groqService');

const getAlbumsByGenre = async (req, res) => {
  try {
    const { genre } = req.params;
    const data = await albumService.getAlbumsForGenre(genre);
    
    if (!data || (!data.albums.length && !data.eras.length)) {
      return res.status(404).json({ 
        error: 'Genre not found',
        message: `No albums found for genre: ${genre}`
      });
    }
    
    res.json(data);
  } catch (error) {
    console.error('Error fetching albums:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to fetch albums'
    });
  }
};

const generateAlbumsByGenre = async (req, res) => {
  try {
    const { genre } = req.params;
    
    if (!groqService.isAvailable()) {
      return res.status(503).json({
        error: 'Service unavailable',
        message: 'Groq service is not configured. Please set GROQ_API_KEY in environment variables.'
      });
    }
    
    const data = await groqService.generateAlbumData(genre);
    res.json(data);
  } catch (error) {
    console.error('Error generating albums:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to generate albums with Groq'
    });
  }
};

const getCachedGenres = async (req, res) => {
  try {
    const cachedGenres = await albumService.getCachedGenres();
    res.json({
      cached_genres: cachedGenres,
      count: cachedGenres.length
    });
  } catch (error) {
    console.error('Error fetching cached genres:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch cached genres'
    });
  }
};

const clearCache = async (req, res) => {
  try {
    const result = await albumService.clearCache();
    if (result.success) {
      res.json(result);
    } else {
      res.status(500).json(result);
    }
  } catch (error) {
    console.error('Error clearing cache:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to clear cache'
    });
  }
};

module.exports = {
  getAlbumsByGenre,
  generateAlbumsByGenre,
  getCachedGenres,
  clearCache
};
