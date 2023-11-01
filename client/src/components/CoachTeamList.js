import TeamCard from "./TeamCard"

function CoachTeamList({user, teams}) {
    const team_ids = user.events.map(event => event.team_id)
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
        <h2>My Teams</h2>
        {myTeams.map(team => <TeamCard key={team.id} team={team}/>)}
    </>
  )
}

export default CoachTeamList