import EventCard from "./EventCard";

function Schedule({events}) {

  return (
    <div className="right">
      {events.map(event => <EventCard key={event.id} event={event}/> )}
    </div>
  )
}

export default Schedule;