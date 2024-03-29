import ScheduleCard from "./ScheduleCard";
import { redirect, useNavigate } from "react-router-dom";
import React from 'react';
import { Alert, Select, Checkbox } from 'antd';

function Schedule({events, user, teams, handleDeleteEvent, handleShowSuccessfulDeleteAlert, showSuccessfulDeleteAlert, showErrorDeleteAlert, handleShowErrorDeleteAlert, handleSetFilterScheduleEventsValue, handleFutureEventsCheck, futureEventsCheck}) {
  const navigate = useNavigate()
  const uniqueTeamsArray = []
  const uniqueTeamsIds = []

  const handleFilterClick = (value) => {
    handleSetFilterScheduleEventsValue(value)
  };

  if (user.is_admin === true){
    user.teams.forEach(teamObj => {
      if(!uniqueTeamsIds.includes(teamObj.id)){
        uniqueTeamsArray.push(teamObj)
        uniqueTeamsIds.push(teamObj.id)
      }
    });
  }

  const items = uniqueTeamsArray.map(team => ({
    label: `${team.team_name}`,
    value: team.id
  }))
  items.unshift({
    label: "Full Schedule",
    value: 0
  })

  if (events.length === 0) {
    return (
      <div className="right">
        <h2 className="containerHeaders">Schedule</h2>
        
        {user.is_admin ? (
          <div id="admin-schedule-button-div">
            <button onClick={() => {
              navigate('/event/new')
              handleSetFilterScheduleEventsValue(0)
              handleFutureEventsCheck(true)
            }} className="add-event-button">Add An Event</button>
          
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
            
            <div id="checkbox-container">
              <label id="checkbox-label" htmlFor="checkbox">Upcoming Events Only</label>
              <Checkbox id="checkbox" checked={futureEventsCheck} onChange={(e)=> handleFutureEventsCheck(e.target.checked)}></Checkbox>
            </div>
          </div>
        ) : null}

        {!user.is_admin ? (
          <div id="admin-schedule-button-div">
            <div id="checkbox-container">
              <label id="checkbox-label" htmlFor="checkbox">Upcoming Events Only</label>
              <Checkbox id="checkbox" checked={futureEventsCheck} onChange={(e)=> handleFutureEventsCheck(e.target.checked)}></Checkbox>
            </div>
          </div>
        ) : null}
        <h4 className="no-upcoming" style={user.is_admin? {position: "relative", top: "220px"} : {position: "relative", top: "80px"}}>You Have No Upcoming Events...</h4>
      </div>
    )
  } else {

    return (
      <div className="right">
        <h2 className="containerHeaders">Schedule</h2>
        
        {user.is_admin ? (
          <div id="admin-schedule-button-div">
            <button onClick={() => {
              navigate('/event/new')
              handleSetFilterScheduleEventsValue(0)
              handleFutureEventsCheck(true)
            }} className="add-event-button">Add An Event</button>
          
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
            
            <div id="checkbox-container">
              <label id="checkbox-label" htmlFor="checkbox">Upcoming Events Only</label>
              <Checkbox id="checkbox" checked={futureEventsCheck} onChange={(e)=> handleFutureEventsCheck(e.target.checked)}></Checkbox>
            </div>
          </div>
        ) : null}

        {!user.is_admin ? (
          <div id="admin-schedule-button-div">
            <div id="checkbox-container">
              <label id="checkbox-label" htmlFor="checkbox">Upcoming Events Only</label>
              <Checkbox id="checkbox" checked={futureEventsCheck} onChange={(e)=> handleFutureEventsCheck(e.target.checked)}></Checkbox>
            </div>
          </div>
        ) : null}
        
  
        {showSuccessfulDeleteAlert? <Alert className="alert-top" message="Event Successfully Deleted" type="success" banner showIcon /> : null}
        {showErrorDeleteAlert? <Alert className="alert-top" message="An error occured deleting the event, please try again later!" type="error" banner showIcon /> : null}
        
        <div id="schedule-card-container" style={user.is_admin? {} : {top: "60px"}}>
          <h3 className="schedule-subheader">{futureEventsCheck? "Upcoming Events:" : "All Events:"}</h3>

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
      </div>
    )
  }
}

export default Schedule;
