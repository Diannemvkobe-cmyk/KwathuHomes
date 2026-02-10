import React from 'react';
import './hero.scss';

/**
 * Hero Component
 * 
 * This is the big, eye-catching section at the top of the page.
 * It has a beautiful background image and a catchy message.
 * 
 * "Kwathu" means "our" or "ours" in Zambian languages,
 * so this is about finding YOUR home!
 */
function Hero() {
  return (
    // Main hero container with background image
    <section className="hero" id="home">

      {/* Overlay - a semi-transparent layer to make text easier to read */}
      <div className="hero-overlay"></div>

      {/* Content container - holds all the text and elements */}
      <div className="hero-content">

        {/* Main heading - the big, bold message */}
        <h1 className="hero-title">
          Find Your Dream Home
          <span className="hero-subtitle">Where Your Story Begins</span>
        </h1>

        {/* Description text - explains what we do */}
        <p className="hero-description">
          Discover the perfect place to call yours. From cozy apartments to
          spacious family homes, KwathuHomes brings you closer to your dream property.
        </p>

        {/* Call-to-action button - encourages users to take action */}
        <div className="hero-cta">
          <a href="#search" className="cta-button primary">
            Start Your Search
          </a>
          <a href="#properties" className="cta-button secondary">
            Browse Properties
          </a>
        </div>
      </div>

      {/* Scroll indicator - shows users there's more content below */}
      <div className="scroll-indicator">
        <span>Scroll Down</span>
        <div className="scroll-arrow">↓</div>
      </div>
    </section>
  );
}

export default Hero;
