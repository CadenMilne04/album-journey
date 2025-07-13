import { useMemo, useState } from 'react';
import './AlbumGraph.css';

// Individual album node component (2D)
const AlbumNode = ({ album, position, isSelected, onSelect, onHover }) => {
  const [hovered, setHovered] = useState(false);

  const handleClick = () => {
    onSelect(album);
  };

  const handleMouseEnter = () => {
    setHovered(true);
    onHover(album);
  };

  const handleMouseLeave = () => {
    setHovered(false);
    onHover(null);
  };

  return (
    <div
      className={`album-node ${isSelected ? 'selected' : ''} ${hovered ? 'hovered' : ''}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="album-cover">
        <div className="album-placeholder">{album.artist.slice(0, 2)}</div>
      </div>
      <div className="album-info">
        <div className="album-title">{album.title}</div>
        <div className="album-artist">{album.artist}</div>
        <div className="album-year">{new Date(album.release_date).getFullYear()}</div>
      </div>
    </div>
  );
};

// Connection line component (SVG)
const ConnectionLine = ({ start, end, isHighlighted }) => {
  const midX = (start.x + end.x) / 2;
  const midY = (start.y + end.y) / 2;
  
  // Create a curved path for better visual flow
  const path = `M ${start.x + 60} ${start.y + 30} Q ${midX} ${midY - 20} ${end.x + 60} ${end.y + 30}`;

  return (
    <path
      d={path}
      stroke={isHighlighted ? '#1ed760' : '#1db954'}
      strokeWidth={isHighlighted ? 3 : 1.5}
      fill="none"
      opacity={isHighlighted ? 0.9 : 0.5}
      className="connection-line"
    />
  );
};

// Era header component
const EraHeader = ({ era, position, albumCount }) => {
  const colors = {
    '1970s': '#ff6b6b',
    '1980-84': '#4ecdc4', 
    '1985-89': '#45b7d1',
    '1990-94': '#96ceb4',
    '1995+': '#feca57'
  };

  const labels = {
    '1970s': 'Pioneer Era',
    '1980-84': 'Early Hardcore',
    '1985-89': 'Late 80s Evolution', 
    '1990-94': 'Grunge & Alternative',
    '1995+': 'Pop Punk Era'
  };

  return (
    <div 
      className="era-header"
      style={{
        left: '20px',
        top: `${position.y - 40}px`,
        color: colors[era]
      }}
    >
      <h3>{labels[era]}</h3>
      <span className="era-subtitle">{era} • {albumCount} albums</span>
    </div>
  );
};

// Main 2D Graph component
const Graph2D = ({ albums, links, selectedAlbum, onSelectAlbum, hoveredAlbum, onHoverAlbum }) => {
  console.log('Graph2D received albums:', albums.length);
  
  // Calculate positions for albums in timeline layers
  const { albumPositions, eraPositions, containerDimensions } = useMemo(() => {
    const positions = {};
    const eras = {};
    
    // Group albums by decades/eras
    const albumsByEra = albums.reduce((acc, album) => {
      const year = new Date(album.release_date).getFullYear();
      let era;
      
      if (year < 1980) era = '1970s';
      else if (year < 1985) era = '1980-84';
      else if (year < 1990) era = '1985-89';
      else if (year < 1995) era = '1990-94';
      else era = '1995+';
      
      if (!acc[era]) acc[era] = [];
      acc[era].push(album);
      return acc;
    }, {});
    
    console.log('Albums by era:', albumsByEra);
    
    // Layout configuration
    const eraOrder = ['1970s', '1980-84', '1985-89', '1990-94', '1995+'];
    const layerHeight = 180; // Height per era layer
    const albumWidth = 120; // Width per album
    const albumSpacing = 140; // Spacing between albums
    const leftMargin = 200; // Space for era labels
    
    let currentY = 60; // Start position from top
    let maxWidth = 0;
    
    eraOrder.forEach((era, eraIndex) => {
      const albumsInEra = albumsByEra[era] || [];
      
      if (albumsInEra.length > 0) {
        eras[era] = { y: currentY, count: albumsInEra.length };
        
        albumsInEra.forEach((album, albumIndex) => {
          const x = leftMargin + albumIndex * albumSpacing;
          const y = currentY;
          
          positions[album.id] = { x, y };
          maxWidth = Math.max(maxWidth, x + albumWidth);
        });
        
        currentY += layerHeight;
      }
    });
    
    const containerDims = {
      width: Math.max(1200, maxWidth + 100),
      height: currentY + 100
    };
    
    console.log('Calculated positions:', positions);
    console.log('Container dimensions:', containerDims);
    
    return { albumPositions: positions, eraPositions: eras, containerDimensions: containerDims };
  }, [albums]);

  // Filter links to highlight connections to selected album
  const highlightedLinks = useMemo(() => {
    if (!selectedAlbum) return [];
    return links.filter(link => 
      link.source === selectedAlbum.id || link.target === selectedAlbum.id
    );
  }, [links, selectedAlbum]);

  return (
    <div 
      className="graph-2d-container"
      style={{
        width: `${containerDimensions.width}px`,
        height: `${containerDimensions.height}px`
      }}
    >
      {/* SVG for connection lines */}
      <svg 
        className="connections-svg"
        style={{
          width: `${containerDimensions.width}px`,
          height: `${containerDimensions.height}px`
        }}
      >
        {links.map((link, index) => {
          const startPos = albumPositions[link.source];
          const endPos = albumPositions[link.target];
          if (!startPos || !endPos) return null;
          
          const isHighlighted = highlightedLinks.some(hLink => 
            hLink.source === link.source && hLink.target === link.target
          );
          
          return (
            <ConnectionLine
              key={`${link.source}-${link.target}-${index}`}
              start={startPos}
              end={endPos}
              isHighlighted={isHighlighted}
            />
          );
        })}
      </svg>
      
      {/* Era headers */}
      {Object.entries(eraPositions).map(([era, pos]) => (
        <EraHeader
          key={era}
          era={era}
          position={pos}
          albumCount={pos.count}
        />
      ))}
      
      {/* Album nodes */}
      {albums.map((album) => {
        const position = albumPositions[album.id];
        if (!position) return null;
        
        return (
          <AlbumNode
            key={album.id}
            album={album}
            position={position}
            isSelected={selectedAlbum?.id === album.id}
            onSelect={onSelectAlbum}
            onHover={onHoverAlbum}
          />
        );
      })}
    </div>
  );
};

// Timeline navigation component
const TimelineNav = ({ albums }) => {
  const eraStats = useMemo(() => {
    const stats = albums.reduce((acc, album) => {
      const year = new Date(album.release_date).getFullYear();
      let era;
      
      if (year < 1980) era = 'Pioneer Era (1970s)';
      else if (year < 1985) era = 'Early Hardcore (1980-84)';
      else if (year < 1990) era = 'Late 80s Evolution (1985-89)';
      else if (year < 1995) era = 'Grunge & Alternative (1990-94)';
      else era = 'Pop Punk Era (1995+)';
      
      if (!acc[era]) acc[era] = { count: 0, color: '' };
      acc[era].count++;
      
      return acc;
    }, {});
    
    // Add colors
    stats['Pioneer Era (1970s)'] = { ...stats['Pioneer Era (1970s)'], color: '#ff6b6b' };
    stats['Early Hardcore (1980-84)'] = { ...stats['Early Hardcore (1980-84)'], color: '#4ecdc4' };
    stats['Late 80s Evolution (1985-89)'] = { ...stats['Late 80s Evolution (1985-89)'], color: '#45b7d1' };
    stats['Grunge & Alternative (1990-94)'] = { ...stats['Grunge & Alternative (1990-94)'], color: '#96ceb4' };
    stats['Pop Punk Era (1995+)'] = { ...stats['Pop Punk Era (1995+)'], color: '#feca57' };
    
    return stats;
  }, [albums]);

  return (
      <></>
  );
};

// Album info panel
const AlbumInfoPanel = ({ album, onClose }) => {
  if (!album) return null;

  return (
    <div className="album-info-panel">
      <div className="album-info-header">
        <h3>{album.title}</h3>
        <button className="close-button" onClick={onClose}>×</button>
      </div>
      <div className="album-info-content">
        <div className="album-basic-info">
          <p><strong>Artist:</strong> {album.artist}</p>
          <p><strong>Released:</strong> {new Date(album.release_date).toLocaleDateString()}</p>
          <p><strong>Genres:</strong> {album.genres.join(', ')}</p>
          <p><strong>Popularity:</strong> {album.popularity}/100</p>
        </div>
        
        {album.context && (
          <div className="album-context">
            <h4>About This Album</h4>
            <p>{album.context.description}</p>
            
            {album.context.critical_reception && (
              <div>
                <h5>Critical Reception</h5>
                <p>{album.context.critical_reception}</p>
              </div>
            )}
            
            {album.context.cultural_impact && (
              <div>
                <h5>Cultural Impact</h5>
                <p>{album.context.cultural_impact}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Main component
const AlbumGraph = ({ albums, links }) => {
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [hoveredAlbum, setHoveredAlbum] = useState(null);

  if (!albums || albums.length === 0) {
    return (
      <div className="album-graph-empty">
        <p>Search for a music genre to explore its influential albums</p>
      </div>
    );
  }

  return (
    <div className="album-graph-container">
      <div className="graph-wrapper">
        <Graph2D 
          albums={albums}
          links={links}
          selectedAlbum={selectedAlbum}
          onSelectAlbum={setSelectedAlbum}
          hoveredAlbum={hoveredAlbum}
          onHoverAlbum={setHoveredAlbum}
        />
      </div>
      
      {/* Hover tooltip */}
      {hoveredAlbum && !selectedAlbum && (
        <div className="hover-tooltip">
          <strong>{hoveredAlbum.title}</strong>
          <br />
          {hoveredAlbum.artist} ({new Date(hoveredAlbum.release_date).getFullYear()})
        </div>
      )}
      
      {/* Timeline navigation */}
      {albums.length > 0 && (
        <TimelineNav albums={albums} />
      )}
      
      {/* Album info panel */}
      <AlbumInfoPanel 
        album={selectedAlbum} 
        onClose={() => setSelectedAlbum(null)} 
      />
      
      {/* Instructions */}
      <div className="graph-instructions">
        <p> Click albums for details • � Lines show musical influences • 📚 Organized by musical eras</p>
      </div>
    </div>
  );
};

export default AlbumGraph;
