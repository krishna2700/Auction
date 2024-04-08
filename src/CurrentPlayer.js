import React from "react";

const CurrentPlayer = ({ currentPlayer, currentPlayerList }) => {
  return (
    <div className="current-player">
      <h2>Current Player</h2>
      <div>
        <p>Name: {currentPlayer?.name || "None"}</p>
        <p>Points: {currentPlayer?.points || "None"}</p>
      </div>
    </div>
  );
};

export default CurrentPlayer;
