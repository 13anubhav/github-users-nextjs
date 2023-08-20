import React, { useState } from 'react';

const PopUpChat = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  const handleDarkModeToggle = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className="chat-container">
      <button className="chat-toggle-button" onClick={toggleChat}>
        {isChatOpen ? 'Close Code Guide' : 'Open Code Guide'}
      </button>
      {isChatOpen && (
        <div className={`chat-popup ${isDarkMode ? 'dark-mode' : ''}`}>
          <div className="chat-header">
            <h2 className="chat-heading">Anubhav Github User Search</h2>
            <button className="dark-mode-toggle" onClick={handleDarkModeToggle}>
              {isDarkMode ? 'Light Mode' : 'Dark Mode'}
            </button>
          </div>

          <h3 style={{textAlign:'center'}}>I have added The Following Additional Functionality :-</h3>
          <h3 style={{textAlign:'center'}}>1. Pagination on github users Profile.</h3>
          <h3 style={{textAlign:'center'}}>2. Direct Link to Navigate to User's Github Profile via click on Image.</h3>
          <h3 style={{textAlign:'center'}}>3. I have added Dark Mode</h3>
          <h3 style={{textAlign:'center'}}>4. Handled Error by Using Try Catch Stements.</h3>
          <h3 style={{textAlign:'center'}}>5. Added Loading Text While the Data is Getting Fetched from the Github.</h3>
          <h3 style={{ textAlign: 'center' }}>
        <a
          href="https://www.linkedin.com/in/anubhav-chaudhary-4bba7918b/"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: '#0077b5',
            textDecoration: 'none',
            transition: 'color 0.3s', // Adding the transition for--> smooth color change
            ':hover': {
              color: '#0FF8B3E', // New color change --> on hover
            },
          }}
        >
          @Anubhav
        </a>
      </h3>
         
        </div>
      )}
      <style jsx>{`
        .chat-container {
          position: fixed;
          bottom: 20px;
          right: 20px;
          z-index: 999;
        }

        .chat-toggle-button {
          background-color: #007bff;
          color: white;
          border: none;
          padding: 8px 12px;
          border-radius: 5px;
          cursor: pointer;
          transition: background-color 0.3s, color 0.3s;
        }

        .chat-toggle-button:hover {
          background-color: #0056b3;
        }

        .chat-popup {
          position: fixed;
          bottom: 80px;
          right: 20px;
          width: 300px;
          border: 1px solid #ccc;
          background-color: white;
          border-radius: 5px;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
          z-index: 1000;
        }

        .dark-mode {
          background: #333;
          color: white;
        }

        .chat-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px;
          background-color: #007bff;
          color: white;
          border-radius: 5px 5px 0 0;
        }

        .chat-heading {
          font-size: 18px;
          margin: 0;
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
      `}</style>
    </div>
  );
};

export default PopUpChat;
