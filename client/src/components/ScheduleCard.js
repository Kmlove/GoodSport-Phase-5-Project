function ScheduleCard({event, user, teams}) {
  const {coach_id, team_id, date, duration, event_type, location, start_time} = event
  const coachesTeam = teams.filter(team => team.id === team_id)

  if (coachesTeam.length === 0){
    return <h3>Loading....</h3>
  } else {
    return (

      <div className="scheduleCard">
          {date}
          {event_type}
          {user.is_admin? coachesTeam[0].team_name : user.team.team_name}
          {location}
      </div>
    )
  }
}

export default ScheduleCard