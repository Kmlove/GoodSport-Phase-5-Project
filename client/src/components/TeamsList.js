import CoachTeamList from "./CoachTeamList";
import PlayerTeamList from "./PlayerTeamList";

function TeamsList({user, teams}) {
  return (
    <div className="right">
      {user.is_admin? <CoachTeamList user={user} teams={teams}/> : <PlayerTeamList />}
    </div>
  )
}

export default TeamsList;