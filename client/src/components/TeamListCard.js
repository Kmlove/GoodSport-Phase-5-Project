import { Link } from "react-router-dom"

function TeamListCard({team}) {
    const {id, team_name, age_group, gender} = team

  return (
    <div>
        <p>Team Name: {team_name}</p>
        <p>Age Group: {gender === "F"? `G${age_group}` : age_group}</p>
        <Link to={`/teams/${id}`}>See more...</Link>
    </div>
  )
}

export default TeamListCard