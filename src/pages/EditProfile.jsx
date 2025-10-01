import { useParams, useNavigate, Link } from "react-router";
import { useState, useEffect } from "react";
import api_link from "../api_link";
import refresh from "../refresh";
import { toast } from "sonner";
import Navbar from "./Navbar";

function EditProfile({ user }) {
    const navigate = useNavigate();
    const [username, setUsername] = useState(user.username);
    const handleEditProfile = async (e) => {
        e.preventDefault();

        const response = await fetch(api_link + "/api/edit-profile", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ username }),
        });
        const { message } = await response.json();
        if (response.status == 401) {
            await refresh();
            const new_response = await fetch(api_link + "/api/edit-profile", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ username }),
            });
            const { message: new_message } = await new_response.json();
            if (new_response.status != 200) {
                toast.error(new_message);
                return;
            }
            toast.success(new_message);
            navigate("/teams");
            location.reload();
            return;
        } else if (response.status != 200) {
            toast.error(message);
            return;
        }
        toast.success(message);
        navigate("/teams");
        location.reload();
    };
    return (
        <>
            <Navbar user={user} />
            <h1>Edit Profile</h1>
            <form onSubmit={handleEditProfile}>
                <h2>Username</h2>
                <input
                    name="Username"
                    type={"text"}
                    value={username}
                    required
                    placeholder="Username"
                    onChange={(event) => setUsername(event.target.value)}
                />
                <button type="submit">Edit Profile</button>
            </form>
        </>
    );
}

export default EditProfile;
