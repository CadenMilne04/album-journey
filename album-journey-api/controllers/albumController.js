const albumService = require('../services/albumService');

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

module.exports = {
  getAlbumsByGenre
};
