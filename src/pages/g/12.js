import React, { useState, useEffect } from 'react';
import PopUpChat from './c1'; 
import Head from 'next/head';

const UserSearch = () => {
  const [searchText, setSearchText] = useState('');
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 8; // Adjust the number of users per page for responsiveness
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
      <button className="dark-mode-toggle" onClick={handleDarkModeToggle}>
        {isDarkMode ? '☀️' : '🌙'}
      </button>
      <style jsx>{`
        .container {
          min-height: 100vh;
          font-family: 'Poppins', sans-serif;
          transition: background-color 0.3s, color 0.3s;
          background-color: #1a1a2e;
        }
  
        .light-mode {
          color: #ffffff;
        }
  
        .dark-mode {
          color: #ffffff;
        }
  
        .content-wrapper {
          max-width: 1200px;
          margin: 0 auto;
          padding: 40px 20px;
        }
  
        .heading {
          font-size: 48px;
          font-weight: 600;
          text-align: center;
          margin-bottom: 40px;
          color: #ffffff;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
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
          background-color: ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.2)'};
          color: #ffffff;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
        }
  
        .search-input:focus {
          outline: none;
          box-shadow: 0 0 0 3px rgba(255,255,255,0.3);
        }
  
        .search-button {
          background-color: #30cfd0;
          color: white;
          border: none;
          border-radius: 50%;
          width: 50px;
          height: 50px;
          margin-left: -50px;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }
  
        .search-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        }
  
        .user-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 30px;
        }
  
        .user-card {
          background-color: ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.15)'};
          border-radius: 15px;
          overflow: hidden;
          box-shadow: 0 10px 20px rgba(0,0,0,0.1);
          transition: all 0.3s ease;
        }
  
        .user-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 15px 30px rgba(0,0,0,0.2);
        }
  
        .card-header {
          height: 80px;
        }
  
        .avatar {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          object-fit: cover;
          margin: -60px auto 0;
          display: block;
          border: 5px solid rgba(255,255,255,0.8);
          box-shadow: 0 5px 10px rgba(0,0,0,0.2);
        }
  
        .user-name {
          font-size: 20px;
          font-weight: 600;
          text-align: center;
          margin: 20px 0 10px;
          color: #ffffff;
        }
  
        .profile-link {
          display: block;
          width: 80%;
          margin: 0 auto 20px;
          padding: 10px;
          background-color: #30cfd0;
          color: white;
          text-decoration: none;
          border-radius: 25px;
          text-align: center;
          transition: all 0.3s ease;
        }
  
        .profile-link:hover {
          background-color: #112047;
          transform: scale(1.05);
        }
  
        .pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-top: 40px;
        }
  
        .pagination-button {
          background-color: #30cfd0;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 25px;
          cursor: pointer;
          margin: 0 10px;
          transition: all 0.3s ease;
          font-size: 16px;
        }
  
        .pagination-button:hover {
          background-color: #112047;
          transform: translateY(-2px);
        }
  
        .pagination-button:disabled {
          background-color: rgba(255,255,255,0.2);
          cursor: not-allowed;
          transform: none;
        }
  
        .page-info {
          font-size: 18px;
          font-weight: 600;
          color: #ffffff;
        }
  
        .dark-mode-toggle {
          position: fixed;
          bottom: 20px;
          right: 20px;
          background-color: #30cfd0;
          color: white;
          border: none;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          font-size: 24px;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
  
        .dark-mode-toggle:hover {
          transform: scale(1.1);
        }
  
        .loader-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 200px;
        }
  
        .loader {
          border: 4px solid rgba(255,255,255,0.3);
          border-top: 4px solid #30cfd0;
          border-radius: 50%;
          width: 50px;
          height: 50px;
          animation: spin 1s linear infinite;
        }
  
        .no-results {
          text-align: center;
          font-size: 20px;
          color: rgba(255,255,255,0.7);
        }
  
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
  
        @media (max-width: 768px) {
          .heading {
            font-size: 36px;
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
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          }
        }
      `}</style>
      {/* <PopUpChat /> */}
    </div>
  );}

export default UserSearch;
