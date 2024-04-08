import React, { useState, useEffect } from "react";
import data from "./data.json";
import { Grid } from "@mui/material";
import LeaderCard from "./LeaderCard";
import AuctionControls from "./AuctionControls";
import BidOverPlayers from "./BidOverPlayers";
import PendingPlayers from "./PendingPlayers";
import PlayerListDialog from "./PlayerListDialog";
import CurrentPlayer from "./CurrentPlayer";
import "./App.css";

const App = () => {
  const [teamLeaders, setTeamLeaders] = useState([]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [currentBidderIndex, setCurrentBidderIndex] = useState(null);
  const [currentBid, setCurrentBid] = useState(null);
  const [currentPlayerList, setCurrentPlayerList] = useState("playersA");
  const [bidOverPlayers, setBidOverPlayers] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedLeader, setSelectedLeader] = useState(null);
  const [prevBidderIndex, setPrevBidderIndex] = useState(null);
  const [pendingPlayers, setPendingPlayers] = useState([]);
  const [allPlayersAuctioned, setAllPlayersAuctioned] = useState(false);

  useEffect(() => {
    setTeamLeaders(
      data.teamLeaders.map((leader) => ({
        ...leader,
        mentors: [
          data.mentors[Math.floor(Math.random() * data.mentors.length)],
        ],
        sportsPersons: [
          data.sportsPersons[
            Math.floor(Math.random() * data.sportsPersons.length)
          ],
        ],
        currentBid: null,
        bidOverForPlayers: [],
      }))
    );
  }, []);

  useEffect(() => {
    const allPlayersAuctioned = teamLeaders.every((leader) => {
      return (
        leader.playersA.length === 0 &&
        leader.playersB.length === 0 &&
        leader.playersC.length === 0
      );
    });
    setAllPlayersAuctioned(allPlayersAuctioned);
  }, [teamLeaders]);

  const handleStartBidding = () => {
    setCurrentBidderIndex(0);
    setCurrentBid(null);
  };

  const handleBid = () => {
    if (allPlayersAuctioned) return;

    let bidAmount = 0;
    const currentLeaderName = teamLeaders[currentBidderIndex].name;

    if (bidOverPlayers.some((bid) => bid.leaderName === currentLeaderName)) {
      setCurrentBidderIndex(getNextBidderIndex());
      return;
    }

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
    const prevWinner = updatedLeaders[prevBidderIndex];

    if (currentBid === null) {
      if (prevBidderIndex !== null) {
        prevWinner[currentPlayerList].push(currentPlayer);
        switch (currentPlayerList) {
          case "playersA":
            prevWinner.points -= 100;
            break;
          case "playersB":
            prevWinner.points -= 50;
            break;
          case "playersC":
            prevWinner.points -= 25;
            break;
          default:
            break;
        }
      }
    } else {
      if (winningLeader.points >= currentBid) {
        winningLeader[currentPlayerList].push(currentPlayer);
        winningLeader.points -= currentBid;
      }
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
    setPrevBidderIndex(currentBidderIndex);
    setCurrentBidderIndex(null);
    clearBidOverPlayers();
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
      const currentPlayerName =
        data[currentPlayerList][currentPlayerIndex].name;
      teamLeaders.forEach((leader) => {
        if (!leader.bidOverForPlayers.includes(currentPlayerName)) {
          leader.bidOverForPlayers.push(currentPlayerName);
          setBidOverPlayers((prevBidOverPlayers) => [
            ...prevBidOverPlayers,
            { leaderName: leader.name, playerName: currentPlayerName },
          ]);
        }
      });
    }
    setCurrentBidderIndex(getNextBidderIndex());
  };

  const getNextBidderIndex = () => {
    let nextBidderIndex = currentBidderIndex + 1;

    while (true) {
      if (nextBidderIndex >= teamLeaders.length) {
        nextBidderIndex = 0;
      }

      const currentLeaderName = teamLeaders[nextBidderIndex].name;

      if (!bidOverPlayers.some((bid) => bid.leaderName === currentLeaderName)) {
        break;
      }

      nextBidderIndex++;
    }

    return nextBidderIndex;
  };

  const clearBidOverPlayers = () => {
    setBidOverPlayers([]);
  };

  const handleShowPlayerList = (leader) => {
    setSelectedLeader(leader);
    setShowDialog(true);
  };

  const handleClosePlayerList = () => {
    setShowDialog(false);
  };

  const handlePending = () => {
    const currentPlayer = data[currentPlayerList][currentPlayerIndex];
    setPendingPlayers((prevPendingPlayers) => [
      ...prevPendingPlayers,
      currentPlayer,
    ]);
    setCurrentPlayerIndex((prevIndex) => prevIndex + 1);
    setCurrentBidderIndex(null);
    setCurrentBid(null);
    setBidOverPlayers([]);
  };

  return (
    <div className="app-container">
      <h1>Auction System</h1>
      <Grid container spacing={2}>
        {teamLeaders.map((leader) => (
          <Grid item xs={4} key={leader.id}>
            <LeaderCard
              leader={leader}
              handleShowPlayerList={handleShowPlayerList}
            />
          </Grid>
        ))}
      </Grid>
      <AuctionControls
        currentBidderIndex={currentBidderIndex}
        currentBid={currentBid}
        handleBid={handleBid}
        handleBidSuccess={handleBidSuccess}
        handleBidOver={handleBidOver}
        handleStartBidding={handleStartBidding}
        handlePending={handlePending}
        teamLeaders={teamLeaders}
        pendingPlayers={pendingPlayers}
      />
      <BidOverPlayers bidOverPlayers={bidOverPlayers} />
      <PendingPlayers pendingPlayers={pendingPlayers} />
      <PlayerListDialog
        showDialog={showDialog}
        handleClosePlayerList={handleClosePlayerList}
        selectedLeader={selectedLeader}
        currentPlayerList={currentPlayerList}
      />
      <CurrentPlayer
        currentPlayer={data[currentPlayerList][currentPlayerIndex]}
        currentPlayerList={currentPlayerList}
      />
      {allPlayersAuctioned && <p>No players available now</p>}
    </div>
  );
};

export default App;
