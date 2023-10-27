import ScheduleCard from "./ScheduleCard";
import { useNavigate } from "react-router-dom";
import React, { useState } from 'react';
import { Radio, Timeline } from 'antd';

function Schedule({events, user, teams}) {
  const navigate = useNavigate()

  return (
    <div className="right">
      {events.map(event => <ScheduleCard key={event.id} event={event} user={user} teams={teams}/> )}
    
      {user.is_admin? 
        <button onClick={() => navigate('/event/new')}>Add An Event</button> : null}
    </div>
  )
}

export default Schedule;
