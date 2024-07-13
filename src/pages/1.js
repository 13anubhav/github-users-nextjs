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

  useEffect(() => {
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

    fetchData();
  }, [searchText]);

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
      </Head>
      <h1 className="heading">Anubhav GitHub User Search</h1>
      <input
        type="text"
        placeholder="Search users..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        className="search-input"
      />
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
              <td colSpan="4">Data is fetching...</td>
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
                  <a href={user.html_url} target="_blank" rel="noopener noreferrer">
                    {user.html_url}
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
          padding: 20px;
          background: ${backgroundGradient};
          transition: background 0.5s;
        }

        .dark-mode {
          background: #333;
        }

        .heading {
          font-size: 24px;
          margin-bottom: 10px;
        }

        .search-input {
          width: 100%;
          padding: 10px;
          margin-bottom: 20px;
          border: 1px solid #ccc;
          border-radius: 5px;
        }

        .user-table {
          width: 100%;
          border-collapse: collapse;
          background: rgba(255, 255, 255, 0.8);
          border-radius: 5px;
        }

        .user-table th,
        .user-table td {
          padding: 10px;
          border: 1px solid #ccc;
        }

        .avatar {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          margin-right: 10px;
        }

        .pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-top: 20px;
        }

        .pagination-button {
          background-color: #FF8B3E; 
          color: white;
          border: none;
          padding: 8px 12px;
          border-radius: 5px;
          cursor: pointer;
          margin: 0 5px;
          transition: background-color 0.3s, color 0.3s;
        }

        .pagination-button:hover {
          background-color: #014DFF;
        }

        .pagination-button:disabled {
          background-color: #ccc;
          color: #888;
          cursor: not-allowed;
        }

        .page-info {
          margin: 0 10px;
        }

        .color-controls {
          margin-top: 20px;
        }

        .dark-mode-toggle {
          background-color: ${isDarkMode ? '#555' : '#333'};
          color: white;
          border: none;
          padding: 5px 10px;
          border-radius: 3px;
          cursor: pointer;
          transition: background-color 0.3s;
        }

        .dark-mode-toggle:hover {
          background-color: ${isDarkMode ? '#444' : '#222'};
        }

        @media (max-width: 600px) {
          .search-input {
            width: 100%;
          }

          .user-table {
            font-size: 12px;
          }

          .avatar {
            width: 20px;
            height: 20px;
            margin-right: 5px;
          }

          .pagination-button {
            padding: 6px 8px;
          }

          .dark-mode-toggle {
            padding: 4px 8px;
          }
        }
      `}</style>
      <PopUpChat />
    </div>
  );
};

export default UserSearch;
