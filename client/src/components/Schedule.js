import ScheduleCard from "./ScheduleCard";
import { useNavigate } from "react-router-dom";
import React from 'react';
import { Alert } from 'antd';

function Schedule({events, user, teams, handleDeleteEvent, handleShowSuccessfulDeleteAlert, showSuccessfulDeleteAlert, showErrorDeleteAlert, handleShowErrorDeleteAlert}) {
  const navigate = useNavigate()

  if (events.length === 0) {
    return (
      <div className="right">
        <h2 className="containerHeaders">Schedule</h2>
        {user.is_admin? 
        <button onClick={() => navigate('/event/new')} className="add-event-button">Add An Event</button> : null
        }
        <h4 className="no-upcoming">You Have No Upcoming Events...</h4>
      </div>
    )
  } else {
    return (
      <div className="right">
        <h2 className="containerHeaders">Schedule</h2>
        {user.is_admin? 
          <button onClick={() => navigate('/event/new')} className="add-event-button">Add An Event</button> : null
        }
  
        {showSuccessfulDeleteAlert? <Alert className="alert-top" message="Event Successfully Deleted" type="success" banner showIcon /> : null}
        {showErrorDeleteAlert? <Alert className="alert-top" message="An error occured deleting the event, please try again later!" type="error" banner showIcon /> : null}
          
        {events.map(event => (
          <ScheduleCard 
            key={event.id} 
            event={event} 
            user={user} 
            teams={teams} 
            handleDeleteEvent={handleDeleteEvent}
            handleShowSuccessfulDeleteAlert={handleShowSuccessfulDeleteAlert}
            handleShowErrorDeleteAlert={handleShowErrorDeleteAlert} 
          />) 
        )}
      </div>
    )
  }
}

export default Schedule;
