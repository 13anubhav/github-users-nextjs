import React, { useState, useEffect } from 'react';
import Head from 'next/head';

const UserSearch = () => {
  const [searchText, setSearchText] = useState('');
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 8; // Adjust the number of users per page for responsiveness
  const [isLoading, setIsLoading] = useState(false);
  const [backgroundGradient, setBackgroundGradient] = useState('linear-gradient(#f06, #09f)');
  const [isDarkMode, setIsDarkMode] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);

    try {
      if (searchText.trim() !== '') {
        // Replace with LinkedIn API endpoint for user search
        const response = await fetch(`https://api.linkedin.com/v2/people?q=${searchText}`);
        const data = await response.json();

        // Adjust how you map and set users based on LinkedIn API response
        const formattedUsers = data.results.map((user) => ({
          id: user.id,
          name: user.firstName + ' ' + user.lastName,
          profileUrl: user.profileUrl,
          // Add more fields as needed
        }));

        setUsers(formattedUsers);
        setCurrentPage(1); // Reset to the first page when new data is fetched
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error('Error fetching LinkedIn users:', error);
      setUsers([]);
    }

    setIsLoading(false);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchData();
  };

  const handleBackgroundChange = (color1, color2) => {
    setBackgroundGradient(`linear-gradient(${color1}, ${color2})`);
  };

  const handleDarkModeToggle = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Calculate the index range for the current page
  const startIndex = (currentPage - 1) * usersPerPage;
  const endIndex = startIndex + usersPerPage;

  // Create an array of users for the current page
  const usersOnCurrentPage = users.slice(startIndex, endIndex);

  // Handle pagination button clicks
  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    setCurrentPage(currentPage - 1);
  };

  return (
    <div className={`container ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
      <Head>
        <title>LinkedIn User Search</title>
        {/* Add LinkedIn specific meta tags */}
        <meta name="description" content="LinkedIn User Search helps you find LinkedIn users and view their profiles." />
        <meta name="keywords" content="LinkedIn, LinkedIn user search, LinkedIn API, professional network" />
        <meta name="author" content="Your Name" />
        {/* Add LinkedIn specific meta tags */}
      </Head>
      <div className="content-wrapper">
        <h1 className="heading">LinkedIn User Explorer</h1>
        <form onSubmit={handleSearchSubmit} className="search-form">
          <input
            type="text"
            placeholder="Enter LinkedIn username..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-button">
            Search
          </button>
        </form>
        <div className="table-container">
          {isLoading ? (
            <div className="loader-container">
              <div className="loader"></div>
              <p>Searching for users...</p>
            </div>
          ) : Array.isArray(usersOnCurrentPage) && usersOnCurrentPage.length > 0 ? (
            <div className="user-grid">
              {usersOnCurrentPage.map((user, index) => (
                <div key={user.id} className="user-card">
                  <div className="card-header" style={{ backgroundColor: `hsl(${index * 60}, 70%, 60%)` }}></div>
                  {/* Adjust the structure based on LinkedIn API response */}
                  <h3 className="user-name">{user.name}</h3>
                  <a href={user.profileUrl} target="_blank" rel="noopener noreferrer" className="profile-link">
                    View Profile
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-results">{users.length === 0 ? 'No users found. Try a different search.' : 'Start by searching for a LinkedIn user.'}</p>
          )}
        </div>
        <div className="pagination">
          <button
            onClick={handlePreviousPage}
            disabled={isLoading || currentPage === 1}
            className="pagination-button"
          >
            Previous
          </button>
          <span className="page-info">Page {currentPage}</span>
          <button
            onClick={handleNextPage}
            disabled={isLoading || usersOnCurrentPage.length < usersPerPage}
            className="pagination-button"
          >
            Next
          </button>
        </div>
      </div>
      <button className="dark-mode-toggle" onClick={handleDarkModeToggle}>
        {isDarkMode ? '☀️' : '🌙'}
      </button>
      <style jsx>{`
        /* Add LinkedIn specific styles */
      `}</style>
    </div>
  );
};

export default UserSearch;
