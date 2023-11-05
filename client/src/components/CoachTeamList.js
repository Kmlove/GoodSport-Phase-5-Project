import TeamListCard from "./TeamListCard"

function CoachTeamList({user, teams, events}) {
    const team_ids = events.map(event => event.team_id)
    const unique_team_ids = []
    for (let i=0; i < team_ids.length; i++){
        const num = team_ids[i]
        if (!unique_team_ids.includes(num)){
            unique_team_ids.push(num)
        }
    }

    const myTeams = []
    for (const id of unique_team_ids){
        for (const team of teams){
            if (team.id === id){
                myTeams.push(team)
            }
        }
    }
  return (
    <>
        <h2 className="containerHeaders">My Teams</h2>
        <div id="teamListContainer">
            {myTeams.map(team => <TeamListCard key={team.id} team={team}/>)}
        </div>
    </>
  )
}

export default CoachTeamList