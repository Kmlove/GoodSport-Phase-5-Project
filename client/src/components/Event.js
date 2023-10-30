import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import dayjs from 'dayjs';
import EditEventForm from "./EditEventForm"
import "../CSS/eventStyles.css"

function Event({handleDeleteEvent, handleUpdateEvent, user}) {
  const navigate = useNavigate()
  const {id} = useParams()
  const [curEvent, setCurEvent] = useState(null)
  const [editEvent, setEditEvent] = useState(false)

  useEffect(() => {
      fetch(`/events/${id}`)
      .then(res => res.json())
      .then(data => setCurEvent(data))
  }, [id])

  function handleDeleteClick(e){
    fetch(`/events/${id}`, {
      method: "DELETE"
    })
    .then(res => {
      if (res.status === 204){
        handleDeleteEvent(curEvent)
        navigate('/schedule')
      } else {
        console.log("Delete Operation Failed")
      }
    })
    .catch(err => console.log(err))
  }

  function handleEditClick(e){
    setEditEvent(!editEvent)
  }

  function handleUpdateCurEvent(updatedEvent){
    setCurEvent(updatedEvent)
  }

  function handleCloseEditForm(value){
    setEditEvent(value)
  }

  if (curEvent === null){
    return <h3>Loading...</h3>
  } else{
    const {date, event_time, event_type, notes, location, team, coach} = curEvent
    const formattedDate = dayjs(date).format('MM-DD-YYYY')

    return (
      <div className="event-details">
        <h2 className="event-title">{`${event_type} Details`}</h2>
        <p><strong>Team:</strong> <span className="value">{team.team_name}</span></p>
        <p><strong>Coach:</strong> <span className="value">{coach.coach_name}</span></p>
        <p><strong>Event Type:</strong> <span id="event_type" className="value">{event_type}</span></p>
        <p><strong>Date:</strong> <span id="date" className="value">{formattedDate}</span></p>
        <p><strong>Time:</strong> <span id="time" className="value">{event_time}</span></p>
        <p><strong>Location:</strong> <span id="location" className="value">{location}</span></p>
        <p><strong>Notes:</strong> <span id="notes" className="value">{notes}</span></p>
        {user.is_admin ? (
          <>
            <button onClick={handleDeleteClick} className='event-delete-button'>Delete Event</button>
            <button onClick={handleEditClick} className='event-edit-button'>Edit Event</button>
          </>
          ) : null
        }
        
        {editEvent? <EditEventForm id={id} handleUpdateEvent={handleUpdateEvent} handleUpdateCurEvent={handleUpdateCurEvent} handleCloseEditForm={handleCloseEditForm} /> : null}
      </div>
      
    )
  }
}

export default Event