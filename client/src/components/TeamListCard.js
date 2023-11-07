import { Link } from "react-router-dom"
import "../CSS/teamStyles.css"

function TeamListCard({team}) {
    const {id, team_name, age_group, gender} = team
    
  return (
      <div className="coachTeam">
        <p><strong>Team Name:</strong> <span className="value">{team_name}</span></p>
        <p><strong>Age Group:</strong> <span className="value">{gender === "F"? `G${age_group}` : age_group}</span></p>
        <Link to={`/teams/${id}`}>See more...</Link>
      </div>
  )
}

export default TeamListCard