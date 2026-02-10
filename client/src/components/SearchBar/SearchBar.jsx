import React, { useState } from 'react';
import './searchBar.scss';

/**
 * SearchBar Component
 * 
 * This component lets users search for properties.
 * It has filters for location, property type, price range, and bedrooms.
 * 
 * Think of it like a treasure map - you tell it what you're looking for,
 * and it helps you find it!
 */
function SearchBar() {
  /**
   * State Management
   * 
   * These variables remember what the user has selected.
   * When they change, React automatically updates the display.
   */
  const [searchData, setSearchData] = useState({
    location: '',
    propertyType: '',
    priceRange: '',
    bedrooms: ''
  });

  /**
   * Handle Input Changes
   * 
   * This function runs whenever the user types or selects something.
   * It updates our searchData with the new value.
   * 
   * @param {Event} e - The event that triggered this (like typing or selecting)
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Update only the field that changed, keep others the same
    setSearchData({
      ...searchData,  // Keep all existing values
      [name]: value   // Update only this field
    });
  };

  /**
   * Handle Search Submit
   * 
   * This function runs when the user clicks the "Search" button.
   * For now, it just shows what they searched for.
   * Later, you can connect it to a real search function!
   * 
   * @param {Event} e - The form submit event
   */
  const handleSearch = (e) => {
    e.preventDefault(); // Prevent page reload

    console.log('Searching for:', searchData);
    // TODO: Add actual search functionality here
    alert(`Searching for properties in ${searchData.location || 'all locations'}!`);
  };

  return (
    // Main search bar container
    <section className="search-bar" id="search">
      <div className="search-container">

        {/* Section Title */}
        <h2 className="search-title">Find Your Perfect Property</h2>

        {/* Search Form */}
        <form className="search-form" onSubmit={handleSearch}>

          {/* Location Filter */}
          <div className="search-field">
            <label htmlFor="location">
              <span className="icon">📍</span>
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              placeholder="Enter city or area"
              value={searchData.location}
              onChange={handleInputChange}
            />
          </div>

          {/* Property Type Filter */}
          <div className="search-field">
            <label htmlFor="propertyType">
              <span className="icon">🏠</span>
              Property Type
            </label>
            <select
              id="propertyType"
              name="propertyType"
              value={searchData.propertyType}
              onChange={handleInputChange}
            >
              <option value="">All Types</option>
              <option value="house">House</option>
              <option value="apartment">Apartment</option>
              <option value="condo">Condo</option>
              <option value="townhouse">Townhouse</option>
              <option value="land">Land</option>
            </select>
          </div>

          {/* Price Range Filter */}
          <div className="search-field">
            <label htmlFor="priceRange">
              <span className="icon">💰</span>
              Price Range
            </label>
            <select
              id="priceRange"
              name="priceRange"
              value={searchData.priceRange}
              onChange={handleInputChange}
            >
              <option value="">Any Price</option>
              <option value="0-50000">Under K50,000</option>
              <option value="50000-100000">K50,000 - K100,000</option>
              <option value="100000-200000">K100,000 - K200,000</option>
              <option value="200000-500000">K200,000 - K500,000</option>
              <option value="500000+">K500,000+</option>
            </select>
          </div>

          {/* Bedrooms Filter */}
          <div className="search-field">
            <label htmlFor="bedrooms">
              <span className="icon">🛏️</span>
              Bedrooms
            </label>
            <select
              id="bedrooms"
              name="bedrooms"
              value={searchData.bedrooms}
              onChange={handleInputChange}
            >
              <option value="">Any</option>
              <option value="1">1 Bedroom</option>
              <option value="2">2 Bedrooms</option>
              <option value="3">3 Bedrooms</option>
              <option value="4">4 Bedrooms</option>
              <option value="5+">5+ Bedrooms</option>
            </select>
          </div>

          {/* Search Button */}
          <button type="submit" className="search-button">
            <span className="icon">🔍</span>
            Search Properties
          </button>
        </form>
      </div>
    </section>
  );
}

export default SearchBar;
