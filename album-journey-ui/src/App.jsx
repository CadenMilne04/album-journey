import { useState } from 'react'
import './App.css'
import About from './components/About'
import GenreSearch from './components/GenreSearch'
import AlbumGraph from './components/AlbumGraph'
import ChatFeedback from './components/ChatFeedback'
import { getAlbumsForGenre } from './services/albumService'

function App() {
  const [albumData, setAlbumData] = useState({ albums: [], links: [], eras: [] })
  const [isLoading, setIsLoading] = useState(false)
  const [currentGenre, setCurrentGenre] = useState('')
  const [error, setError] = useState('')
  const [showAbout, setShowAbout] = useState(false)

  const handleSearch = async (genre) => {
    setIsLoading(true)
    setError('')
    setCurrentGenre(genre)
    
    try {
      const data = await getAlbumsForGenre(genre)
      if (data.albums.length === 0) {
        setError(`No data available for "${genre}". Try "punk rock" for a demo!`)
      } else {
        setAlbumData(data)
      }
    } catch (err) {
      setError('Failed to fetch album data. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="app">
      {/* Corner buttons */}
      <div className="corner-buttons">
        <button className="corner-btn left" onClick={() => window.open('https://cadenmilne.com', '_blank')}>
          Created by Caden Milne <span className="external-arrow">↗</span>
        </button>
        <div className="corner-btn-group">
          <button className="corner-btn" onClick={() => setShowAbout(true)}>
            About
          </button>
          <button className="corner-btn coffee-btn" onClick={() => window.open('https://buymeacoffee.com/cadenmilne', '_blank')}>
            <img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" />
          </button>
        </div>
      </div>
      
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">
            <span className="title-icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" fill="currentColor"/>
              </svg>
            </span>
            AlbumAI
            <span className="title-subtitle">Intelligent Music Discovery</span>
          </h1>
          <p className="app-description">
            Discover musical connections and explore album influences with AI-powered insights
          </p>
        </div>
      </header>

      <main className="app-main">
        <div className="search-section">
          <GenreSearch onSearch={handleSearch} isLoading={isLoading} />
          
          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}
          
          {currentGenre && !error && (
            <div className="current-genre">
              <span>Exploring: </span>
              <strong>{currentGenre}</strong>
              {albumData.albums.length > 0 && (
                <span className="album-count">
                  ({albumData.albums.length} albums)
                </span>
              )}
            </div>
          )}
        </div>

        <div className="graph-section">
          <div className="graph-layout">
            <div className="graph-canvas">
              <AlbumGraph albums={albumData.albums} links={albumData.links} eras={albumData.eras} />
            </div>
            <div className="graph-sidebar">
              <div id="album-hover-info" className="album-hover-section">
                <h3>Hover an Album</h3>
                <p>Move your mouse over any album to see quick details here.</p>
              </div>
              <div id="album-details" className="album-details-section">
                <h3>Album Details</h3>
                <p>Click on any album to see detailed information here.</p>
              </div>
            </div>
          </div>
        </div>
        
        {albumData.albums.length > 0 && (
          <div className="legend">
            <div className="legend-item">
              <div className="legend-color spotify-green"></div>
              <span>Influence connections</span>
            </div>
            <div className="legend-item">
              <div className="legend-color selected-album"></div>
              <span>Selected album</span>
            </div>
            <div className="legend-item">
              <div className="legend-color default-album"></div>
              <span>Albums</span>
            </div>
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>Caden Milne © 2025</p>
      </footer>
      
      <About isOpen={showAbout} onClose={() => setShowAbout(false)} />
      <ChatFeedback />
    </div>
  )
}

export default App
