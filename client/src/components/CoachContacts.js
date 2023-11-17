import React, { useState } from 'react'

function CoachContacts({user, teams, activePlayer, handleSetActivePlayer}) {

    // const [ activePlayer, setActivePlayer ] = useState("")

    const unique_team_ids = []
    for (let i=0; i < user.teams.length; i++){
        const num = user.teams[i].id
        if (!unique_team_ids.includes(num)){
            unique_team_ids.push(num)
        }
    }

    const myTeams = []
    for (const id of unique_team_ids){
        for (const team of teams){
            if (team.id === id){
                myTeams.push(team)
            }
        }
    }

    // Gets all the player associated with the coach
    const contacts = myTeams.map(team => {
        return team.players.map(player => player)
    })
    // Turns an array of nested arrays of player objs into a single array of all the player objs
    const combinedPlayers = []
    for (const array of contacts){
        for (const player of array){
            combinedPlayers.push(player)
        }
    }
    // Sorts the player objs by last name
    const sortedByLastName =  combinedPlayers.sort((a, b) => {
        const nameA = a.player_name
        const nameAArray = nameA.split(" ")
        const nameALastName = nameAArray[nameAArray.length-1]

        const nameB = b.player_name
        const nameBArray = nameB.split(" ")
        const nameBLastName = nameBArray[nameBArray.length-1]

        if (nameALastName < nameBLastName){
            return -1;
        }
        if (nameALastName > nameBLastName){
            return 1;
        }
        return 0;
    })

    const playerContacts = sortedByLastName.map(player => (
        <p 
            key={player.id}
            className={activePlayer === player.id? 'active-player coach-contact' : 'coach-contact'}
            onClick={() => handleSetActivePlayer(player.id)}
        >{player.player_name}</p>
    ))

    // Gets team names for the coach
    const teamContacts = myTeams.map(team => (
        <p 
            key={team.id}
            className={activePlayer === team.team_name? 'active-player coach-contact' : 'coach-contact'}
            onClick={() => handleSetActivePlayer(team.team_name)}
        ><span style={{fontWeight: "bold"}}>TEAM - </span>{team.team_name}</p>
    ))

  return (
    <>
        {teamContacts}
        {playerContacts}
    </>
  )
}

export default CoachContacts