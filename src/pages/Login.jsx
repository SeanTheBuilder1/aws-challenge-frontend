import { useState } from "react";
import api_link from "../api_link";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import Navbar from "./Navbar";

function Login({ user }) {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        const response = await fetch(api_link + "/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: email,
                password: password,
            }),
            credentials: "include",
        });
        if (response.ok) {
            navigate("/teams");
            location.reload();
        } else {
            const { message } = await response.json();
            toast.error(message);
        }
    };

    return (
        <div>
            <Navbar user={user} />
            <h1>Login</h1>
            <form onSubmit={handleLogin}>
                <input
                    name="Email"
                    type={"email"}
                    value={email}
                    required
                    placeholder="Email"
                    onChange={(event) => setEmail(event.target.value)}
                />
                <input
                    name="Password"
                    type={"password"}
                    value={password}
                    required
                    placeholder="Password"
                    onChange={(event) => setPassword(event.target.value)}
                />
                <button type="submit">Login</button>
            </form>
        </div>
    );
}

export default Login;
