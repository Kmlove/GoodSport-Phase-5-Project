import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import "../CSS/eventStyles.css"

function Event() {
    const {id} = useParams()
    const [curEvent, setCurEvent] = useState(null)

    useEffect(() => {
        fetch(`/events/${id}`)
        .then(res => res.json())
        .then(data => setCurEvent(data))
    }, [id])

  if (curEvent === null){
    return <h3>Loading...</h3>
  } else{
    const {date, event_time, event_type, notes, location, team, coach} = curEvent
    return (
      <div className="event-details">
        <h2 className="event-title">{`${event_type} Details`}</h2>
        <p><strong>Event Type:</strong> <span className="value">{event_type}</span></p>
        <p><strong>Date:</strong> <span className="value">{date}</span></p>
        <p><strong>Time:</strong> <span className="value">{event_time}</span></p>
        <p><strong>Notes:</strong> <span className="value">{notes}</span></p>
        <p><strong>Location:</strong> <span className="value">{location}</span></p>
        <p><strong>Team:</strong> <span className="value">{team.team_name}</span></p>
        <p><strong>Coach:</strong> <span className="value">{coach.coach_name}</span></p>
      </div>
    )
  }
}

export default Event