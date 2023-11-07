import { Link } from "react-router-dom";
import dayjs from 'dayjs';
import "../CSS/scheduleCardStyles.css"
import soccerBall from "../IMAGES/Soccerball.jpg"
import basketball from "../IMAGES/Basketball.jpg"

function ScheduleCard({event, user, teams, handleDeleteEvent, handleShowSuccessfulDeleteAlert, handleShowErrorDeleteAlert}) {
  const {team_id, date, event_type, location, id} = event
  const coachesTeam = teams.filter(team => team.id === team_id)
  const formattedDate = dayjs(date).format('MM-DD-YYYY')

  function handleDeleteClick(e){
    fetch(`/events/${id}`, {
      method: "DELETE"
    })
    .then(res => {
      if (res.status === 204){
        handleDeleteEvent(event)
        handleShowSuccessfulDeleteAlert(true)
      } else if (res.status === 404){
        handleShowErrorDeleteAlert(true)
        return Promise.reject('Event Not Found')
      } else if (res.status === 500){
        handleShowErrorDeleteAlert(true)
        return Promise.reject('Internal Server Error') 
      } else {
        handleShowErrorDeleteAlert(true)
        console.error("Delete Operation Failed")
      }
    })
    .catch(err => console.error("Error: ", err))
  }
  
  if (user.is_admin && coachesTeam.length === 0){
    return <h3>Loading....</h3>
  } else {
    const sport = user.is_admin? coachesTeam[0].sport : user.team.sport
    let ballSRC 
    switch (sport) {
      case "Soccer":
        ballSRC=soccerBall
        break;
      case "Basketball":
        ballSRC=basketball
        break;
      default:
        break;
    }
    return (

      <div className="scheduleCard">
          {user.is_admin? <button onClick={handleDeleteClick} className='schedule-delete-button'>✖</button> : null}

          <div id="schedule-img-text-containter">
            <img src={ballSRC} alt={`${sport}`} id="ball"/>
            <div>
              <p><span id="sc-date">{formattedDate}</span></p>
              <p><span id="sc-team">{user.is_admin? coachesTeam[0].team_name : user.team.team_name}</span></p>
              <p><span id="sc-event-type">{event_type}</span></p>
              <p><span id="sc-location">{location}</span></p>
            </div>
          </div>

          <Link to={`/event/${id}`}>See more...</Link>
      </div>
    )
  }
}

export default ScheduleCard