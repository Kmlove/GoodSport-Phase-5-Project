import { Link } from "react-router-dom";
import dayjs from 'dayjs';
import "../CSS/scheduleCardStyles.css"

function ScheduleCard({event, user, teams, handleDeleteEvent}) {
  const {coach_id, team_id, date, duration, event_type, location, start_time, id} = event
  const coachesTeam = teams.filter(team => team.id === team_id)
  const formattedDate = dayjs(date).format('MM-DD-YYYY')

  function handleDeleteClick(e){
    fetch(`/events/${id}`, {
      method: "DELETE"
    })
    .then(res =>{
      if (res.status === 204){
        handleDeleteEvent(event)
      } else {
        console.log("Delete Operation Failed")
      }
    })
    .catch(err => console.log(err))
  }
  
  if (user.is_admin && coachesTeam.length === 0){
    return <h3>Loading....</h3>
  } else {
    return (

      <div className="scheduleCard">
          {user.is_admin? <button onClick={handleDeleteClick} className='schedule-delete-button'>✖</button> : null}
          <p>Team: {user.is_admin? coachesTeam[0].team_name : user.team.team_name}</p>
          <p>Date: {formattedDate}</p>
          <p>Event Type: {event_type}</p>
          <p>Location: {location}</p>
          <Link to={`/event/${id}`}>See more...</Link>
      </div>
    )
  }
}

export default ScheduleCard