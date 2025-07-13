import { useRef, useEffect, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';
import './AlbumGraph.css';

// Individual album node component
const AlbumNode = ({ album, position, isSelected, onSelect, onHover }) => {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      // Gentle floating animation
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.1;
      
      // Subtle rotation
      meshRef.current.rotation.y += 0.005;
      
      // Scale animation on hover or selection
      const targetScale = hovered || isSelected ? 1.2 : 1;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }
  });

  const handleClick = () => {
    onSelect(album);
  };

  const handlePointerOver = () => {
    setHovered(true);
    onHover(album);
  };

  const handlePointerOut = () => {
    setHovered(false);
    onHover(null);
  };

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <boxGeometry args={[1.2, 1.2, 0.2]} />
        <meshStandardMaterial 
          color={isSelected ? '#1ed760' : hovered ? '#1db954' : '#404040'}
          emissive={isSelected ? '#0a5d2b' : hovered ? '#0a4d24' : '#000000'}
        />
      </mesh>
      
      {/* Album title */}
      <Text
        position={[0, -1, 0]}
        fontSize={0.2}
        color={isSelected ? '#1ed760' : '#ffffff'}
        anchorX="center"
        anchorY="middle"
        maxWidth={3}
        textAlign="center"
      >
        {album.title}
      </Text>
      
      {/* Artist name */}
      <Text
        position={[0, -1.3, 0]}
        fontSize={0.15}
        color="#b3b3b3"
        anchorX="center"
        anchorY="middle"
        maxWidth={3}
        textAlign="center"
      >
        {album.artist}
      </Text>
      
      {/* Release year */}
      <Text
        position={[0, -1.6, 0]}
        fontSize={0.12}
        color="#888888"
        anchorX="center"
        anchorY="middle"
      >
        {new Date(album.release_date).getFullYear()}
      </Text>
    </group>
  );
};

// Connection line component
const ConnectionLine = ({ start, end, isHighlighted }) => {
  const lineRef = useRef();
  
  useFrame(() => {
    if (lineRef.current) {
      // Animated glow effect
      const material = lineRef.current.material;
      material.opacity = isHighlighted ? 0.8 : 0.4;
    }
  });

  const points = useMemo(() => [
    new THREE.Vector3(...start),
    new THREE.Vector3(...end)
  ], [start, end]);

  const lineGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    return geometry;
  }, [points]);

  return (
    <line ref={lineRef} geometry={lineGeometry}>
      <lineBasicMaterial 
        color={isHighlighted ? '#1ed760' : '#1db954'} 
        transparent 
        opacity={isHighlighted ? 0.8 : 0.4}
        linewidth={isHighlighted ? 3 : 1}
      />
    </line>
  );
};

// Main 3D scene component
const Graph3D = ({ albums, links, selectedAlbum, onSelectAlbum, hoveredAlbum, onHoverAlbum }) => {
  // Calculate positions for albums in 3D space
  const albumPositions = useMemo(() => {
    const positions = {};
    const centerRadius = 8;
    const layers = 3;
    
    albums.forEach((album, index) => {
      const layer = Math.floor(index / 5);
      const angleStep = (Math.PI * 2) / Math.min(5, albums.length - layer * 5);
      const angle = (index % 5) * angleStep;
      const radius = centerRadius + layer * 3;
      
      positions[album.id] = [
        Math.cos(angle) * radius,
        (layer - 1) * 2,
        Math.sin(angle) * radius
      ];
    });
    
    return positions;
  }, [albums]);

  // Filter links to highlight connections to selected album
  const highlightedLinks = useMemo(() => {
    if (!selectedAlbum) return [];
    return links.filter(link => 
      link.source === selectedAlbum.id || link.target === selectedAlbum.id
    );
  }, [links, selectedAlbum]);

  return (
    <>
      {/* Ambient lighting */}
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={0.8} />
      <pointLight position={[-10, -10, -10]} intensity={0.4} color="#1db954" />
      
      {/* Album nodes */}
      {albums.map((album) => (
        <AlbumNode
          key={album.id}
          album={album}
          position={albumPositions[album.id]}
          isSelected={selectedAlbum?.id === album.id}
          onSelect={onSelectAlbum}
          onHover={onHoverAlbum}
        />
      ))}
      
      {/* Connection lines */}
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
      
      {/* Camera controls */}
      <OrbitControls 
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={5}
        maxDistance={25}
      />
    </>
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
      <div className="graph-canvas">
        <Canvas camera={{ position: [0, 5, 15], fov: 60 }}>
          <Graph3D 
            albums={albums}
            links={links}
            selectedAlbum={selectedAlbum}
            onSelectAlbum={setSelectedAlbum}
            hoveredAlbum={hoveredAlbum}
            onHoverAlbum={setHoveredAlbum}
          />
        </Canvas>
      </div>
      
      {/* Hover tooltip */}
      {hoveredAlbum && !selectedAlbum && (
        <div className="hover-tooltip">
          <strong>{hoveredAlbum.title}</strong>
          <br />
          {hoveredAlbum.artist} ({new Date(hoveredAlbum.release_date).getFullYear()})
        </div>
      )}
      
      {/* Album info panel */}
      <AlbumInfoPanel 
        album={selectedAlbum} 
        onClose={() => setSelectedAlbum(null)} 
      />
      
      {/* Instructions */}
      <div className="graph-instructions">
        <p>🖱️ Click and drag to rotate • 🔍 Scroll to zoom • 📀 Click albums for details</p>
      </div>
    </div>
  );
};

export default AlbumGraph;
