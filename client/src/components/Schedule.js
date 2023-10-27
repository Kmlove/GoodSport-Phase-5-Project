import ScheduleCard from "./ScheduleCard";

function Schedule({events, user, teams}) {

  return (
    <div className="right">
      {events.map(event => <ScheduleCard key={event.id} event={event} user={user} teams={teams}/> )}
    </div>
  )
}

export default Schedule;