import ScheduleCard from "./ScheduleCard";
import { Alert } from 'antd';
import { Link } from "react-router-dom";
import "../CSS/homeStyles.css"

function Home({events, user, teams, handleDeleteEvent, handleShowSuccessfulDeleteAlert, handleShowErrorDeleteAlert, showSuccessfulDeleteAlert, showErrorDeleteAlert}) {
  const homePageEvents = events.slice(0,3)

  if (events.length === 0){
    return (
      <div className="right">
        <h2 className="containerHeaders">Home</h2>
        <h3 id="upcoming-events">Upcoming Events:</h3>
        <h4 className="no-upcoming">You Have No Upcoming Events...</h4>
      </div>
    )
  } else {
    return (
      <div className="right">
        <h2 className="containerHeaders">Home</h2>
        <h3 id="upcoming-events">Upcoming Events: <Link to={'/schedule'} id="see-full-schedule">See full schedule...</Link></h3>
  
        {showSuccessfulDeleteAlert? <Alert className="alert-top" message="Event Successfully Deleted" type="success" banner showIcon /> : null}
        {showErrorDeleteAlert? <Alert className="alert-top" message="An error occured deleting the event, please try again later!" type="error" banner showIcon /> : null}
  
        {homePageEvents.map(event => (
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

export default Home;