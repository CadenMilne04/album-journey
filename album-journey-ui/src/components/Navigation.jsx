import { useState } from 'react';
import './Navigation.css';

const Navigation = ({ onAboutClick }) => {
  return (
    <nav className="navigation">
      <div className="nav-left">
        <a 
          href="https://cadenmilne.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="creator-link"
        >
          <svg className="creator-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM7.5 12c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5zm9 0c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5z"/>
          </svg>
          Made by Caden Milne
        </a>
      </div>
      
      <div className="nav-center">
        <button 
          onClick={onAboutClick}
          className="nav-button"
        >
          About
        </button>
      </div>
      
      <div className="nav-right">
        <a 
          href="https://coff.ee/cadenmilnes" 
          target="_blank" 
          rel="noopener noreferrer"
          className="coffee-link"
        >
          <img 
            src="https://miro.medium.com/v2/resize:fit:1200/1*HdRAxEVwO_27UL1e6QhUeA.png" 
            alt="Buy Me A Coffee"
            className="coffee-icon"
          />
          Buy me a coffee
        </a>
      </div>
    </nav>
  );
};

export default Navigation;
