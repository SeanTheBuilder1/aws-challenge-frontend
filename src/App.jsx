"use-client";
import { useState, useEffect } from "react";
import "./App.css";
import {
    BrowserRouter,
    Route,
    Routes,
    useNavigate,
    Navigate,
} from "react-router";
import Redirector from "./pages/Redirector";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Teams from "./pages/Teams";
import TeamDetails from "./pages/TeamDetails";
import TeamTask from "./pages/TeamTask";
import TeamPost from "./pages/TeamPost";
import EditProfile from "./pages/EditProfile";
import { Toaster } from "./Toaster";
import api_link from "./api_link";
import refresh from "./refresh";

import Navbar from "./pages/Navbar";
function App() {
    const [user, setUser] = useState(undefined);
    const checkAuth = async () => {
        const user_info_response = await fetch(api_link + "/api/get-user-info", {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
        });
        if (!user_info_response.ok) {
            setUser(null);
            return;
        }
        const { message: user_info_message, user_info } =
            await user_info_response.json();
        setUser(user_info);
    };
    useEffect(() => {
        (async () => {
            await refresh();
            await checkAuth();
        })();
    }, []);
    if (user === undefined) {
        return <div>Loading</div>;
    }
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Redirector user={user} />} />
                    <Route path="/login" element={<Login user={user} />} />
                    <Route path="/register" element={<Register user={user} />} />
                    <Route
                        path="/teams"
                        element={user ? <Teams user={user} /> : <Navigate to="/login" />}
                    />
                    <Route
                        path="/team/:team_id"
                        element={
                            user ? <TeamDetails user={user} /> : <Navigate to="/login" />
                        }
                    />
                    <Route
                        path="/team/:team_id/task/:task_id"
                        element={user ? <TeamTask user={user} /> : <Navigate to="/login" />}
                    />
                    <Route
                        path="/team/:team_id/post/:post_id"
                        element={user ? <TeamPost user={user} /> : <Navigate to="/login" />}
                    />
                    <Route
                        path="/edit-profile"
                        element={
                            user ? <EditProfile user={user} /> : <Navigate to="/login" />
                        }
                    />
                </Routes>
            </BrowserRouter>
            <Toaster richColors />
        </>
    );
}

export default App;
