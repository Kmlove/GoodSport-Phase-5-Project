import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import dayjs from 'dayjs';
import { Alert } from 'antd';
import EditEventForm from "./EditEventForm"
import "../CSS/eventStyles.css"

function Event({handleDeleteEvent, handleUpdateEvent, user, handleShowSuccessfulDeleteAlert, handleShowErrorDeleteAlert, handleShowSuccessfulAddAlert, showSuccessfulAddAlert}) {
  const navigate = useNavigate()
  const {id} = useParams()
  const [curEvent, setCurEvent] = useState(null)
  const [editEvent, setEditEvent] = useState(false)
  const [showSuccessfulUpdateAlert, setShowSuccessfulUpdateAlert] = useState(false)
  const [showErrorUpdateAlert, setShowErrorUpdateAlert] = useState(false)

  useEffect(() => {
      fetch(`/events/${id}`)
      .then(res => res.json())
      .then(data => setCurEvent(data))
  }, [id])

  useEffect(() => {
    if (showSuccessfulUpdateAlert) {
      // Use a setTimeout to hide the alert after 3 seconds
      const timer = setTimeout(() => {
        setShowSuccessfulUpdateAlert(false);
      }, 3000); // 3000 milliseconds (3 seconds)

      // Clear the timer if the component unmounts
      return () => clearTimeout(timer);
    } else if (showErrorUpdateAlert) {
      // Use a setTimeout to hide the alert after 3 seconds
      const timer = setTimeout(() => {
        setShowErrorUpdateAlert(false);
      }, 3000); // 3000 milliseconds (3 seconds)

      // Clear the timer if the component unmounts
      return () => clearTimeout(timer);
    } else if (showSuccessfulAddAlert) {
      // Use a setTimeout to hide the alert after 3 seconds
      const timer = setTimeout(() => {
        handleShowSuccessfulAddAlert(false);
      }, 3000); // 3000 milliseconds (3 seconds)

      // Clear the timer if the component unmounts
      return () => clearTimeout(timer);
    }
  }, [showSuccessfulUpdateAlert, showErrorUpdateAlert, showSuccessfulAddAlert, handleShowSuccessfulAddAlert ]);

  function handleDeleteClick(e){
    fetch(`/events/${id}`, {
      method: "DELETE"
    })
    .then(res => {
      if (res.status === 204){
        handleDeleteEvent(curEvent)
        handleShowSuccessfulDeleteAlert(true)
        navigate('/schedule')
      } else if (res.status === 404){
        handleShowErrorDeleteAlert(true)
        return Promise.reject('Event Not Found')
      } else if (res.status === 500){
        handleShowErrorDeleteAlert(true)
        return Promise.reject('Server Error') 
      } else {
        handleShowErrorDeleteAlert(true)
        console.error("Delete Operation Failed")
      }
    })
    .catch(err => console.error("Error: ", err))
  }

  function handleShowSuccessfulUpdateAlert(value){
    setShowSuccessfulUpdateAlert(value)
  }

  function handleShowErrorUpdateAlert(value){
    setShowErrorUpdateAlert(value)
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
      <div className="right">
        {showSuccessfulUpdateAlert? <Alert style={{border: "1px solid red"}} className="alert-top" message="Event Successfully Updated" type="success" banner showIcon /> : null}
        {showErrorUpdateAlert? <Alert className="alert-top" message="An error occured when updating this event, please try again later!" type="error" banner showIcon /> : null}
        {showSuccessfulAddAlert? <Alert className="alert-top" message="Event Successfully Created" type="success" banner showIcon /> : null}

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
            <div id="event-edit-delete-buttons">
              <button onClick={handleDeleteClick} className='event-delete-button'>Delete Event</button>
              <button onClick={handleEditClick} className='event-edit-button'>Edit Event</button>
            </div>
            ) : null
          }
          
          {editEvent? <EditEventForm id={id} handleUpdateEvent={handleUpdateEvent} handleUpdateCurEvent={handleUpdateCurEvent} handleCloseEditForm={handleCloseEditForm} handleShowSuccessfulUpdateAlert={handleShowSuccessfulUpdateAlert} handleShowErrorUpdateAlert={handleShowErrorUpdateAlert} /> : null}
        </div>
      </div>
    )
  }
}

export default Event