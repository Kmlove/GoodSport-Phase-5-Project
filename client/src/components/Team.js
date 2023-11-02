import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

function Team() {
    const {id} = useParams()
    const [ currTeam, setCurrTeam ] = useState(null)
    const [ coaches, setCoaches ] = useState([])

    useEffect(() => {
        fetch(`/teams/${id}`)
        .then(res => res.json())
        .then(data => setCurrTeam(data))
    }, [id])

    useEffect(() => {
        fetch('/coaches')
        .then(res => res.json())
        .then(data => setCoaches(data))
    }, [id])

    if (currTeam === null){
        return <h3>Loading...</h3>

    } else {
        console.log(currTeam)
        const {age_group, club, events, gender, id, players, sport, team_name} = currTeam

        const coach_ids = events.map(event => event.coach_id)
        const unique_coach_ids = []
        for (let i=0; i < coach_ids.length; i++){
            const num = coach_ids[i]
            if (!unique_coach_ids.includes(num)){
                unique_coach_ids.push(num)
            }
        }

        const myCoaches = []
        for (const id of unique_coach_ids){
            for (const coach of coaches){
                if (coach.id === id){
                    myCoaches.push(coach)
                }
            }
        }
        console.log(myCoaches)

        return (
            <div>
                <p>{team_name}</p>
                <p>{club.club_name}</p>
                <p>{gender === "F"? `G${age_group}`: {age_group}}</p>
                <div>Coach(es): {myCoaches.map(coach => {
                    return (
                        <p key={coach.id}>
                            Name: {coach.coach_name} Email: {coach.email}
                        </p>
                    )
                })}</div>
                {players.length === 0 ? (
                    <div>
                        Players:
                            <p>No Players Yet...</p>
                    </div>
                ) : (
                    <div>
                        Players: {players.map(player => {
                            return (
                                <p key={player.id}>
                                    {player.player_name}
                                </p>
                            )
                        })}
                    </div>
                )}
      
                <p></p>
                <p></p>
            </div>
          )
    }

}

export default Team