import React from "react";
import { Button } from "@mui/material";

const LeaderCard = ({ leader, handleShowPlayerList }) => {
  return (
    <div className="leader-card">
      <h2>{leader.name}</h2>
      <p>Points: {leader.points}</p>
      <p>Mentor: {leader.mentors[0]?.name || "None"}</p>
      <p>Sports Person: {leader.sportsPersons[0]?.name || "None"}</p>
      <Button onClick={() => handleShowPlayerList(leader)}>Players List</Button>
    </div>
  );
};

export default LeaderCard;
