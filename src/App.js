import React, { useState, useEffect } from "react";
import data from "./data.json";
import "./App.css"; // Import CSS file for styling

const App = () => {
  const [teamLeaders, setTeamLeaders] = useState([]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [currentBidderIndex, setCurrentBidderIndex] = useState(null);
  const [currentBid, setCurrentBid] = useState(null);
  const [currentPlayerList, setCurrentPlayerList] = useState("playersA");
  const [bidOverPlayers, setBidOverPlayers] = useState([]);

  useEffect(() => {
    setTeamLeaders(
      data.teamLeaders.map((leader) => {
        const randomMentor =
          data.mentors[Math.floor(Math.random() * data.mentors.length)];
        const randomSportsPerson =
          data.sportsPersons[
            Math.floor(Math.random() * data.sportsPersons.length)
          ];
        return {
          ...leader,
          mentors: [randomMentor],
          sportsPersons: [randomSportsPerson],
          currentBid: null,
          bidOverForPlayers: [],
        };
      })
    );
  }, []);

  const handleStartBidding = () => {
    setCurrentBidderIndex(0);
    setCurrentBid(null);
  };

  const handleBid = () => {
    let bidAmount = 0;
    switch (currentPlayerList) {
      case "playersA":
        bidAmount = currentBid + 100;
        break;
      case "playersB":
        bidAmount = currentBid + 50;
        break;
      case "playersC":
        bidAmount = currentBid + 25;
        break;
      default:
        break;
    }
    setCurrentBid(bidAmount);
    setCurrentBidderIndex(getNextBidderIndex());
  };

  const handleBidSuccess = () => {
    const updatedLeaders = [...teamLeaders];
    const currentPlayer = data[currentPlayerList][currentPlayerIndex];
    const winningLeader = updatedLeaders[currentBidderIndex];
    if (winningLeader.points >= currentBid) {
      winningLeader[currentPlayerList].push(currentPlayer);
      winningLeader.points -= currentBid;
    }
    setCurrentBidderIndex(getNextBidderIndex());
    setCurrentPlayerIndex((prevIndex) => prevIndex + 1);
    setTeamLeaders(updatedLeaders);
    setCurrentBid(null);

    if (currentPlayerIndex + 1 >= data[currentPlayerList].length) {
      setCurrentBid(null);
      setCurrentBidderIndex(null);
      setCurrentPlayerIndex(0);
      setCurrentPlayerList(
        currentPlayerList === "playersA"
          ? "playersB"
          : currentPlayerList === "playersB"
          ? "playersC"
          : "playersA"
      );
    }
    setCurrentBidderIndex(null);
    clearBidOverPlayers(); // Clear bid over players list
  };

  useEffect(() => {
    if (currentPlayerIndex >= data[currentPlayerList].length) {
      setCurrentPlayerIndex(0);
      setCurrentPlayerList(
        currentPlayerList === "playersA"
          ? "playersB"
          : currentPlayerList === "playersB"
          ? "playersC"
          : "playersA"
      );
    }
  }, [currentPlayerIndex, currentPlayerList]);

  const handleBidOver = () => {
    if (currentBidderIndex !== null) {
      const currentPlayerName = teamLeaders[currentBidderIndex].name;
      const currentLeader = teamLeaders[currentBidderIndex];
      if (!currentLeader.bidOverForPlayers.includes(currentPlayerName)) {
        currentLeader.bidOverForPlayers.push(currentPlayerName);
        setBidOverPlayers((prevBidOverPlayers) => [
          ...prevBidOverPlayers,
          { leaderName: currentLeader.name, playerName: currentPlayerName },
        ]);
      }
    }
    setCurrentBidderIndex(getNextBidderIndex());
  };

  const isPlayerBidOver = (playerName) => {
    return bidOverPlayers.some((bid) => bid.playerName === playerName);
  };

  const getNextBidderIndex = () => {
    let nextBidderIndex = currentBidderIndex;
    const currentPlayerName = teamLeaders[currentBidderIndex].name;

    while (true) {
      nextBidderIndex = (nextBidderIndex + 1) % teamLeaders.length;

      if (
        nextBidderIndex === currentBidderIndex ||
        !teamLeaders[nextBidderIndex].bidOverForPlayers.includes(
          currentPlayerName
        )
      ) {
        break;
      }
    }

    return nextBidderIndex;
  };

  const clearBidOverPlayers = () => {
    setBidOverPlayers([]);
  };

  return (
    <div className="app-container">
      <h1>Auction System</h1>
      <div className="team-leaders-container">
        {teamLeaders.map((leader) => (
          <div className="leader-card" key={leader.id}>
            <h2>{leader.name}</h2>
            <p>Points: {leader.points}</p>
            <p>Mentor: {leader.mentors[0]?.name || "None"}</p>
            <p>Sports Person: {leader.sportsPersons[0]?.name || "None"}</p>
            <ul className="player-list">
              {leader[currentPlayerList].map((player, index) => (
                <li
                  key={index}
                  className={isPlayerBidOver(player.name) ? "bid-over" : ""}
                >
                  {player.name}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="auction-controls">
        {currentBidderIndex !== null ? (
          <div>
            <h3>
              Current Bidder: {teamLeaders[currentBidderIndex]?.name || "None"}
            </h3>
            <p>Current Bid: {currentBid}</p>
            <button onClick={handleBid}>Bid</button>
            <button onClick={handleBidSuccess}>Bid Success</button>
            <button onClick={handleBidOver}>Bid Over</button>
          </div>
        ) : (
          <button onClick={handleStartBidding}>Start Bidding</button>
        )}
      </div>
      <div className="bid-over-players">
        <h2>Bid Over Players</h2>
        <ul>
          {bidOverPlayers.map((bid) => (
            <li key={`${bid.leaderName}-${bid.playerName}`}>
              {bid.leaderName} marked {bid.playerName} as Bid Over
            </li>
          ))}
        </ul>
      </div>
      <div className="current-player">
        <h2>Current Player</h2>
        <div>
          <p>
            Name: {data[currentPlayerList][currentPlayerIndex]?.name || "None"}
          </p>
          <p>
            Points:{" "}
            {data[currentPlayerList][currentPlayerIndex]?.points || "None"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default App;
