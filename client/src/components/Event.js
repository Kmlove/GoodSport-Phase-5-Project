import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

function Event() {
    const {id} = useParams()
    const [curEvent, setCurEvent] = useState("")
    const {date, event_time, event_type} = curEvent

    useEffect(() => {
        fetch(`/events/${id}`)
        .then(res => res.json())
        .then(data => setCurEvent(data))
    }, [])

  return (
    <div>
        {date}
        {event_type}
        {event_time}
    </div>
  )
}

export default Event