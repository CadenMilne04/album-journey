// Mock service for album data - will be replaced with real API calls later
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
        "popularity": 70,
        "influences": ["sex_pistols_1977", "dead_kennedys_1980"],
        "influencees": ["fugazi_1990", "black_flag_1981"],
        "context": {
          "description": "Founding straight edge hardcore with lightning-fast songs",
          "critical_reception": "Influential despite brief existence",
          "cultural_impact": "Created straight edge movement and DIY punk ethics"
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
          "description": "Brutal hardcore punk that pushed boundaries of aggression",
          "critical_reception": "Controversial but influential hardcore masterpiece",
          "cultural_impact": "Influenced grunge and alternative rock scenes"
        }
      },
      {
        "id": "sonic_youth_1988",
        "title": "Daydream Nation",
        "artist": "Sonic Youth",
        "release_date": "1988-10-18",
        "genres": ["noise rock", "alternative rock", "post punk"],
        "spotify_url": "https://open.spotify.com/album/sonic_youth_1988",
        "cover_image": "https://via.placeholder.com/300x300/1DB954/000000?text=Sonic+Youth",
        "popularity": 79,
        "influences": ["television_1977", "black_flag_1981"],
        "influencees": ["nirvana_1991", "pavement_1992"],
        "context": {
          "description": "Noise rock epic that bridged punk and alternative rock",
          "critical_reception": "Widely considered a masterpiece of experimental rock",
          "cultural_impact": "Influenced entire generation of alternative bands"
        }
      },
      {
        "id": "fugazi_1990",
        "title": "Repeater",
        "artist": "Fugazi",
        "release_date": "1990-04-19",
        "genres": ["post hardcore", "punk rock"],
        "spotify_url": "https://open.spotify.com/album/fugazi_1990",
        "cover_image": "https://via.placeholder.com/300x300/1DB954/000000?text=Fugazi",
        "popularity": 73,
        "influences": ["minor_threat_1981"],
        "influencees": ["at_the_drive_in_2000"],
        "context": {
          "description": "Post-hardcore innovation with complex rhythms and dual vocals",
          "critical_reception": "Praised for musical complexity and ethical stance",
          "cultural_impact": "Maintained DIY ethics while pushing musical boundaries"
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
        "influences": ["black_flag_1981", "sonic_youth_1988"],
        "influencees": ["green_day_1994", "foo_fighters_1995"],
        "context": {
          "description": "Grunge breakthrough that brought punk to mainstream",
          "critical_reception": "Revolutionary album that defined a generation",
          "cultural_impact": "Killed hair metal and brought alternative rock to forefront"
        }
      },
      {
        "id": "pavement_1992",
        "title": "Slanted and Enchanted",
        "artist": "Pavement",
        "release_date": "1992-04-20",
        "genres": ["indie rock", "lo-fi", "alternative rock"],
        "spotify_url": "https://open.spotify.com/album/pavement_1992",
        "cover_image": "https://via.placeholder.com/300x300/1DB954/000000?text=Pavement",
        "popularity": 68,
        "influences": ["television_1977", "sonic_youth_1988"],
        "influencees": ["strokes_2001", "arcade_fire_2004"],
        "context": {
          "description": "Lo-fi indie rock masterpiece with cryptic lyrics",
          "critical_reception": "Cult classic that influenced indie rock movement",
          "cultural_impact": "Pioneered indie rock aesthetic and DIY recording"
        }
      },
      {
        "id": "green_day_1994",
        "title": "Dookie",
        "artist": "Green Day",
        "release_date": "1994-02-01",
        "genres": ["pop punk", "punk rock"],
        "spotify_url": "https://open.spotify.com/album/green_day_1994",
        "cover_image": "https://via.placeholder.com/300x300/1DB954/000000?text=Green+Day",
        "popularity": 90,
        "influences": ["buzzcocks_1978", "clash_1977", "nirvana_1991"],
        "influencees": ["blink_182_1999", "sum_41_2001"],
        "context": {
          "description": "Pop punk breakthrough that brought punk to MTV generation",
          "critical_reception": "Controversial among punks but widely successful",
          "cultural_impact": "Sparked 90s pop punk revival and mainstream acceptance"
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
        "popularity": 76,
        "influences": ["clash_1977"],
        "influencees": ["dropkick_murphys_1998"],
        "context": {
          "description": "Ska-punk fusion that revived classic punk energy",
          "critical_reception": "Praised for authenticity in commercialized punk era",
          "cultural_impact": "Kept traditional punk alive during pop punk boom"
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
        "influencees": ["sum_41_2001", "good_charlotte_2000"],
        "context": {
          "description": "Juvenile pop punk that dominated late 90s mainstream",
          "critical_reception": "Mixed reviews but massive commercial success",
          "cultural_impact": "Defined pop punk for millennium generation"
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
      { "source": "minor_threat_1981", "target": "fugazi_1990", "type": "influence" },
      { "source": "minor_threat_1981", "target": "black_flag_1981", "type": "influence" },
      { "source": "television_1977", "target": "sonic_youth_1988", "type": "influence" },
      { "source": "television_1977", "target": "pavement_1992", "type": "influence" },
      { "source": "black_flag_1981", "target": "sonic_youth_1988", "type": "influence" },
      { "source": "black_flag_1981", "target": "nirvana_1991", "type": "influence" },
      { "source": "sonic_youth_1988", "target": "nirvana_1991", "type": "influence" },
      { "source": "sonic_youth_1988", "target": "pavement_1992", "type": "influence" },
      { "source": "nirvana_1991", "target": "green_day_1994", "type": "influence" },
      { "source": "clash_1977", "target": "rancid_1995", "type": "influence" },
      { "source": "clash_1977", "target": "green_day_1994", "type": "influence" },
      { "source": "green_day_1994", "target": "blink_182_1999", "type": "influence" }
    ]
  }
};

export const getAlbumsForGenre = async (genre) => {
  try {
    const response = await fetch(`http://localhost:3001/api/albums/genre/${encodeURIComponent(genre)}`);
    
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
    // Fallback to mock data if API is unavailable
    const normalizedGenre = genre.toLowerCase().trim();
    const data = mockAlbumData[normalizedGenre];
    if (!data) {
      return { albums: [], links: [], eras: [] };
    }
    
    return {
      albums: data.albums || [],
      links: data.links || [],
      eras: data.eras || []
    };
  }
};

export const getGenreSuggestions = async () => {
  try {
    const response = await fetch('http://localhost:3001/api/albums/genres/suggestions');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.genres || [];
  } catch (error) {
    console.error('Error fetching genre suggestions from API:', error);
    // Fallback to mock data if API is unavailable
    return Object.keys(mockAlbumData);
  }
};

export const getAvailableGenres = () => {
  // For now, return the available genres from mock data
  // TODO: In the future, this could call /api/albums/genres endpoint
  return Object.keys(mockAlbumData);
};
