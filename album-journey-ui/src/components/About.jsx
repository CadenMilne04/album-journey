import './About.css';

const About = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="about-overlay" onClick={onClose}>
      <div className="about-modal" onClick={(e) => e.stopPropagation()}>
        <div className="about-header">
          <h2>About AlbumAI</h2>
          <button className="close-button" onClick={onClose}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        
        <div className="about-content">
          <section className="about-section">
            <h3>🎵 What is AlbumAI?</h3>
            <p>
              AlbumAI is an intelligent music discovery platform that helps you explore 
              the connections between influential albums across different genres. Using AI-powered 
              analysis, you can visualize how albums influenced each other and discover 
              the evolution of musical movements.
            </p>
          </section>

          <section className="about-section">
            <h3>🎯 How AlbumAI works</h3>
            <ul>
              <li><strong>Smart connections:</strong> AI analyzes musical relationships and influences between albums</li>
              <li><strong>Visual exploration:</strong> Interactive timeline showing musical evolution and connections</li>
              <li><strong>Rich context:</strong> Detailed information about each album's significance and impact</li>
              <li><strong>Spotify integration:</strong> Album artwork and contextual information</li>
            </ul>
          </section>

          <section className="about-section">
            <h3>👨‍💻 About the creator</h3>
            <p>
              Hi! I'm Caden Milne, a music enthusiast and developer. I used to spend hours asking 
              ChatGPT for album recommendations and manually copying them into my Apple Notes app 
              to keep track of what to listen to next. This process was tedious and didn't give me 
              the visual context I wanted to understand how albums connected to each other.
            </p>
            <p>
              AlbumAI was born from this frustration - it speeds up music discovery by providing 
              instant, intelligent album recommendations with visual context about their 
              historical significance and relationships.
            </p>
          </section>

          <section className="about-section">
            <h3>🚀 Technology</h3>
            <p>
              Built with React, Node.js, and powered by AI models from Groq, with 
              album artwork from Spotify's API. All data is cached locally for fast performance.
            </p>
          </section>          <div className="about-actions">
            <a 
              href="https://cadenmilne.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="website-button"
            >
              🌐 Visit My Website
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
