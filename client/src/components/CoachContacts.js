import React from 'react'

function CoachContacts({user, teams}) {

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

    // Gets team names for the coach
    const teamContacts = myTeams.map(team => <p className='coach-contact'>{`Team - ${team.team_name}`}</p>)
    // Gets all the player names associated with the coach
    const contacts = myTeams.map(team => {
        return team.players.map(player => player.player_name)
    })
    // Turns an array of arrays of names into a single array with the names as elements
    const combinedNames = []
    for (const array of contacts){
        for (const name of array){
            combinedNames.push(name)
        }
    }

    // Sorts the names by last name
    const sortedByLastName =  combinedNames.sort((a, b) => {
        const nameA = a
        const nameAArray = nameA.split(" ")
        const nameALastName = nameAArray[nameAArray.length-1]

        const nameB = b
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

    const playerContacts = sortedByLastName.map(name => <p className='coach-contact'>{name}</p>)

  return (
    <>
        {teamContacts}
        {playerContacts}
    </>
  )
}

export default CoachContacts