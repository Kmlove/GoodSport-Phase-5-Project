import { Link } from "react-router-dom";
import "../CSS/scheduleCardStyles.css"

function ScheduleCard({event, user, teams}) {
  const {coach_id, team_id, date, duration, event_type, location, start_time, id} = event
  const coachesTeam = teams.filter(team => team.id === team_id)
  
  if (user.is_admin && coachesTeam.length === 0){
    return <h3>Loading....</h3>
  } else {
    return (

      <div className="scheduleCard">
          <p>Team: {user.is_admin? coachesTeam[0].team_name : user.team.team_name}</p>
          <p>Date: {date}</p>
          <p>Event Type: {event_type}</p>
          <p>Location: {location}</p>
          <Link to={`/event/${id}`}>See more...</Link>
      </div>
    )
  }
}

export default ScheduleCard