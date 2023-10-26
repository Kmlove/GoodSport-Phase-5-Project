function EventCard({event}) {
    const {coach_id, date, duration, event_type, location, start_time} = event

  return (
    <div className="eventCard">
        {date}
        {event_type}
        {"teamname"}
        {location}

    </div>
  )
}

export default EventCard