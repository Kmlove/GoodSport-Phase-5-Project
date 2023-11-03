import ScheduleCard from "./ScheduleCard";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import { Radio, Timeline } from 'antd';
import { Alert } from 'antd';

function Schedule({events, user, teams, handleDeleteEvent, handleShowSuccessfulDeleteAlert, showSuccessfulDeleteAlert, showErrorDeleteAlert, handleShowErrorDeleteAlert}) {
  const navigate = useNavigate()

  if (events.length === 0){
    return (
      <div className="right">
        <h2>Schedule</h2>
        {user.is_admin? 
        <button onClick={() => navigate('/event/new')}>Add An Event</button> : null
        }
        <h4>You Have No Upcoming Events...</h4>
      </div>
    )
  } else{
    return (
      <div className="right">
        <h2 className="containerHeaders">Schedule</h2>
        {user.is_admin? 
          <button onClick={() => navigate('/event/new')} className="add-event-button">Add An Event</button> : null
        }
  
        {showSuccessfulDeleteAlert? <Alert message="Event Successfully Deleted" type="success" banner closable showIcon /> : null}
        {showErrorDeleteAlert? <Alert message="An error occured deleting the event, please try again later!" type="error" banner closable showIcon /> : null}
          
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
