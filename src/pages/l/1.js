import React, { useState } from 'react';
import Head from 'next/head';

const UserSearch = () => {
  const [searchText, setSearchText] = useState('');
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);

    try {
      if (searchText.trim() !== '') {
        // Example: Using a mock API endpoint, replace with actual LinkedIn API integration
        const response = await fetch(`https://api.example.com/linkedin/search?q=${searchText}`);
        const data = await response.json();

        // Process data as per LinkedIn API response structure
        setUsers(data.results); // Assuming results contain user data
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

  return (
    <div className="container">
      <Head>
        <title>LinkedIn User Search</title>
        {/* Meta tags for SEO */}
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
            <p>Loading...</p>
          ) : users.length > 0 ? (
            <div className="user-grid">
              {users.map((user) => (
                <div key={user.id} className="user-card">
                  <img src={user.profileImageUrl} alt={`${user.name} avatar`} className="avatar" />
                  <h3 className="user-name">{user.name}</h3>
                  <a href={user.profileUrl} target="_blank" rel="noopener noreferrer" className="profile-link">
                    View Profile
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <p>No users found. Try a different search.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserSearch;
