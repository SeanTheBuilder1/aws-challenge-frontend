import { useEffect } from "react";
import { useNavigate } from "react-router";
import api_link from "../api_link";

function Redirector() {
    const navigate = useNavigate();
    useEffect(() => {
        const checkAuth = async () => {
            (async () => {
                const user_info_response = await fetch(
                    api_link + "/api/get-user-info",
                    {
                        method: "GET",
                        headers: { "Content-Type": "application/json" },
                        credentials: "include",
                    },
                );
                if (user_info_response.status != 200) {
                    navigate("/login");
                    return;
                }
                const { message: user_info_message, user_info } =
                    await user_info_response.json();
                navigate("/teams");
            })();
        };
        checkAuth();
    }, []);
    return <div>hello</div>;
}

export default Redirector;
