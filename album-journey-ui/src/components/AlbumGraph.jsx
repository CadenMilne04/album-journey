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
        {album.albumArt ? (
          <img 
            src={album.albumArt} 
            alt={`${album.title} by ${album.artist}`}
            className="album-art"
            onError={(e) => {
              // Fallback if image fails to load
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        <div className="album-placeholder" style={{ display: album.albumArt ? 'none' : 'flex' }}>
          {album.artist.slice(0, 2)}
        </div>
      </div>
      <div className="album-info">
        <div className="album-title">{album.title}</div>
        <div className="album-artist">{album.artist}</div>
        <div className="album-year">{new Date(album.release_date).getFullYear()}</div>
      </div>
    </div>
  );
};

// Connection line component (SVG) - cleaner curved paths
const ConnectionLine = ({ start, end, isHighlighted }) => {
  const midX = (start.x + end.x) / 2;
  const midY = (start.y + end.y) / 2;
  
  // Create a smoother curved path
  const controlPoint1X = start.x + 60 + (end.x - start.x) * 0.3;
  const controlPoint1Y = start.y + 30;
  const controlPoint2X = end.x + 60 - (end.x - start.x) * 0.3;
  const controlPoint2Y = end.y + 30;
  
  const path = `M ${start.x + 60} ${start.y + 30} C ${controlPoint1X} ${controlPoint1Y}, ${controlPoint2X} ${controlPoint2Y}, ${end.x + 60} ${end.y + 30}`;

  return (
    <path
      d={path}
      stroke={isHighlighted ? '#1ed760' : '#1db954'}
      strokeWidth={isHighlighted ? 2.5 : 1.5}
      fill="none"
      opacity={isHighlighted ? 0.8 : 0.4}
      className="connection-line"
    />
  );
};

// Era header component
const EraHeader = ({ era, position, albumCount }) => {
  return (
    <div 
      className="era-header"
      style={{
        left: '20px',
        top: `${position.y - 40}px`,
        color: era.color
      }}
    >
      <h3>{era.name}</h3>
      <span className="era-subtitle">{era.period} • {albumCount} albums</span>
    </div>
  );
};

// Main 2D Graph component
const Graph2D = ({ albums, links, eras, selectedAlbum, onSelectAlbum, hoveredAlbum, onHoverAlbum }) => {
  console.log('Graph2D received albums:', albums.length);
  console.log('Graph2D received eras:', eras);
  
  // Calculate positions for albums in timeline layers
  const { albumPositions, eraPositions, containerDimensions } = useMemo(() => {
    const positions = {};
    const eraPositionData = {};
    
    // Create era lookup for easy access
    const eraLookup = {};
    eras.forEach(era => {
      eraLookup[era.id] = era;
    });
    
    // Group albums by eras
    const albumsByEra = albums.reduce((acc, album) => {
      const year = new Date(album.release_date).getFullYear();
      
      // Find which era this album belongs to
      const era = eras.find(e => year >= e.yearRange[0] && year <= e.yearRange[1]);
      const eraId = era ? era.id : 'unknown';
      
      if (!acc[eraId]) acc[eraId] = [];
      acc[eraId].push(album);
      return acc;
    }, {});
    
    console.log('Albums by era:', albumsByEra);
    
    // Layout configuration
    const layerHeight = 180; // Height per era layer
    const albumWidth = 120; // Width per album
    const albumSpacing = 140; // Spacing between albums
    const leftMargin = 200; // Space for era labels
    
    let currentY = 60; // Start position from top
    let maxWidth = 0;
    
    // Process eras in order
    eras.forEach((era, eraIndex) => {
      const albumsInEra = albumsByEra[era.id] || [];
      
      if (albumsInEra.length > 0) {
        eraPositionData[era.id] = { 
          y: currentY, 
          count: albumsInEra.length,
          era: era 
        };
        
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
    
    return { albumPositions: positions, eraPositions: eraPositionData, containerDimensions: containerDims };
  }, [albums, eras]);

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
      {Object.entries(eraPositions).map(([eraId, pos]) => (
        <EraHeader
          key={eraId}
          era={pos.era}
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

// Timeline navigation component (removed as requested)
const TimelineNav = ({ albums }) => {
  return null; // No longer needed
};

// Main component
const AlbumGraph = ({ albums, links, eras = [] }) => {
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [hoveredAlbum, setHoveredAlbum] = useState(null);

  // Update hover info in sidebar
  const updateHoverInfo = (album) => {
    const hoverSection = document.getElementById('album-hover-info');
    if (hoverSection) {
      if (album) {
        hoverSection.innerHTML = `
          <h3>Album Info</h3>
          <div style="color: #1ed760; font-weight: bold; margin-bottom: 0.5rem;">${album.title}</div>
          <div style="color: #ffffff; margin-bottom: 0.25rem;">${album.artist}</div>
          <div style="color: #b3b3b3; margin-bottom: 0.5rem;">${new Date(album.release_date).getFullYear()}</div>
          <div style="color: #b3b3b3; font-size: 0.9rem;">Popularity: ${album.popularity}/100</div>
        `;
      } else {
        hoverSection.innerHTML = `
          <h3>Hover an Album</h3>
          <p>Move your mouse over any album to see quick details here.</p>
        `;
      }
    }
  };

  // Update detailed info in sidebar
  const updateDetailedInfo = (album) => {
    const detailsSection = document.getElementById('album-details');
    if (detailsSection) {
      if (album) {
        let contextHtml = '';
        if (album.context) {
          contextHtml = `
            <div style="margin-top: 1rem;">
              <h4 style="color: #1ed760; margin: 0 0 0.5rem 0; font-size: 1rem;">About This Album</h4>
              <p style="margin: 0 0 0.75rem 0; color: #ffffff; line-height: 1.4;">${album.context.description}</p>
              
              ${album.context.critical_reception ? `
                <h5 style="color: #1ed760; margin: 0 0 0.25rem 0; font-size: 0.9rem;">Critical Reception</h5>
                <p style="margin: 0 0 0.75rem 0; color: #b3b3b3; line-height: 1.4; font-size: 0.9rem;">${album.context.critical_reception}</p>
              ` : ''}
              
              ${album.context.cultural_impact ? `
                <h5 style="color: #1ed760; margin: 0 0 0.25rem 0; font-size: 0.9rem;">Cultural Impact</h5>
                <p style="margin: 0; color: #b3b3b3; line-height: 1.4; font-size: 0.9rem;">${album.context.cultural_impact}</p>
              ` : ''}
            </div>
          `;
        }
        
        detailsSection.innerHTML = `
          <h3>Album Details</h3>
          <div style="color: #1ed760; font-weight: bold; font-size: 1.2rem; margin-bottom: 0.5rem;">${album.title}</div>
          <div style="color: #ffffff; margin-bottom: 0.25rem;"><strong>Artist:</strong> ${album.artist}</div>
          <div style="color: #b3b3b3; margin-bottom: 0.25rem;"><strong>Released:</strong> ${new Date(album.release_date).toLocaleDateString()}</div>
          <div style="color: #b3b3b3; margin-bottom: 0.25rem;"><strong>Genres:</strong> ${album.genres.join(', ')}</div>
          <div style="color: #b3b3b3; margin-bottom: 0.5rem;"><strong>Popularity:</strong> ${album.popularity}/100</div>
          ${contextHtml}
        `;
      } else {
        detailsSection.innerHTML = `
          <h3>Album Details</h3>
          <p>Click on any album to see detailed information here.</p>
        `;
      }
    }
  };

  // Handle album selection
  const handleSelectAlbum = (album) => {
    setSelectedAlbum(album);
    updateDetailedInfo(album);
  };

  // Handle album hover
  const handleHoverAlbum = (album) => {
    setHoveredAlbum(album);
    updateHoverInfo(album);
  };

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
          eras={eras}
          selectedAlbum={selectedAlbum}
          onSelectAlbum={handleSelectAlbum}
          hoveredAlbum={hoveredAlbum}
          onHoverAlbum={handleHoverAlbum}
        />
      </div>
    </div>
  );
};

export default AlbumGraph;
