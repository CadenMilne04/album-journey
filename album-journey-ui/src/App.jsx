import { useState } from 'react'
import './App.css'
import GenreSearch from './components/GenreSearch'
import AlbumGraph from './components/AlbumGraph'
import { getAlbumsForGenre } from './services/albumService'

function App() {
  const [albumData, setAlbumData] = useState({ albums: [], links: [] })
  const [isLoading, setIsLoading] = useState(false)
  const [currentGenre, setCurrentGenre] = useState('')
  const [error, setError] = useState('')

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
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">
            <span className="title-icon">🎵</span>
            Album Journey
            <span className="title-subtitle">Explore Musical Evolution</span>
          </h1>
          <p className="app-description">
            Discover the influential albums that shaped music genres through an interactive 3D timeline
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
          <AlbumGraph albums={albumData.albums} links={albumData.links} />
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
        <p>Built with React • Three.js • Inspired by Spotify's design language</p>
      </footer>
    </div>
  )
}

export default App
