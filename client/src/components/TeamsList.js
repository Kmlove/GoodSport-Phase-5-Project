import CoachTeamList from "./CoachTeamList";
import PlayerTeamList from "./PlayerTeamList";

function TeamsList({user, teams, events}) {

  if (events.length === 0){
    return (
        <div className="right">
            <h2>My Teams</h2>
            <h4>You Do Not Have Any Teams Yet...</h4>
        </div>
    )
  } else {
    return (
      <>
        {user.is_admin? <CoachTeamList user={user} teams={teams} events={events}/> : <PlayerTeamList user={user}/>}
      </>
    )
  }

}

export default TeamsList;