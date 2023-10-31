import ScheduleCard from "./ScheduleCard";
import { Alert } from 'antd';
import { Link } from "react-router-dom";

function Home({events, user, teams, handleDeleteEvent, handleShowSuccessfulDeleteAlert, handleShowErrorDeleteAlert, showSuccessfulDeleteAlert, showErrorDeleteAlert}) {
  const homePageEvents = events.slice(0,3)
  
  return (
    <div className="right">
      <h2>Home</h2>
      <h3>Upcoming Events:</h3>

      {showSuccessfulDeleteAlert? <Alert message="Event Successfully Deleted" type="success" banner closable showIcon /> : null}
      {showErrorDeleteAlert? <Alert message="An error occured deleting the event, please try again later!" type="error" banner closable showIcon /> : null}

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

      <Link to={'/schedule'}>See full schedule...</Link>
    </div>
  )
}

export default Home;