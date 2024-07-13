import React, { useState, useEffect } from 'react';
import PopUpChat from './c1'; 
import Head from 'next/head';

const UserSearch = () => {
  const [searchText, setSearchText] = useState('');
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5; // Adjust the number of users per page for responsiveness
  const [isLoading, setIsLoading] = useState(false);
  const [backgroundGradient, setBackgroundGradient] = useState('linear-gradient(#f06, #09f)');
  const [isDarkMode, setIsDarkMode] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);

    try {
      if (searchText.trim() !== '') {
        const response = await fetch(`https://api.github.com/search/users?q=${searchText}`);
        const data = await response.json();

        const usersWithFollowers = await Promise.all(
          data.items.map(async (user) => {
            const followerResponse = await fetch(user.followers_url);
            const followerData = await followerResponse.json();
            return { ...user, followers: followerData.length };
          })
        );

        setUsers(usersWithFollowers);
        setCurrentPage(1); // Reset to the first page when new data is fetched
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error('Error fetching GitHub users:', error);
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
    <div className={`container ${isDarkMode ? 'dark-mode' : ''}`}>
      <Head>
        <title>Anubhav GitHub User Search</title>
        <meta name="description" content="Anubhav GitHub User Search" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/img.jpg" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap" rel="stylesheet" />
      </Head>
      <div className="content-wrapper">
        <h1 className="heading">GitHub User Explorer</h1>
        <form onSubmit={handleSearchSubmit} className="search-form">
          <input
            type="text"
            placeholder="Enter GitHub username..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-button">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
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
                  <img src={user.avatar_url} alt={`${user.login} avatar`} className="avatar" />
                  <h3 className="user-name">{user.login}</h3>
                  <a href={user.html_url} target="_blank" rel="noopener noreferrer" className="profile-link">
                    View Profile
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-results">{users.length === 0 ? 'No users found. Try a different search.' : 'Start by searching for a GitHub user.'}</p>
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
      <div className="color-controls">
        <button className="dark-mode-toggle" onClick={handleDarkModeToggle}>
          {isDarkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
      </div>
      <style jsx>{`
        .container {
          min-height: 100vh;
          font-family: 'Poppins', sans-serif;
          background: ${isDarkMode ? '#1a1a2e' : '#f0f2f5'};
          color: ${isDarkMode ? '#ffffff' : '#333333'};
          transition: background-color 0.3s, color 0.3s;
        }

        .content-wrapper {
          max-width: 1200px;
          margin: 0 auto;
          padding: 40px 20px;
        }

        .heading {
          font-size: 42px;
          font-weight: 600;
          text-align: center;
          margin-bottom: 40px;
          color: ${isDarkMode ? '#ffffff' : '#2d3748'};
        }

        .search-form {
          display: flex;
          justify-content: center;
          margin-bottom: 40px;
        }

        .search-input {
          width: 60%;
          max-width: 500px;
          padding: 15px 25px;
          border: none;
          border-radius: 50px;
          font-size: 16px;
          background-color: ${isDarkMode ? '#16213e' : '#ffffff'};
          color: ${isDarkMode ? '#ffffff' : '#333333'};
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
        }

        .search-input:focus {
          outline: none;
          box-shadow: 0 0 0 3px ${isDarkMode ? '#4a5568' : '#63b3ed'};
        }

        .search-button {
          background-color: #4299e1;
          color: white;
          border: none;
          border-radius: 50%;
          width: 50px;
          height: 50px;
          margin-left: -50px;
          cursor: pointer;
          transition: background-color 0.3s, transform 0.1s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .search-button:hover {
          background-color: #3182ce;
          transform: translateY(-2px);
        }

        .search-button:active {
          transform: translateY(0);
        }

        .user-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 30px;
        }

        .user-card {
          background-color: ${isDarkMode ? '#16213e' : '#ffffff'};
          border-radius: 10px;
          padding: 20px;
          text-align: center;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease;
        }

        .user-card:hover {
          transform: translateY(-5px);
        }

        .avatar {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          object-fit: cover;
          margin-bottom: 15px;
          border: 3px solid #4299e1;
        }

        .user-name {
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 10px;
          color: ${isDarkMode ? '#ffffff' : '#2d3748'};
        }

        .profile-link {
          display: inline-block;
          padding: 8px 16px;
          background-color: #4299e1;
          color: white;
          text-decoration: none;
          border-radius: 5px;
          transition: background-color 0.3s;
        }

        .profile-link:hover {
          background-color: #3182ce;
        }

        .pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-top: 40px;
        }

        .pagination-button {
          background-color: #4299e1;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 5px;
          cursor: pointer;
          margin: 0 10px;
          transition: background-color 0.3s, transform 0.1s;
          font-size: 14px;
        }

        .pagination-button:hover {
          background-color: #3182ce;
          transform: translateY(-2px);
        }

        .pagination-button:active {
          transform: translateY(0);
        }

        .pagination-button:disabled {
          background-color: #a0aec0;
          cursor: not-allowed;
          transform: none;
        }

        .page-info {
          font-size: 16px;
          font-weight: 600;
        }

        .color-controls {
          position: fixed;
          bottom: 20px;
          right: 20px;
        }

        .dark-mode-toggle {
          background-color: ${isDarkMode ? '#4299e1' : '#2d3748'};
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 5px;
          cursor: pointer;
          transition: background-color 0.3s, transform 0.1s;
          font-size: 14px;
        }

        .dark-mode-toggle:hover {
          background-color: ${isDarkMode ? '#3182ce' : '#1a202c'};
          transform: translateY(-2px);
        }

        .dark-mode-toggle:active {
          transform: translateY(0);
        }

        .loader-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 200px;
        }

        .loader {
          border: 4px solid ${isDarkMode ? '#4a5568' : '#e2e8f0'};
          border-top: 4px solid #4299e1;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
        }

        .no-results {
          text-align: center;
          font-size: 18px;
          color: ${isDarkMode ? '#a0aec0' : '#4a5568'};
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .heading {
            font-size: 32px;
          }

          .search-form {
            flex-direction: column;
            align-items: center;
          }

          .search-input {
            width: 100%;
            margin-bottom: 10px;
          }

          .search-button {
            margin-left: 0;
          }

          .user-grid {
            grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          }
        }
      `}</style>
      {/* <PopUpChat /> */}
    </div>
  );
};

export default UserSearch;
