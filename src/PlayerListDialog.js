import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Button,
} from "@mui/material";

const PlayerListDialog = ({
  showDialog,
  handleClosePlayerList,
  selectedLeader,
  currentPlayerList,
}) => {
  return (
    <Dialog open={showDialog} onClose={handleClosePlayerList}>
      <DialogTitle>{selectedLeader?.name}'s Player List</DialogTitle>
      <DialogContent>
        <List>
          {selectedLeader?.[currentPlayerList].map((player, index) => (
            <ListItem key={index}>
              <ListItemText primary={player.name} />
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClosePlayerList}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default PlayerListDialog;
