import { Link, useNavigate } from "react-router";
import api_link from "../api_link";

function Navbar({ user }) {
    const handleLogout = async () => {
        const response = await fetch(api_link + "/api/logout", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
        });
        location.reload();
        navigate("/");
    };
    return (
        <div>
            {user ? (
                <>
                    <Link to="/teams">Teams</Link>{" "}
                    <Link to="/edit-profile">Edit Profile</Link>{" "}
                    <span
                        style={{
                            color: "blue",
                            textDecoration: "underline",
                            cursor: "pointer",
                        }}
                        onClick={() => handleLogout()}
                    >
                        Logout
                    </span>
                </>
            ) : (
                ""
            )}{" "}
            {user ? (
                ""
            ) : (
                <>
                    <Link to="/login">Login</Link> <Link to="/register">Register</Link>
                </>
            )}
        </div>
    );
}

export default Navbar;
