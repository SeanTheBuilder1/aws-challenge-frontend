import { useState } from "react";
import api_link from "../api_link";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import Navbar from "./Navbar";

function Register({ user }) {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleRegister = async (e) => {
        e.preventDefault();
        const response = await fetch(api_link + "/api/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: email,
                username: username,
                password: password,
            }),
            credentials: "include",
        });
        if (response.ok) {
            navigate("/login");
        } else {
            const { message } = await response.json();
            toast.error(message);
        }
    };

    return (
        <div>
            <Navbar user={user} />
            <h1>Register</h1>
            <form onSubmit={handleRegister}>
                <input
                    name="Email"
                    type={"email"}
                    value={email}
                    required
                    placeholder="Email"
                    onChange={(event) => setEmail(event.target.value)}
                />
                <input
                    name="Username"
                    type={"name"}
                    value={username}
                    required
                    placeholder="Username"
                    onChange={(event) => setUsername(event.target.value)}
                />
                <input
                    name="Password"
                    type={"password"}
                    value={password}
                    required
                    placeholder="Password"
                    onChange={(event) => setPassword(event.target.value)}
                />
                <button type="submit">Register</button>
            </form>
        </div>
    );
}

export default Register;
