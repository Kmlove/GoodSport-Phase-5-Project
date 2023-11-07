import ScheduleCard from "./ScheduleCard";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from 'react';
import { Alert, Select } from 'antd';

function Schedule({events, user, teams, handleDeleteEvent, handleShowSuccessfulDeleteAlert, showSuccessfulDeleteAlert, showErrorDeleteAlert, handleShowErrorDeleteAlert, handleSetFilterScheduleEventsValue}) {
  const navigate = useNavigate()
  const uniqueTeamsArray = []
  const uniqueTeamsIds = []

  if (user.is_admin === true){
    user.teams.forEach(teamObj => {
      if(!uniqueTeamsIds.includes(teamObj.id)){
        uniqueTeamsArray.push(teamObj)
        uniqueTeamsIds.push(teamObj.id)
      }
    });
  }

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
    const handleFilterClick = (value) => {
      console.log('click', value);
      handleSetFilterScheduleEventsValue(value)
    };

    const items = uniqueTeamsArray.map(team => ({
      label: `${team.team_name}`,
      value: team.id
    }))
    items.unshift({
      label: "Full Schedule",
      value: 0
    })


    return (
      <div className="right">
        <h2 className="containerHeaders">Schedule</h2>
        <div id="admin-schedule-button-div">
          {user.is_admin? 
            <button onClick={() => {
              navigate('/event/new')
              handleSetFilterScheduleEventsValue(0)
            }} className="add-event-button">Add An Event</button> : null
          }

          {user.is_admin? (
            <div id="schedule-filter-div">
              <label htmlFor="schedule-filter" id="filter-label">Filter Schedule By Team:</label>
              <Select
                className="filter-select"
                defaultValue="Full Schedule"
                style={{
                  width: 138,
                  height: 36,
                }}
                onChange={handleFilterClick}
                options={items}
              />
            </div>
          ) : null}
        </div>
  
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
