import { useParams, useNavigate, Link } from "react-router";
import { useState, useEffect } from "react";
import api_link from "../api_link";
import refresh from "../refresh";
import { toast } from "sonner";
import Navbar from "./Navbar";

function TeamPost({ user }) {
    const navigate = useNavigate();
    const { team_id, post_id } = useParams();
    const [post, setPost] = useState();

    const loadPosts = async () => {
        const response = await fetch(api_link + "/api/get-post", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ team_id, post_id }),
        });
        if (response.status == 401) {
            await refresh();
            const new_response = await fetch(api_link + "/api/get-post", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ team_id, post_id }),
            });
            if (new_response.status != 200) {
                return;
            }
            const { message: new_message, post: new_post } =
                await new_response.json();
            setPost(new_post);
            return;
        } else if (response.status != 200) {
            return;
        }
        const { message, post: real_post } = await response.json();
        setPost(real_post);
    };
    useEffect(() => {
        loadPosts();
    }, []);

    return (
        <div>
            <Navbar user={user} />
            <Link to={"/team/" + team_id}>Go back to Team page</Link>
            <br />
            Post Subject: {post?.post_subject}
            <br />
            Post Body: {post?.post_body}
            <br />
            Post Creator: {post?.users.username}
            <br />
        </div>
    );
}

export default TeamPost;
