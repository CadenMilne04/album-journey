import { useState, useEffect } from 'react';
import { getGenreSuggestions } from '../services/albumService';
import './GenreSearch.css';

const GenreSearch = ({ onSearch, isLoading }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [genreCount, setGenreCount] = useState(0);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Fetch genre suggestions from API on component mount
  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const genreSuggestions = await getGenreSuggestions();
        setSuggestions(genreSuggestions);
        setGenreCount(genreSuggestions.length);
      } catch (error) {
        console.error('Failed to fetch genre suggestions:', error);
      }
    };

    fetchSuggestions();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearch(searchTerm.trim());
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion);
    onSearch(suggestion);
    setShowSuggestions(false);
  };

  const filteredSuggestions = suggestions.filter(genre =>
    genre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="genre-search">
      <form onSubmit={handleSubmit} className="search-form">
        <div className="search-input-container">
          <svg 
            className="search-icon" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            type="text"
            placeholder="Search for a music genre..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            className="search-input"
            disabled={isLoading}
          />
          
          {/* Genre Counter Display - inline with search */}
          <div className="stats-badge">
            <svg className="stats-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
            </svg>
            <span className="stats-text">
              <span className="stats-number">{genreCount}</span>
              <span className="stats-label">genres</span>
            </span>
          </div>
          
          {isLoading && (
            <div className="loading-spinner">
              <div className="spinner"></div>
            </div>
          )}
        </div>
        
        {showSuggestions && (
          <div className="suggestions-dropdown">
            {(searchTerm ? filteredSuggestions : suggestions).slice(0, 10).map((suggestion, index) => (
              <div
                key={index}
                className="suggestion-item"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                <svg className="genre-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                </svg>
                {suggestion}
              </div>
            ))}
          </div>
        )}
      </form>
    </div>
  );
};

export default GenreSearch;
