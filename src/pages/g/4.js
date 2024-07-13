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
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;700&display=swap" rel="stylesheet" />
      </Head>
      <h1 className="heading">Anubhav GitHub User Search</h1>
      <form onSubmit={handleSearchSubmit} className="search-form">
        <input
          type="text"
          placeholder="Search users..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="search-input"
        />
        <button type="submit" className="search-button">Search</button>
      </form>
      <div className="table-container">
        <table className="user-table">
          <thead>
            <tr>
              <th>Serial Number</th>
              <th>Profile Image</th>
              <th>Name</th>
              <th>Profile Link</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="4">
                  <div className="loader"></div>
                  <p>Data is fetching...</p>
                </td>
              </tr>
            ) : Array.isArray(usersOnCurrentPage) && usersOnCurrentPage.length > 0 ? (
              usersOnCurrentPage.map((user, index) => (
                <tr key={user.id}>
                  <td>{startIndex + index + 1}</td>
                  <td>
                    <a href={user.html_url} target="_blank" rel="noopener noreferrer">
                      <img
                        src={user.avatar_url}
                        alt={`${user.login} avatar`}
                        className="avatar"
                      />
                    </a>
                  </td>
                  <td>
                    <a href={user.html_url} target="_blank" rel="noopener noreferrer">
                      {user.login}
                    </a>
                  </td>
                  <td>
                    <a href={user.html_url} target="_blank" rel="noopener noreferrer" className="profile-link">
                      View Profile
                    </a>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">
                  {users.length === 0 ? 'No users found. Please try again...' : 'Loading...'}
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
      <div className="color-controls">
        <button className="dark-mode-toggle" onClick={handleDarkModeToggle}>
          {isDarkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
      </div>
      <style jsx>{`
        .container {
          text-align: center;
          padding: 40px 20px;
          background: ${backgroundGradient};
          transition: background 0.5s;
          min-height: 100vh;
          font-family: 'Roboto', sans-serif;
        }

        .dark-mode {
          background: linear-gradient(#222, #444);
          color: #fff;
        }

        .heading {
          font-size: 36px;
          margin-bottom: 30px;
          color: ${isDarkMode ? '#fff' : '#333'};
          text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
        }

        .search-form {
          display: flex;
          justify-content: center;
          margin-bottom: 30px;
        }

        .search-input {
          width: 60%;
          padding: 12px 20px;
          border: none;
          border-radius: 25px 0 0 25px;
          font-size: 16px;
          box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }

        .search-button {
          padding: 12px 25px;
          background-color: #007bff;
          color: white;
          border: none;
          border-radius: 0 25px 25px 0;
          cursor: pointer;
          transition: background-color 0.3s, transform 0.1s;
          font-size: 16px;
          box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }

        .search-button:hover {
          background-color: #0056b3;
          transform: translateY(-2px);
        }

        .search-button:active {
          transform: translateY(0);
        }

        .table-container {
          max-width: 1000px;
          margin: 0 auto;
          overflow-x: auto;
        }

        .user-table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
          background: ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.8)'};
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }

        .user-table th,
        .user-table td {
          padding: 15px;
          text-align: left;
          border-bottom: 1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'};
        }

        .user-table th {
          background-color: ${isDarkMode ? '#444' : '#f8f9fa'};
          font-weight: bold;
          text-transform: uppercase;
          letter-spacing: 1px;
          font-size: 14px;
        }

        .user-table tr:last-child td {
          border-bottom: none;
        }

        .user-table tr:hover {
          background-color: ${isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)'};
        }

        .avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          object-fit: cover;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .profile-link {
          color: #007bff;
          text-decoration: none;
          transition: color 0.3s;
        }

        .profile-link:hover {
          color: #0056b3;
          text-decoration: underline;
        }

        .pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-top: 30px;
        }

        .pagination-button {
          background-color: #FF8B3E; 
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 25px;
          cursor: pointer;
          margin: 0 10px;
          transition: background-color 0.3s, transform 0.1s;
          font-size: 14px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .pagination-button:hover {
          background-color: #014DFF;
          transform: translateY(-2px);
        }

        .pagination-button:active {
          transform: translateY(0);
        }

        .pagination-button:disabled {
          background-color: #ccc;
          color: #888;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .page-info {
          font-size: 16px;
          font-weight: bold;
          color: ${isDarkMode ? '#fff' : '#333'};
        }

        .color-controls {
          margin-top: 30px;
        }

        .dark-mode-toggle {
          background-color: ${isDarkMode ? '#555' : '#333'};
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 25px;
          cursor: pointer;
          transition: background-color 0.3s, transform 0.1s;
          font-size: 14px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .dark-mode-toggle:hover {
          background-color: ${isDarkMode ? '#666' : '#444'};
          transform: translateY(-2px);
        }

        .dark-mode-toggle:active {
          transform: translateY(0);
        }

        .loader {
          border: 4px solid #f3f3f3;
          border-top: 4px solid #3498db;
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
            font-size: 28px;
          }

          .search-form {
            flex-direction: column;
            align-items: center;
          }

          .search-input {
            width: 100%;
            border-radius: 25px;
            margin-bottom: 10px;
          }

          .search-button {
            width: 100%;
            border-radius: 25px;
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
