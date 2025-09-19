import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function Player() {
  const { id } = useParams();
  const [currPlayer, setCurrPlayer] = useState(null);

  useEffect(() => {
    fetch(`/players/${id}`)
      .then((res) => res.json())
      .then((data) => setCurrPlayer(data))
      .catch((error) =>
        console.error(
          `There was an error fetching player at id: ${id}: ${error}`
        )
      );
  }, [id]);

  if (currPlayer === null) {
    return <h3>Loading...</h3>;
  } else {
    const { birthday, gender, parent_email, parent_name, player_name, team } =
      currPlayer;

    return <div>{player_name}</div>;
  }
}

export default Player;
