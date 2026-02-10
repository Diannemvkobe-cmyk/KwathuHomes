import React, { useState } from 'react';
import './navbar.scss';

/**
 * Navbar Component
 * 
 * This is the navigation bar at the top of the page.
 * It shows the KwathuHomes logo and menu items.
 * 
 * Think of it like the header of a book - it's always at the top
 * and helps you navigate to different sections.
 */
function Navbar() {
  // This keeps track of whether the mobile menu is open or closed
  // It's like a light switch - either on (true) or off (false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  /**
   * This function toggles the mobile menu
   * Toggle means: if it's open, close it. If it's closed, open it.
   */
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    // The main container for our navigation bar
    <nav className="navbar">
      {/* Container to keep everything centered and organized */}
      <div className="navbar-container">
        
        {/* Logo Section - This is the brand name */}
        <div className="navbar-logo">
          <h1>KwathuHomes</h1>
        </div>

        {/* Navigation Links - These are the menu items */}
        {/* The className changes based on whether mobile menu is open */}
        <ul className={`navbar-menu ${isMobileMenuOpen ? 'active' : ''}`}>
          <li><a href="#home">Home</a></li>
          <li><a href="#properties">Properties</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>

        {/* Mobile Menu Button - Only shows on small screens */}
        {/* When clicked, it opens/closes the mobile menu */}
        <button 
          className="navbar-toggle" 
          onClick={toggleMobileMenu}
          aria-label="Toggle navigation menu"
        >
          {/* These three spans create the hamburger icon (☰) */}
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
