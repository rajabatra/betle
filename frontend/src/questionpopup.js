import React from 'react';
import './questionpopup.css'; // Create and import CSS for styling

const Questionpopup = ({ isOpen, onClose, githublink }) => {
  if (!isOpen) return null;
    
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>How To Play</h2>
        <hr className="modal-divider"/>
        <p>Every Day A new game will be selected at Random. Each user will have
            between 1am and 4pm PST to select their choice for the day. Picks will lock at 4pmand games will typically be 
            between 4pm PST and 8pm PST. If the user correctly picked the winner, then their streak will 
            go up by 1. Otherwise it will reset to 0. Games are selected from the following sports: football, basketball, baseball, and soccer.
        </p>
        <hr className="modal-divider"/>
        <a href='https://github.com/rajabatra' target="_blank" rel="noopener noreferrer">Check Out The Project</a>
        <button className="close-button" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default Questionpopup;