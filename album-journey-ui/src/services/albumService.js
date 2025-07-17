// API configuration
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://albumai.cadenmilne.com/api'
  : 'http://localhost:3001/api';

export const getAlbumsForGenre = async (genre) => {
  try {
    const response = await fetch(`${API_BASE_URL}/albums/genre/${encodeURIComponent(genre)}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        return { albums: [], links: [], eras: [] };
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return {
      albums: data.albums || [],
      links: data.links || [],
      eras: data.eras || []
    };
  } catch (error) {
    console.error('Error fetching albums from API:', error);
    return { albums: [], links: [], eras: [] };
  }
};

export const getGenreSuggestions = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/albums/genres/suggestions`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.genres || [];
  } catch (error) {
    console.error('Error fetching genre suggestions from API:', error);
    return [];
  }
};
