import { Link } from "react-router-dom"

function TeamCard({team}) {
    const {id, team_name, sport, club_id, age_group, gender} = team
    console.log(team)
  return (
    <div>
        <p>Team Name: {team_name}</p>
        <p>Age Group: {gender === "F"? `G${age_group}` : age_group}</p>
        <Link to={`/event/${id}`}>See more...</Link>
    </div>
  )
}

export default TeamCard