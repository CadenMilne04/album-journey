const Groq = require('groq-sdk');

class GroqService {
  constructor() {
    if (!process.env.GROQ_API_KEY) {
      console.warn('Groq API key not found. Groq service will be disabled.');
      this.groq = null;
      return;
    }
    
    this.groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });
  }

  async generateAlbumData(genre) {
    if (!this.groq) {
      throw new Error('Groq API key not configured');
    }

    const prompt = `Generate album data for the music genre "${genre}". You must return EXACTLY the following JSON structure with no additional text, no explanation, and NO MARKDOWN FORMATTING. Include EXACTLY 15 influential albums from this genre with realistic data. Return raw JSON only:

{
  "eras": [
    {
      "id": "era_id",
      "name": "Era Name",
      "period": "Time Period",
      "color": "#hexcolor",
      "description": "Era description",
      "yearRange": [startYear, endYear]
    }
  ],
  "albums": [
    {
      "id": "unique_album_id",
      "title": "Album Title",
      "artist": "Artist Name",
      "release_date": "YYYY-MM-DD",
      "genres": ["genre1", "genre2"],
      "popularity": 85,
      "influences": ["album_id1", "album_id2"],
      "influencees": ["album_id3", "album_id4"],
      "context": {
        "description": "Album description",
        "critical_reception": "Critical reception",
        "cultural_impact": "Cultural impact"
      }
    }
  ],
  "links": [
    { "source": "album_id1", "target": "album_id2", "type": "influence" }
  ]
}

Rules:
- MUST include EXACTLY 15 albums - this is critical for proper visualization
- Use real albums and artists from the ${genre} genre
- Make album IDs in format: "artist_year" (lowercase, underscores) - MUST be unique
- Include 3-5 eras that make sense for the genre's history
- Create realistic influence relationships between albums
- Use hex colors for eras that visually distinguish them
- Popularity should be 60-95
- Include pioneering albums, classic albums, and modern influential releases
- Ensure influences/influencees reference actual album IDs in your response
- Links should connect albums that actually influenced each other historically
- Cover different decades and subgenres within the main genre
- Each album MUST have a unique ID
- All album references in influences/influencees/links MUST match actual album IDs

IMPORTANT: Return ONLY the JSON object. No markdown, no code blocks, no explanations. Start with { and end with }. MUST HAVE EXACTLY 15 ALBUMS.`;

    try {
      const completion = await this.groq.chat.completions.create({
        model: "llama-3.1-8b-instant", // Try a different model that might be better at JSON
        messages: [
          {
            role: "system",
            content: "You are a music historian that generates precise JSON data about music genres and their influential albums. You must return ONLY valid JSON with no markdown formatting, no code blocks, no explanations, and no additional text. Start your response with { and end with }. CRITICAL: Ensure all JSON is properly formatted - use double quotes for strings, proper array syntax [1900, 1940] not \"[1900\", 1940], and correct comma placement."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.3, // Lower temperature for more consistent JSON structure
        max_tokens: 5000  // Increased for 10 albums
      });

      const jsonResponse = completion.choices[0].message.content.trim();
      console.log('=== RAW GROQ RESPONSE ===');
      console.log(jsonResponse);
      console.log('=== END RAW RESPONSE ===');
      
      // NO CLEANUP - parse directly
      let parsedData;
      try {
        parsedData = JSON.parse(jsonResponse);
        console.log('✅ JSON parsed successfully!');
      } catch (parseError) {
        console.error('❌ JSON Parse Error:', parseError.message);
        console.error('Error at position:', parseError.message.match(/position (\d+)/)?.[1]);
        
        // Show the exact problem area
        const positionMatch = parseError.message.match(/position (\d+)/);
        if (positionMatch) {
          const errorPos = parseInt(positionMatch[1]);
          const contextStart = Math.max(0, errorPos - 100);
          const contextEnd = Math.min(jsonResponse.length, errorPos + 100);
          const context = jsonResponse.substring(contextStart, contextEnd);
          console.error('=== ERROR CONTEXT (±100 chars) ===');
          console.error(context);
          console.error('=== END ERROR CONTEXT ===');
        }
        
        throw new Error(`JSON Parse Failed: ${parseError.message}`);
      }
      
      // Validate required structure
      if (!parsedData.eras || !parsedData.albums || !parsedData.links) {
        throw new Error('Invalid JSON structure returned from Groq - missing required fields');
      }

      // Validate minimum album count
      if (!Array.isArray(parsedData.albums) || parsedData.albums.length < 10) {
        console.warn(`Only received ${parsedData.albums?.length || 0} albums, expected 10`);
        // Still return the data if we have at least 7 albums
        if (parsedData.albums?.length < 7) {
          throw new Error(`Insufficient albums returned: ${parsedData.albums?.length || 0}`);
        }
      }

      console.log(`Successfully generated ${parsedData.albums.length} albums for genre: ${genre}`);
      return parsedData;
    } catch (error) {
      console.error('Error generating album data with Groq:', error);
      throw new Error('Failed to generate album data');
    }
  }

  isAvailable() {
    return this.groq !== null;
  }
}

module.exports = new GroqService();
