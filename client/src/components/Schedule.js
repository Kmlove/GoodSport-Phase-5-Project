import ScheduleCard from "./ScheduleCard";
import { useNavigate } from "react-router-dom";
import React, { useState } from 'react';
import { Radio, Timeline } from 'antd';

function Schedule({events, user, teams, handleDeleteEvent}) {
  const navigate = useNavigate()

  return (
    <div className="right">
      {user.is_admin? 
        <button onClick={() => navigate('/event/new')}>Add An Event</button> : null}
        
      {events.map(event => (
        <ScheduleCard 
          key={event.id} 
          event={event} 
          user={user} 
          teams={teams} 
          handleDeleteEvent={handleDeleteEvent} 
        />) 
      )}
    </div>
  )
}

export default Schedule;
