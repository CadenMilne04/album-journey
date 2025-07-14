const axios = require('axios');

class SpotifyService {
  constructor() {
    this.clientId = process.env.SPOTIFY_CLIENT_ID;
    this.clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
    this.accessToken = null;
    this.tokenExpiry = null;
    
    if (!this.clientId || !this.clientSecret) {
      console.warn('Spotify credentials not found. Spotify service will be disabled.');
    }
  }

  async getAccessToken() {
    // Check if we have a valid token
    if (this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    try {
      const credentials = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');
      
      const response = await axios.post('https://accounts.spotify.com/api/token', 
        'grant_type=client_credentials',
        {
          headers: {
            'Authorization': `Basic ${credentials}`,
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      this.accessToken = response.data.access_token;
      // Set expiry to 5 minutes before actual expiry for safety
      this.tokenExpiry = Date.now() + (response.data.expires_in - 300) * 1000;
      
      console.log('✅ Spotify access token obtained');
      return this.accessToken;
    } catch (error) {
      console.error('❌ Failed to get Spotify access token:', error.response?.data || error.message);
      throw new Error('Failed to authenticate with Spotify');
    }
  }

  async searchAlbum(albumTitle, artistName = '') {
    if (!this.clientId || !this.clientSecret) {
      throw new Error('Spotify credentials not configured');
    }

    try {
      const token = await this.getAccessToken();
      
      // Create search query - include artist if provided for better accuracy
      let searchQuery = `album:"${albumTitle}"`;
      if (artistName) {
        searchQuery += ` artist:"${artistName}"`;
      }
      
      console.log(`🔍 Searching Spotify for: ${searchQuery}`);
      
      const response = await axios.get('https://api.spotify.com/v1/search', {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        params: {
          q: searchQuery,
          type: 'album',
          limit: 1
        }
      });

      const albums = response.data.albums.items;
      
      if (albums.length === 0) {
        console.log(`❌ No album found for: ${albumTitle}${artistName ? ` by ${artistName}` : ''}`);
        return null;
      }

      const album = albums[0];
      const imageUrl = album.images && album.images.length > 0 ? album.images[0].url : null;
      
      console.log(`✅ Found album: ${album.name} by ${album.artists.map(a => a.name).join(', ')}`);
      
      return {
        name: album.name,
        artist: album.artists.map(a => a.name).join(', '),
        imageUrl: imageUrl,
        spotifyUrl: album.external_urls.spotify,
        releaseDate: album.release_date
      };
      
    } catch (error) {
      console.error(`❌ Error searching for album "${albumTitle}":`, error.response?.data || error.message);
      return null;
    }
  }

  async getAlbumArtUrl(albumTitle, artistName = '') {
    try {
      const albumData = await this.searchAlbum(albumTitle, artistName);
      return albumData ? albumData.imageUrl : null;
    } catch (error) {
      console.error(`Error getting album art for "${albumTitle}":`, error.message);
      return null;
    }
  }

  isAvailable() {
    return !!(this.clientId && this.clientSecret);
  }
}

module.exports = new SpotifyService();
