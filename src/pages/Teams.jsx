import { useEffect, useState } from "react";
import api_link from "../api_link";
import refresh from "../refresh";
import { useNavigate } from "react-router";
import Navbar from "./Navbar";

function Teams({ user }) {
    const navigate = useNavigate();
    const [teams, setTeams] = useState();
    useEffect(() => {
        (async () => {
            const response = await fetch(api_link + "/api/list-teams", {
                method: "GET",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
            });
            if (response.status == 401) {
                await refresh();
                const new_response = await fetch(api_link + "/api/list-teams", {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                });
                if (new_response.status != 200) {
                    return;
                }
                const { message: new_message, teams: new_teams } =
                    await new_response.json();
                setTeams(new_teams);
                return;
            } else if (response.status != 200) {
                return;
            }
            const { message, teams: real_teams } = await response.json();
            setTeams(real_teams);
        })();
    }, []);
    const handleGotoTeam = (team_id) => {
        (async () => {
            const response = await fetch(api_link + "/api/team-details", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    team_id,
                }),
            });
            if (response.status == 401) {
                await refresh();
                const new_response = await fetch(api_link + "/api/team-details", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({
                        team_id,
                    }),
                });
                if (new_response.status != 200) {
                    if (
                        !confirm("You are not a member of the team, do you want to join?")
                    )
                        return;

                    return;
                }
                const { message: new_message, teams: new_teams } =
                    await new_response.json();
                navigate("/team/" + team_id);
                return;
            } else if (response.status != 200) {
                if (!confirm("You are not a member of the team, do you want to join?"))
                    return;
                return;
            }
            navigate("/team/" + team_id);
        })();
    };

    return (
        <>
            <Navbar user={user} />
            {teams?.map((a) => {
                return (
                    <div key={a.team_id}>
                        <span
                            style={{
                                color: "blue",
                                textDecoration: "underline",
                                cursor: "pointer",
                            }}
                            onClick={() => handleGotoTeam(a.team_id)}
                        >
                            Team Name: {a.name}
                        </span>
                        <br />
                        Team Description: {a.description}
                        <br />
                        Team Creator: {a.creator_name.username}
                        <br />
                        <br />
                    </div>
                );
            })}
        </>
    );
}

export default Teams;
