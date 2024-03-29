import CoachTeamList from "./CoachTeamList";
import PlayerTeamList from "./PlayerTeamList";

function TeamsList({ user, teams }) {

  if (user.is_admin === true && user.teams.length === 0){
    return (
        <div className="right">
            <h2 className="containerHeaders">My Teams</h2>
            <h4 className="no-upcoming">You Do Not Have Any Teams Yet...</h4>
        </div>
    )
  } else {
    return (
      <div className="right">
        {user.is_admin? <CoachTeamList user={user} teams={teams} /> : <PlayerTeamList user={user}/>}
      </div>
    )
  }

}

export default TeamsList;