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
    <div className={`container ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
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
          <table className="user-table">
            <thead>
              <tr>
                <th>Profile</th>
                <th>Username</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="3">
                    <div className="loader"></div>
                  </td>
                </tr>
              ) : Array.isArray(usersOnCurrentPage) && usersOnCurrentPage.length > 0 ? (
                usersOnCurrentPage.map((user, index) => (
                  <tr key={user.id}>
                    <td>
                      <img src={user.avatar_url} alt={`${user.login} avatar`} className="avatar" />
                    </td>
                    <td>{user.login}</td>
                    <td>
                      <a href={user.html_url} target="_blank" rel="noopener noreferrer" className="profile-link">
                        View Profile
                      </a>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3">
                    {users.length === 0 ? 'No users found. Try a different search.' : 'Loading...'}
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
        {isDarkMode ? '☀️' : '🌙'}
      </button>
      <style jsx>{`
        .container {
          min-height: 100vh;
          font-family: 'Poppins', sans-serif;
          transition: background-color 0.3s, color 0.3s;
        }

        .light-mode {
          background-color: #f0f4f8;
          color: #333;
        }

        .dark-mode {
          background-color: #1a202c;
          color: #f0f4f8;
        }

        .content-wrapper {
          max-width: 1200px;
          margin: 0 auto;
          padding: 40px 20px;
        }

        .heading {
          font-size: 3rem;
          font-weight: 600;
          text-align: center;
          margin-bottom: 2rem;
          color: #3498db;
        }

        .search-form {
          display: flex;
          justify-content: center;
          margin-bottom: 2rem;
        }

        .search-input {
          width: 60%;
          padding: 12px 20px;
          font-size: 1rem;
          border: none;
          border-radius: 30px 0 0 30px;
          background-color: ${isDarkMode ? '#2d3748' : '#ffffff'};
          color: ${isDarkMode ? '#f0f4f8' : '#333'};
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .search-button {
          padding: 12px 20px;
          background-color: #3498db;
          color: white;
          border: none;
          border-radius: 0 30px 30px 0;
          cursor: pointer;
          transition: background-color 0.3s;
        }

        .search-button:hover {
          background-color: #2980b9;
        }

        .table-container {
          background-color: ${isDarkMode ? '#2d3748' : '#ffffff'};
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .user-table {
          width: 100%;
          border-collapse: collapse;
        }

        .user-table th,
        .user-table td {
          padding: 1rem;
          text-align: left;
        }

        .user-table th {
          background-color: #3498db;
          color: white;
          font-weight: 600;
        }

        .user-table tr:nth-child(even) {
          background-color: ${isDarkMode ? '#34495e' : '#f8fafc'};
        }

        .avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          object-fit: cover;
        }

        .profile-link {
          color: #3498db;
          text-decoration: none;
          transition: color 0.3s;
        }

        .profile-link:hover {
          color: #2980b9;
        }

        .pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-top: 2rem;
        }

        .pagination-button {
          background-color: #3498db;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 30px;
          cursor: pointer;
          margin: 0 10px;
          transition: background-color 0.3s;
        }

        .pagination-button:hover:not(:disabled) {
          background-color: #2980b9;
        }

        .pagination-button:disabled {
          background-color: #bdc3c7;
          cursor: not-allowed;
        }

        .page-info {
          font-size: 1rem;
          font-weight: 600;
        }

        .dark-mode-toggle {
          position: fixed;
          bottom: 20px;
          right: 20px;
          background-color: ${isDarkMode ? '#f0f4f8' : '#1a202c'};
          color: ${isDarkMode ? '#1a202c' : '#f0f4f8'};
          border: none;
          border-radius: 50%;
          width: 50px;
          height: 50px;
          font-size: 1.5rem;
          cursor: pointer;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          transition: background-color 0.3s, transform 0.3s;
        }

        .dark-mode-toggle:hover {
          transform: scale(1.1);
        }

        .loader {
          border: 4px solid ${isDarkMode ? '#f0f4f8' : '#3498db'};
          border-top: 4px solid ${isDarkMode ? '#3498db' : '#f0f4f8'};
          border-radius: 50%;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
          margin: 20px auto;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .heading {
            font-size: 2rem;
          }

          .search-input {
            width: 100%;
            border-radius: 30px;
          }

          .search-button {
            border-radius: 30px;
            margin-top: 10px;
          }

          .search-form {
            flex-direction: column;
          }

          .user-table {
            font-size: 0.9rem;
          }

          .pagination-button {
            padding: 8px 15px;
            font-size: 0.9rem;
          }
        }
      `}</style>
      <PopUpChat />
    </div>
  );
};

export default UserSearch;
