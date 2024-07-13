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
        <title>GitHub User Explorer</title>
        <meta name="description" content="Explore GitHub users with ease" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/img.jpg" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap" rel="stylesheet" />
      </Head>
      <div className="content-wrapper">
        <h1 className="heading">GitHub User Explorer</h1>
        <form onSubmit={handleSearchSubmit} className="search-form">
          <input
            type="text"
            placeholder="Enter a GitHub username..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-button">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
              <path d="M21.71 20.29l-5.01-5.01C17.54 13.68 18 11.91 18 10c0-4.41-3.59-8-8-8S2 5.59 2 10s3.59 8 8 8c1.91 0 3.68-0.46 5.28-1.3l5.01 5.01c0.39 0.39 1.02 0.39 1.41 0l1.41-1.41c0.39-0.39 0.39-1.02 0-1.41zM10 16c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z"/>
            </svg>
          </button>
        </form>
        <div className="table-container">
          <table className="user-table">
            <thead>
              <tr>
                <th>#</th>
                <th>User</th>
                <th>Profile</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="4">
                    <div className="loader"></div>
                  </td>
                </tr>
              ) : Array.isArray(usersOnCurrentPage) && usersOnCurrentPage.length > 0 ? (
                usersOnCurrentPage.map((user, index) => (
                  <tr key={user.id}>
                    <td>{startIndex + index + 1}</td>
                    <td>
                      <div className="user-info">
                        <img src={user.avatar_url} alt={`${user.login} avatar`} className="avatar" />
                        <span className="username">{user.login}</span>
                      </div>
                    </td>
                    <td>
                      <a href={user.html_url} target="_blank" rel="noopener noreferrer" className="profile-link">
                        {user.html_url}
                      </a>
                    </td>
                    <td>
                      <a href={user.html_url} target="_blank" rel="noopener noreferrer" className="view-profile-btn">
                        View Profile
                      </a>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="no-results">
                    {users.length === 0 ? 'No users found. Try a different search.' : 'Start by searching for a GitHub user.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
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
        {isDarkMode ? 'Light Mode' : 'Dark Mode'}
      </button>
      <style jsx>{`
        .container {
          text-align: center;
          padding: 40px 20px;
          background: ${isDarkMode ? '#1a1a2e' : '#f0f2f5'};
          color: ${isDarkMode ? '#e0e0e0' : '#333'};
          transition: background 0.3s, color 0.3s;
          min-height: 100vh;
          font-family: 'Poppins', sans-serif;
        }

        .content-wrapper {
          max-width: 1200px;
          margin: 0 auto;
        }

        .heading {
          font-size: 2.5rem;
          margin-bottom: 30px;
          color: ${isDarkMode ? '#fff' : '#2d3748'};
          font-weight: 600;
        }

        .search-form {
          display: flex;
          justify-content: center;
          margin-bottom: 40px;
        }

        .search-input {
          width: 60%;
          padding: 12px 20px;
          border: none;
          border-radius: 30px 0 0 30px;
          font-size: 16px;
          background-color: ${isDarkMode ? '#2a2a3a' : '#fff'};
          color: ${isDarkMode ? '#e0e0e0' : '#333'};
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          transition: all 0.3s ease;
        }

        .search-input:focus {
          outline: none;
          box-shadow: 0 0 0 2px ${isDarkMode ? '#4a5568' : '#3182ce'};
        }

        .search-button {
          padding: 12px 25px;
          background-color: #3182ce;
          color: white;
          border: none;
          border-radius: 0 30px 30px 0;
          cursor: pointer;
          transition: background-color 0.3s, transform 0.1s;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .search-button:hover {
          background-color: #2c5282;
          transform: translateY(-2px);
        }

        .search-button:active {
          transform: translateY(0);
        }

        .table-container {
          background: ${isDarkMode ? '#16213e' : '#ffffff'};
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          margin-bottom: 30px;
        }

        .user-table {
          width: 100%;
          border-collapse: collapse;
        }

        .user-table th,
        .user-table td {
          padding: 15px;
          text-align: left;
          border-bottom: 1px solid ${isDarkMode ? '#2d3748' : '#e2e8f0'};
        }

        .user-table th {
          background-color: ${isDarkMode ? '#2c3e50' : '#edf2f7'};
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
          font-size: 14px;
          color: ${isDarkMode ? '#a0aec0' : '#4a5568'};
        }

        .user-table tr:hover {
          background-color: ${isDarkMode ? '#1e2a3a' : '#f7fafc'};
        }

        .user-info {
          display: flex;
          align-items: center;
        }

        .avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          margin-right: 15px;
          object-fit: cover;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .username {
          font-weight: 600;
          color: ${isDarkMode ? '#63b3ed' : '#3182ce'};
        }

        .profile-link {
          color: ${isDarkMode ? '#90cdf4' : '#4299e1'};
          text-decoration: none;
          transition: color 0.3s;
        }

        .profile-link:hover {
          color: ${isDarkMode ? '#63b3ed' : '#3182ce'};
          text-decoration: underline;
        }

        .view-profile-btn {
          display: inline-block;
          padding: 8px 15px;
          background-color: ${isDarkMode ? '#4a5568' : '#ebf8ff'};
          color: ${isDarkMode ? '#e2e8f0' : '#3182ce'};
          border-radius: 20px;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .view-profile-btn:hover {
          background-color: ${isDarkMode ? '#718096' : '#bee3f8'};
          transform: translateY(-2px);
        }

        .pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-top: 30px;
        }

        .pagination-button {
          background-color: #3182ce;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 25px;
          cursor: pointer;
          margin: 0 10px;
          transition: all 0.3s ease;
          font-size: 14px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .pagination-button:hover {
          background-color: #2c5282;
          transform: translateY(-2px);
        }

        .pagination-button:disabled {
          background-color: ${isDarkMode ? '#4a5568' : '#cbd5e0'};
          color: ${isDarkMode ? '#a0aec0' : '#718096'};
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .page-info {
          font-size: 16px;
          font-weight: 600;
          color: ${isDarkMode ? '#a0aec0' : '#4a5568'};
          margin: 0 15px;
        }

        .dark-mode-toggle {
          position: fixed;
          bottom: 20px;
          right: 20px;
          background-color: ${isDarkMode ? '#4a5568' : '#3182ce'};
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 25px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 14px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .dark-mode-toggle:hover {
          background-color: ${isDarkMode ? '#718096' : '#2c5282'};
          transform: translateY(-2px);
        }

        .loader {
          border: 4px solid ${isDarkMode ? '#4a5568' : '#e2e8f0'};
          border-top: 4px solid #3182ce;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
          margin: 20px auto;
        }

        .no-results {
          padding: 40px;
          text-align: center;
          color: ${isDarkMode ? '#a0aec0' : '#718096'};
          font-style: italic;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .heading {
            font-size: 2rem;
          }

          .search-form {
            flex-direction: column;
            align-items: center;
          }

          .search-input {
            width: 100%;
            border-radius: 30px;
            margin-bottom: 10px;
          }

          .search-button {
            width: 100%;
            border-radius: 30px;
          }

          .user-table {
            font-size: 14px;
          }

          .avatar {
            width: 30px;
            height: 30px;
          }

          .pagination-button {
            padding: 8px 15px;
            font-size: 12px;
          }

          .dark-mode-toggle {
            padding: 8px 15px;
            font-size: 12px;
          }
        }
      `}</style>
      <PopUpChat />
    </div>
  );
};

export default UserSearch;
