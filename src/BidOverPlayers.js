import React from "react";

const BidOverPlayers = ({ bidOverPlayers, currentPlayerName }) => {
  const filteredBidOverPlayers = bidOverPlayers.filter(
    (bid) => bid.playerName === currentPlayerName
  );

  return (
    <div>
      <h2>Bid Over Players</h2>
      <ul>
        {filteredBidOverPlayers.map((bid, index) => (
          <li key={index}>
            {bid.leaderName} - {bid.playerName}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BidOverPlayers;
