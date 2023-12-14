import { useEffect, useState } from "react"
import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import dayjs from "dayjs";

function PlayerTeamList({user}) {
    const id = user.team.id
    const [ currTeam, setCurrTeam ] = useState(null)

    useEffect(() => {
        fetch(`/teams/${id}`)
        .then(res => res.json())
        .then(data => setCurrTeam(data))
    }, [id])

    if (currTeam === null){
        return <h3>Loading...</h3>

    } else {
        const {age_group, club, gender, players, team_name, coaches} = currTeam

        return (
            <div >
                <div className="teamsHeaders">
                    <h2 id="my-team-header">My Team</h2>
                    <h3>{team_name} - <span id="age-group">{gender === "F"? `G${age_group}`: age_group}</span></h3>
                    <p id="club">{club.club_name}</p>
                </div>
                <div id="team">
                    <div id="coachesContainer">
                        <span className="subheader">Coach(es):</span> 
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Photo</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Phone #</th>
                                </tr>
                            </thead>

                            <tbody>
                                {coaches.map(coach => {
                                    return (
                                        <tr key={coach.id}>
                                            <td>{coach.headshot_img_url? <img src={coach.headshot_img_url} alt={`${coach.coach_name} Headshot`} style={{width: "55px", height: "60px", borderRadius: "5px"}}/>: <Avatar shape="square" size={50} icon={<UserOutlined />} />}</td>
                                            <td>{coach.coach_name}</td>
                                            <td>{coach.email}</td>
                                            <td>{coach.phone_number}</td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>       
                    </div>
                    {players.length === 0 ? (
                        <div id="playersContainer">
                            <span className="subheader">Players:</span>
                                <p className="no-upcoming">No Players Yet...</p>
                        </div>
                    ) : (
                        <div id="playersContainer">
                            <span className="subheader">Players:</span> 
                            <table className="table">
                                <thead >
                                    <tr>
                                        <th>#</th>
                                        <th>Photo</th>
                                        <th>Player Name</th>
                                        <th>Player Birthday</th>
                                        <th>Parent Name</th>
                                        <th>Parent Email</th>
                                        <th>Parent Phone #</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {players.map(player => {
                                        const birthday = dayjs(player.birthday)
                                        const formattedDate  = birthday.format("MM/DD/YYYY")

                                        return (
                                            <tr key={player.id} >
                                                <td>{player.jersey_num === 0 || player.jersey_num? player.jersey_num : "N/A"}</td>
                                                <td>{player.headshot_img_url? <img src={player.headshot_img_url} alt={`${player.player_name} Headshot`} style={{width: "55px", height: "60px", borderRadius: "5px"}}/>: <Avatar shape="square" size={50} icon={<UserOutlined />} />}</td>
                                                <td>{player.player_name}</td>
                                                <td>{formattedDate}</td>
                                                <td>{player.parent_name}</td>
                                                <td>{player.parent_email}</td>
                                                <td>{player.parent_phone_number}</td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        )
    }

}

export default PlayerTeamList