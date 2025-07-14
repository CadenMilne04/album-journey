const groqService = require('./groqService');
const databaseService = require('./databaseService');
const spotifyService = require('./spotifyService');

// Mock service for album data - mirrors the frontend mock data
const mockAlbumData = {
  "punk rock": {
    "eras": [
      {
        "id": "pioneer",
        "name": "Pioneer Era",
        "period": "1970s",
        "color": "#ff6b6b",
        "description": "The birth of punk rock",
        "yearRange": [1970, 1979]
      },
      {
        "id": "early_hardcore",
        "name": "Early Hardcore",
        "period": "1980-84",
        "color": "#4ecdc4",
        "description": "Raw energy and DIY ethics",
        "yearRange": [1980, 1984]
      },
      {
        "id": "late_evolution",
        "name": "Late 80s Evolution",
        "period": "1985-89",
        "color": "#45b7d1",
        "description": "Diversification and experimentation",
        "yearRange": [1985, 1989]
      },
      {
        "id": "grunge_alternative",
        "name": "Grunge & Alternative",
        "period": "1990-94",
        "color": "#96ceb4",
        "description": "Mainstream breakthrough",
        "yearRange": [1990, 1994]
      },
      {
        "id": "pop_punk",
        "name": "Pop Punk Era",
        "period": "1995+",
        "color": "#feca57",
        "description": "Commercial success and accessibility",
        "yearRange": [1995, 2030]
      }
    ],
    "albums": [
      {
        "id": "ramones_1976",
        "title": "Ramones",
        "artist": "Ramones",
        "release_date": "1976-04-23",
        "genres": ["punk rock", "garage punk"],
        "spotify_url": "https://open.spotify.com/album/ramones_1976",
        "cover_image": "https://via.placeholder.com/300x300/1DB954/000000?text=Ramones",
        "popularity": 85,
        "influences": [],
        "influencees": ["sex_pistols_1977", "clash_1977", "dead_kennedys_1980"],
        "context": {
          "description": "Debut album that essentially created the punk rock template",
          "critical_reception": "Revolutionary simplicity that changed rock music forever",
          "cultural_impact": "Established the punk aesthetic and sound that influenced generations"
        }
      },
      {
        "id": "sex_pistols_1977",
        "title": "Never Mind the Bollocks, Here's the Sex Pistols",
        "artist": "Sex Pistols",
        "release_date": "1977-10-28",
        "genres": ["punk rock", "british punk"],
        "spotify_url": "https://open.spotify.com/album/sex_pistols_1977",
        "cover_image": "https://via.placeholder.com/300x300/1DB954/000000?text=Sex+Pistols",
        "popularity": 88,
        "influences": ["ramones_1976"],
        "influencees": ["clash_1977", "buzzcocks_1978", "minor_threat_1981"],
        "context": {
          "description": "Explosive debut that defined British punk's rebellious spirit",
          "critical_reception": "Controversial masterpiece that shocked and inspired",
          "cultural_impact": "Sparked punk movement in UK and influenced DIY ethics"
        }
      },
      {
        "id": "clash_1977",
        "title": "The Clash",
        "artist": "The Clash",
        "release_date": "1977-04-08",
        "genres": ["punk rock", "british punk", "reggae punk"],
        "spotify_url": "https://open.spotify.com/album/clash_1977",
        "cover_image": "https://via.placeholder.com/300x300/1DB954/000000?text=The+Clash",
        "popularity": 82,
        "influences": ["ramones_1976", "sex_pistols_1977"],
        "influencees": ["rancid_1995", "green_day_1994"],
        "context": {
          "description": "Politically charged punk that incorporated reggae and ska influences",
          "critical_reception": "Praised for musical diversity within punk framework",
          "cultural_impact": "Brought punk to mainstream while maintaining credibility"
        }
      },
      {
        "id": "television_1977",
        "title": "Marquee Moon",
        "artist": "Television",
        "release_date": "1977-02-08",
        "genres": ["punk rock", "art punk", "post punk"],
        "spotify_url": "https://open.spotify.com/album/television_1977",
        "cover_image": "https://via.placeholder.com/300x300/1DB954/000000?text=Television",
        "popularity": 75,
        "influences": [],
        "influencees": ["sonic_youth_1988", "pavement_1992"],
        "context": {
          "description": "Art punk masterpiece with intricate guitar work and poetic lyrics",
          "critical_reception": "Critically acclaimed for sophistication within punk movement",
          "cultural_impact": "Influenced art rock and indie movements"
        }
      },
      {
        "id": "buzzcocks_1978",
        "title": "Singles Going Steady",
        "artist": "Buzzcocks",
        "release_date": "1978-09-25",
        "genres": ["punk rock", "pop punk"],
        "spotify_url": "https://open.spotify.com/album/buzzcocks_1978",
        "cover_image": "https://via.placeholder.com/300x300/1DB954/000000?text=Buzzcocks",
        "popularity": 72,
        "influences": ["sex_pistols_1977"],
        "influencees": ["green_day_1994", "blink_182_1999"],
        "context": {
          "description": "Perfect fusion of punk energy with pop sensibilities",
          "critical_reception": "Praised for melodic hooks within punk framework",
          "cultural_impact": "Created the template for pop punk genre"
        }
      },
      {
        "id": "dead_kennedys_1980",
        "title": "Fresh Fruit for Rotting Vegetables",
        "artist": "Dead Kennedys",
        "release_date": "1980-09-02",
        "genres": ["hardcore punk", "punk rock"],
        "spotify_url": "https://open.spotify.com/album/dead_kennedys_1980",
        "cover_image": "https://via.placeholder.com/300x300/1DB954/000000?text=Dead+Kennedys",
        "popularity": 78,
        "influences": ["ramones_1976"],
        "influencees": ["minor_threat_1981", "black_flag_1981"],
        "context": {
          "description": "Sardonic political punk with surf rock influences",
          "critical_reception": "Celebrated for wit and musical innovation",
          "cultural_impact": "Influenced hardcore punk and alternative rock"
        }
      },
      {
        "id": "minor_threat_1981",
        "title": "Minor Threat",
        "artist": "Minor Threat",
        "release_date": "1981-06-01",
        "genres": ["hardcore punk", "straight edge"],
        "spotify_url": "https://open.spotify.com/album/minor_threat_1981",
        "cover_image": "https://via.placeholder.com/300x300/1DB954/000000?text=Minor+Threat",
        "popularity": 76,
        "influences": ["dead_kennedys_1980", "sex_pistols_1977"],
        "influencees": ["black_flag_1981", "fugazi_1988"],
        "context": {
          "description": "Pioneering straight edge hardcore with lightning-fast songs",
          "critical_reception": "Influential despite brief career",
          "cultural_impact": "Created straight edge movement and influenced punk ethics"
        }
      },
      {
        "id": "black_flag_1981",
        "title": "Damaged",
        "artist": "Black Flag",
        "release_date": "1981-12-05",
        "genres": ["hardcore punk", "punk rock"],
        "spotify_url": "https://open.spotify.com/album/black_flag_1981",
        "cover_image": "https://via.placeholder.com/300x300/1DB954/000000?text=Black+Flag",
        "popularity": 74,
        "influences": ["dead_kennedys_1980", "minor_threat_1981"],
        "influencees": ["sonic_youth_1988", "nirvana_1991"],
        "context": {
          "description": "Brutal hardcore masterpiece with Henry Rollins' intense vocals",
          "critical_reception": "Defining album of hardcore punk genre",
          "cultural_impact": "Influenced grunge and alternative rock movements"
        }
      },
      {
        "id": "husker_du_1984",
        "title": "Zen Arcade",
        "artist": "Hüsker Dü",
        "release_date": "1984-07-01",
        "genres": ["alternative rock", "punk rock", "hardcore punk"],
        "spotify_url": "https://open.spotify.com/album/husker_du_1984",
        "cover_image": "https://via.placeholder.com/300x300/1DB954/000000?text=Husker+Du",
        "popularity": 68,
        "influences": ["minor_threat_1981"],
        "influencees": ["nirvana_1991", "pavement_1992"],
        "context": {
          "description": "Double album that bridged hardcore and alternative rock",
          "critical_reception": "Praised for ambitious scope and melodic punk evolution",
          "cultural_impact": "Influenced grunge and indie rock movements"
        }
      },
      {
        "id": "replacements_1984",
        "title": "Let It Be",
        "artist": "The Replacements",
        "release_date": "1984-10-02",
        "genres": ["alternative rock", "punk rock"],
        "spotify_url": "https://open.spotify.com/album/replacements_1984",
        "cover_image": "https://via.placeholder.com/300x300/1DB954/000000?text=Replacements",
        "popularity": 70,
        "influences": [],
        "influencees": ["nirvana_1991", "green_day_1994"],
        "context": {
          "description": "Heartfelt punk with country and rock influences",
          "critical_reception": "Critical favorite for emotional depth",
          "cultural_impact": "Influenced alternative rock's emotional honesty"
        }
      },
      {
        "id": "fugazi_1988",
        "title": "Fugazi",
        "artist": "Fugazi",
        "release_date": "1988-01-01",
        "genres": ["post-hardcore", "punk rock"],
        "spotify_url": "https://open.spotify.com/album/fugazi_1988",
        "cover_image": "https://via.placeholder.com/300x300/1DB954/000000?text=Fugazi",
        "popularity": 65,
        "influences": ["minor_threat_1981"],
        "influencees": [],
        "context": {
          "description": "Ian MacKaye's post-Minor Threat project with complex arrangements",
          "critical_reception": "Praised for innovation within punk framework",
          "cultural_impact": "Influenced post-hardcore and emo movements"
        }
      },
      {
        "id": "sonic_youth_1988",
        "title": "Daydream Nation",
        "artist": "Sonic Youth",
        "release_date": "1988-10-18",
        "genres": ["alternative rock", "noise rock", "punk rock"],
        "spotify_url": "https://open.spotify.com/album/sonic_youth_1988",
        "cover_image": "https://via.placeholder.com/300x300/1DB954/000000?text=Sonic+Youth",
        "popularity": 77,
        "influences": ["television_1977", "black_flag_1981"],
        "influencees": ["nirvana_1991", "pavement_1992"],
        "context": {
          "description": "Noise rock masterpiece with experimental guitar techniques",
          "critical_reception": "Critical acclaim for artistic innovation",
          "cultural_impact": "Bridged punk and art rock, influenced grunge"
        }
      },
      {
        "id": "nirvana_1991",
        "title": "Nevermind",
        "artist": "Nirvana",
        "release_date": "1991-09-24",
        "genres": ["grunge", "alternative rock", "punk rock"],
        "spotify_url": "https://open.spotify.com/album/nirvana_1991",
        "cover_image": "https://via.placeholder.com/300x300/1DB954/000000?text=Nirvana",
        "popularity": 95,
        "influences": ["black_flag_1981", "husker_du_1984", "replacements_1984", "sonic_youth_1988"],
        "influencees": ["green_day_1994"],
        "context": {
          "description": "Grunge breakthrough that brought alternative rock to mainstream",
          "critical_reception": "Revolutionary album that defined a generation",
          "cultural_impact": "Made alternative rock mainstream and influenced countless bands"
        }
      },
      {
        "id": "pavement_1992",
        "title": "Slanted and Enchanted",
        "artist": "Pavement",
        "release_date": "1992-04-20",
        "genres": ["indie rock", "alternative rock", "punk rock"],
        "spotify_url": "https://open.spotify.com/album/pavement_1992",
        "cover_image": "https://via.placeholder.com/300x300/1DB954/000000?text=Pavement",
        "popularity": 62,
        "influences": ["television_1977", "husker_du_1984", "sonic_youth_1988"],
        "influencees": [],
        "context": {
          "description": "Lo-fi indie rock with punk influences and experimental approach",
          "critical_reception": "Critical darling for DIY aesthetic",
          "cultural_impact": "Influenced indie rock and lo-fi movements"
        }
      },
      {
        "id": "green_day_1994",
        "title": "Dookie",
        "artist": "Green Day",
        "release_date": "1994-02-01",
        "genres": ["punk rock", "pop punk"],
        "spotify_url": "https://open.spotify.com/album/green_day_1994",
        "cover_image": "https://via.placeholder.com/300x300/1DB954/000000?text=Green+Day",
        "popularity": 90,
        "influences": ["buzzcocks_1978", "clash_1977", "replacements_1984", "nirvana_1991"],
        "influencees": ["blink_182_1999"],
        "context": {
          "description": "Pop punk breakthrough that brought punk to mainstream radio",
          "critical_reception": "Commercial success while maintaining punk credibility",
          "cultural_impact": "Revitalized punk for new generation"
        }
      },
      {
        "id": "rancid_1995",
        "title": "...And Out Come the Wolves",
        "artist": "Rancid",
        "release_date": "1995-08-22",
        "genres": ["punk rock", "ska punk"],
        "spotify_url": "https://open.spotify.com/album/rancid_1995",
        "cover_image": "https://via.placeholder.com/300x300/1DB954/000000?text=Rancid",
        "popularity": 73,
        "influences": ["clash_1977"],
        "influencees": [],
        "context": {
          "description": "Ska-influenced punk with working class themes",
          "critical_reception": "Praised for authentic punk spirit",
          "cultural_impact": "Kept punk relevant during grunge era"
        }
      },
      {
        "id": "blink_182_1999",
        "title": "Enema of the State",
        "artist": "Blink-182",
        "release_date": "1999-06-01",
        "genres": ["pop punk", "punk rock"],
        "spotify_url": "https://open.spotify.com/album/blink_182_1999",
        "cover_image": "https://via.placeholder.com/300x300/1DB954/000000?text=Blink-182",
        "popularity": 87,
        "influences": ["buzzcocks_1978", "green_day_1994"],
        "influencees": [],
        "context": {
          "description": "Polished pop punk with humorous lyrics and catchy melodies",
          "critical_reception": "Commercial success with broad appeal",
          "cultural_impact": "Defined late 90s pop punk sound"
        }
      }
    ],
    "links": [
      { "source": "ramones_1976", "target": "sex_pistols_1977", "type": "influence" },
      { "source": "ramones_1976", "target": "clash_1977", "type": "influence" },
      { "source": "ramones_1976", "target": "dead_kennedys_1980", "type": "influence" },
      { "source": "sex_pistols_1977", "target": "clash_1977", "type": "influence" },
      { "source": "sex_pistols_1977", "target": "buzzcocks_1978", "type": "influence" },
      { "source": "sex_pistols_1977", "target": "minor_threat_1981", "type": "influence" },
      { "source": "buzzcocks_1978", "target": "green_day_1994", "type": "influence" },
      { "source": "buzzcocks_1978", "target": "blink_182_1999", "type": "influence" },
      { "source": "dead_kennedys_1980", "target": "minor_threat_1981", "type": "influence" },
      { "source": "dead_kennedys_1980", "target": "black_flag_1981", "type": "influence" },
      { "source": "minor_threat_1981", "target": "black_flag_1981", "type": "influence" },
      { "source": "minor_threat_1981", "target": "fugazi_1988", "type": "influence" },
      { "source": "minor_threat_1981", "target": "husker_du_1984", "type": "influence" },
      { "source": "black_flag_1981", "target": "sonic_youth_1988", "type": "influence" },
      { "source": "black_flag_1981", "target": "nirvana_1991", "type": "influence" },
      { "source": "husker_du_1984", "target": "nirvana_1991", "type": "influence" },
      { "source": "husker_du_1984", "target": "pavement_1992", "type": "influence" },
      { "source": "replacements_1984", "target": "nirvana_1991", "type": "influence" },
      { "source": "replacements_1984", "target": "green_day_1994", "type": "influence" },
      { "source": "television_1977", "target": "sonic_youth_1988", "type": "influence" },
      { "source": "television_1977", "target": "pavement_1992", "type": "influence" },
      { "source": "sonic_youth_1988", "target": "nirvana_1991", "type": "influence" },
      { "source": "sonic_youth_1988", "target": "pavement_1992", "type": "influence" },
      { "source": "nirvana_1991", "target": "green_day_1994", "type": "influence" },
      { "source": "clash_1977", "target": "rancid_1995", "type": "influence" },
      { "source": "clash_1977", "target": "green_day_1994", "type": "influence" },
      { "source": "green_day_1994", "target": "blink_182_1999", "type": "influence" }
    ]
  }
};

const getAlbumsForGenre = async (genre) => {
  const normalizedGenre = genre.toLowerCase().trim();
  
  // First check the database cache
  try {
    const cachedData = await databaseService.getAlbumData(normalizedGenre);
    if (cachedData) {
      // Check if cached albums already have album art
      const needsEnrichment = cachedData.albums && cachedData.albums.some(album => !album.albumArt);
      
      if (needsEnrichment) {
        console.log('Cached data found but missing album art, enriching...');
        const enrichedAlbums = await enrichAlbumsWithSpotifyData(cachedData.albums || []);
        const enrichedData = {
          ...cachedData,
          albums: enrichedAlbums
        };
        
        // Update cache with enriched data
        try {
          await databaseService.saveAlbumData(normalizedGenre, enrichedData);
        } catch (updateError) {
          console.error('Error updating cache with album art:', updateError.message);
        }
        
        return {
          albums: enrichedData.albums || [],
          links: enrichedData.links || [],
          eras: enrichedData.eras || [],
          source: 'cache-enriched'
        };
      }
      
      return {
        albums: cachedData.albums || [],
        links: cachedData.links || [],
        eras: cachedData.eras || [],
        source: 'cache'
      };
    }
  } catch (error) {
    console.error('Error checking cache:', error.message);
  }
  
  // Try Groq AI service
  if (groqService.isAvailable()) {
    try {
      console.log(`Generating album data for "${genre}" using Groq...`);
      const generatedData = await groqService.generateAlbumData(genre);
      
      // Enrich albums with Spotify album art
      const enrichedAlbums = await enrichAlbumsWithSpotifyData(generatedData.albums || []);
      
      const enrichedData = {
        ...generatedData,
        albums: enrichedAlbums
      };
      
      // Cache the enriched data
      try {
        await databaseService.saveAlbumData(normalizedGenre, enrichedData);
      } catch (cacheError) {
        console.error('Error caching generated data:', cacheError.message);
      }
      
      return {
        albums: enrichedData.albums || [],
        links: enrichedData.links || [],
        eras: enrichedData.eras || [],
        source: 'groq'
      };
    } catch (error) {
      console.error('Groq generation failed, falling back to mock data:', error.message);
    }
  }
  
  // Fallback to mock data
  console.log(`Using mock data for "${genre}"`);
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const data = mockAlbumData[normalizedGenre];
  
  if (!data) {
    return { albums: [], links: [], eras: [], source: 'none' };
  }
  
  // Enrich mock albums with Spotify album art
  const enrichedAlbums = await enrichAlbumsWithSpotifyData(data.albums || []);
  const enrichedData = {
    ...data,
    albums: enrichedAlbums
  };
  
  // Cache enriched mock data
  try {
    await databaseService.saveAlbumData(normalizedGenre, enrichedData);
  } catch (cacheError) {
    console.error('Error caching mock data:', cacheError.message);
  }
  
  return {
    albums: enrichedData.albums || [],
    links: enrichedData.links || [],
    eras: enrichedData.eras || [],
    source: 'mock'
  };
};

// Helper function to enrich albums with Spotify album art
const enrichAlbumsWithSpotifyData = async (albums) => {
  if (!spotifyService.isAvailable()) {
    console.log('Spotify service not available, skipping album art enrichment');
    return albums;
  }

  console.log(`🎵 Enriching ${albums.length} albums with Spotify data...`);
  
  const enrichedAlbums = await Promise.all(
    albums.map(async (album) => {
      try {
        const albumArtUrl = await spotifyService.getAlbumArtUrl(album.title, album.artist);
        
        return {
          ...album,
          albumArt: albumArtUrl || `https://via.placeholder.com/300x300/1DB954/000000?text=${encodeURIComponent(album.artist)}`
        };
      } catch (error) {
        console.error(`Error fetching album art for "${album.title}" by ${album.artist}:`, error.message);
        return {
          ...album,
          albumArt: `https://via.placeholder.com/300x300/1DB954/000000?text=${encodeURIComponent(album.artist)}`
        };
      }
    })
  );

  console.log(`✅ Successfully enriched albums with Spotify data`);
  return enrichedAlbums;
};

const getAvailableGenres = () => {
  return Object.keys(mockAlbumData);
};

const getCachedGenres = async () => {
  try {
    return await databaseService.getCachedGenres();
  } catch (error) {
    console.error('Error fetching cached genres:', error.message);
    return [];
  }
};

const clearCache = async () => {
  try {
    await databaseService.clearCache();
    return { success: true, message: 'Cache cleared successfully' };
  } catch (error) {
    console.error('Error clearing cache:', error.message);
    return { success: false, message: 'Failed to clear cache' };
  }
};

const getGenreSuggestions = async () => {
  try {
    const cachedGenres = await databaseService.getCachedGenres();
    // Extract just the genre names and sort them
    const genreNames = cachedGenres.map(row => row.genre).sort();
    return genreNames;
  } catch (error) {
    console.error('Error fetching genre suggestions:', error.message);
    return [];
  }
};

module.exports = {
  getAlbumsForGenre,
  getAvailableGenres,
  getCachedGenres,
  clearCache,
  getGenreSuggestions
};
