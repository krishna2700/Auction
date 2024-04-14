import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  CircularProgress,
} from "@mui/material";
import playersData from "./players.json";

const initialPoints = 5000;

const AuctionRoom = () => {
  const [players, setPlayers] = useState([]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [currentBid, setCurrentBid] = useState(0);
  const [biddingCaptain, setBiddingCaptain] = useState(null);
  const [highestBid, setHighestBid] = useState(0);
  const [pendingPlayers, setPendingPlayers] = useState([]);
  const [soldPlayers, setSoldPlayers] = useState([]);
  const [captains, setCaptains] = useState([
    { id: 1, name: "Captain 1", points: initialPoints, bid: 0, team: [] },
    { id: 2, name: "Captain 2", points: initialPoints, bid: 0, team: [] },
    { id: 3, name: "Captain 3", points: initialPoints, bid: 0, team: [] },
  ]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    // Simulate fetching player data from JSON files
    setTimeout(() => {
      setPlayers(
        playersData.ListC.concat(playersData.ListB, playersData.ListA)
      );
      setCurrentPlayer(playersData.ListC[0]);
      setCurrentBid(playersData.ListC[0].basePrice);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    if (currentPlayer) {
      setCurrentBid(currentPlayer.basePrice);
      setBiddingCaptain(null);
    }
  }, [currentPlayer]);

  const handleBid = (captainId) => {
    const newBid = currentBid + currentPlayer.basePrice;
    setCurrentBid(newBid);
    const updatedCaptains = captains.map((captain) =>
      captain.id === captainId ? { ...captain, bid: newBid } : captain
    );
    setCaptains(updatedCaptains);
    setBiddingCaptain(captainId);
    setHighestBid(newBid);
  };

  const handleBidOver = () => {
    const winningCaptain = captains.find(
      (captain) => captain.bid === highestBid
    );
    const winningPlayer = players.find(
      (player) => player.id === currentPlayer.id
    );
    setSoldPlayers([...soldPlayers, winningPlayer]);
    winningCaptain.points -= highestBid;
    winningCaptain.team.push(winningPlayer);
    const updatedPendingPlayers = pendingPlayers.filter(
      (player) => player.id !== winningPlayer.id
    );
    setPendingPlayers(updatedPendingPlayers);
    setCurrentPlayerIndex(currentPlayerIndex + 1);
    resetBids();
  };

  const resetBids = () => {
    const updatedCaptains = captains.map((captain) => ({
      ...captain,
      bid: 0,
    }));
    setCaptains(updatedCaptains);
    setBiddingCaptain(null);
    setHighestBid(0);
    if (currentPlayerIndex < players.length) {
      setCurrentPlayer(players[currentPlayerIndex]);
      setCurrentBid(players[currentPlayerIndex].basePrice);
    }
  };

  return (
    <Container>
      <Typography variant="h1" gutterBottom>
        Auction Room
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Current Player: {currentPlayer && currentPlayer.name}
                </Typography>
                {currentPlayer && (
                  <>
                    <Typography variant="body1" gutterBottom>
                      Base Price: {currentPlayer.basePrice}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      Current Bid: {currentBid}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      Bidding Captain:{" "}
                      {biddingCaptain ? captains[biddingCaptain - 1].name : "-"}
                    </Typography>
                    {captains.map((captain) => (
                      <div key={captain.id}>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleBid(captain.id)}
                          disabled={captain.bid >= captains[0].points}
                        >
                          {captain.name} Bid: {captain.bid}
                        </Button>
                      </div>
                    ))}
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={handleBidOver}
                      disabled={!biddingCaptain}
                    >
                      Bid Over
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h2" gutterBottom>
              Pending Players
            </Typography>
            <ul>
              {pendingPlayers.map((player) => (
                <li key={player.id}>{player.name}</li>
              ))}
            </ul>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h2" gutterBottom>
              Sold Players
            </Typography>
            <ul>
              {soldPlayers.map((player) => (
                <li key={player.id}>{player.name}</li>
              ))}
            </ul>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h2" gutterBottom>
              Captains' Teams
            </Typography>
            {captains.map((captain) => (
              <div key={captain.id}>
                <Typography variant="h5" gutterBottom>
                  {captain.name}'s Team
                </Typography>
                <ul>
                  {captain.team.map((player) => (
                    <li key={player.id}>{player.name}</li>
                  ))}
                </ul>
              </div>
            ))}
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h2" gutterBottom>
              Captains' Points
            </Typography>
            <ul>
              {captains.map((captain) => (
                <li key={captain.id}>{`${captain.name}: ${captain.points}`}</li>
              ))}
            </ul>
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default AuctionRoom;
