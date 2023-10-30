import ScheduleCard from "./ScheduleCard";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import { Radio, Timeline } from 'antd';
import { Alert } from 'antd';

function Schedule({events, user, teams, handleDeleteEvent, handleShowSuccessfulDeleteAlert, showSuccessfulDeleteAlert, showErrorDeleteAlert, handleShowErrorDeleteAlert}) {
  const navigate = useNavigate()

  useEffect(() => {
    if (showSuccessfulDeleteAlert) {
      // Use a setTimeout to hide the alert after 3 seconds
      const timer = setTimeout(() => {
        handleShowSuccessfulDeleteAlert(false);
      }, 3000); // 3000 milliseconds (3 seconds)

      // Clear the timer if the component unmounts
      return () => clearTimeout(timer);
    } else if (showErrorDeleteAlert) {
      // Use a setTimeout to hide the alert after 3 seconds
      const timer = setTimeout(() => {
        handleShowErrorDeleteAlert(false);
      }, 3000); // 3000 milliseconds (3 seconds)

      // Clear the timer if the component unmounts
      return () => clearTimeout(timer);
    }
  }, [showSuccessfulDeleteAlert, showErrorDeleteAlert]);

  return (
    <div className="right">
      {showSuccessfulDeleteAlert? <Alert message="Event Successfully Deleted" type="success" banner closable showIcon /> : null}
      {showErrorDeleteAlert? <Alert message="An error occured deleting the event, please try again later!" type="error" banner closable showIcon /> : null}

      {user.is_admin? 
        <button onClick={() => navigate('/event/new')}>Add An Event</button> : null
      }
        
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

export default Schedule;
