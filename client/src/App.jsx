import React from 'react';
import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import SearchBar from './components/SearchBar/SearchBar';
import './App.scss';

/**
 * App Component
 * 
 * This is the main component of our application.
 * It brings together all the pieces (Navbar, Hero, SearchBar) to create the home page.
 * 
 * Think of it like building with LEGO blocks - each component is a block,
 * and we stack them together to build something amazing!
 */
function App() {
  return (
    <div className="app">
      {/* Navigation bar at the top */}
      <Navbar />

      {/* Hero section with background image and main message */}
      <Hero />

      {/* Search bar with filters */}
      <SearchBar />
    </div>
  );
}

export default App;