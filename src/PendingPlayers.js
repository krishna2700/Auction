import React from "react";
import { List, ListItem, ListItemText } from "@mui/material";

const PendingPlayers = ({ pendingPlayers }) => {
  return (
    <div className="pending-players">
      <h2>Pending Players</h2>
      <List>
        {pendingPlayers.map((player, index) => (
          <ListItem key={index}>
            <ListItemText primary={player.name} />
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default PendingPlayers;
