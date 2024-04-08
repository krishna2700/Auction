// AuctionControls.js
import React from "react";
import { Button, IconButton } from "@mui/material";
import PendingIcon from "@mui/icons-material/Pending";

const AuctionControls = ({
  currentBidderIndex,
  currentBid,
  handleBid,
  handleBidSuccess,
  handleBidOver,
  handleStartBidding,
  handlePending,
  pendingPlayers,
  teamLeaders,
}) => {
  return (
    <div className="auction-controls">
      {currentBidderIndex !== null ? (
        <div>
          <h3>
            Current Bidder: {teamLeaders[currentBidderIndex]?.name || "None"}
          </h3>
          <p>Current Bid: {currentBid}</p>
          <Button onClick={handleBid}>Bid</Button>
          <Button onClick={handleBidSuccess}>Bid Success</Button>
          <Button onClick={handleBidOver}>Bid Over</Button>
          <IconButton onClick={handlePending} title="Mark as Pending">
            <PendingIcon />
          </IconButton>
        </div>
      ) : (
        <>
          {pendingPlayers.length === 0 && (
            <Button onClick={handleStartBidding}>Start Bidding</Button>
          )}
          {pendingPlayers.length > 0 && (
            <Button onClick={handleStartBidding}>Start Bidding</Button>
          )}
        </>
      )}
    </div>
  );
};

export default AuctionControls;
