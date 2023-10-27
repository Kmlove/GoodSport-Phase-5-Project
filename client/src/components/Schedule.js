import ScheduleCard from "./ScheduleCard";
import { useNavigate } from "react-router-dom";


function Schedule({events, user, teams}) {
  const navigate = useNavigate()

  return (
    <div className="right">
      {events.map(event => <ScheduleCard key={event.id} event={event} user={user} teams={teams}/> )}
      <button onClick={() => navigate('/schedule/new')}>Add An Event</button>
    </div>
  )
}

export default Schedule;