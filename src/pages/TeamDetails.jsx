import { useParams, useNavigate, Link } from "react-router";
import { useState, useEffect } from "react";
import api_link from "../api_link";
import refresh from "../refresh";
import { toast } from "sonner";
import Navbar from "./Navbar";

function TeamDetails({ user }) {
    const navigate = useNavigate();
    const { team_id } = useParams();
    const [posts, setPosts] = useState();
    const [tasks, setTasks] = useState();

    const [post_subject, setPostSubject] = useState();
    const [post_body, setPostBody] = useState();
    const [task_subject, setTaskSubject] = useState();
    const [task_body, setTaskBody] = useState();

    const loadPosts = async () => {
        const response = await fetch(api_link + "/api/get-team-posts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ team_id }),
        });
        if (response.status == 401) {
            await refresh();
            const new_response = await fetch(api_link + "/api/get-team-posts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ team_id }),
            });
            if (new_response.status != 200) {
                return;
            }
            const { message: new_message, posts: new_posts } =
                await new_response.json();
            setPosts(new_posts);
            return;
        } else if (response.status != 200) {
            return;
        }
        const { message, posts: real_posts } = await response.json();
        setPosts(real_posts);
    };
    const loadTasks = async () => {
        const response = await fetch(api_link + "/api/get-team-tasks", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ team_id }),
        });
        if (response.status == 401) {
            await refresh();
            const new_response = await fetch(api_link + "/api/get-team-tasks", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ team_id }),
            });
            if (new_response.status != 200) {
                return;
            }
            const { message: new_message, tasks: new_tasks } =
                await new_response.json();
            setTasks(new_tasks);
            return;
        } else if (response.status != 200) {
            return;
        }
        const { message, tasks: real_tasks } = await response.json();
        setTasks(real_tasks);
    };

    useEffect(() => {
        loadPosts();
        loadTasks();
    }, []);
    const handleGotoPost = (task_id) => {
        (async () => {
            navigate("/team/" + team_id + "/post/" + task_id);
        })();
    };
    const handleGotoTask = (task_id) => {
        (async () => {
            navigate("/team/" + team_id + "/task/" + task_id);
        })();
    };

    const handleCompleteTask = async (task_id) => {
        const response = await fetch(api_link + "/api/complete-team-task", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ team_id, task_id }),
        });
        const { message } = await response.json();
        if (response.status == 401) {
            await refresh();
            const new_response = await fetch(api_link + "/api/complete-team-task", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ team_id, task_id }),
            });
            const { message: new_message } = await new_response.json();
            if (new_response.status != 200) {
                toast.error(new_message);
                return;
            }
            loadTasks();
            toast.success(new_message);
            return;
        } else if (response.status != 200) {
            toast.error(message);
            return;
        }
        loadTasks();
        toast.success(message);
    };
    const handleAddPost = async (e) => {
        e.preventDefault();
        const response = await fetch(api_link + "/api/post-team", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ team_id, post_subject, post_body }),
        });
        const { message } = await response.json();
        if (response.status == 401) {
            await refresh();
            const new_response = await fetch(api_link + "/api/post-team", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ team_id, post_subject, post_body }),
            });
            const { message: new_message } = await new_response.json();
            if (new_response.status != 200) {
                toast.error(new_message);
                return;
            }
            loadPosts();
            toast.success(new_message);
            return;
        } else if (response.status != 200) {
            toast.error(message);
            return;
        }
        loadPosts();
        toast.success(message);
    };
    const handleAddTask = async (e) => {
        e.preventDefault();

        const response = await fetch(api_link + "/api/post-team-task", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ team_id, task_subject, task_body }),
        });
        const { message } = await response.json();
        if (response.status == 401) {
            await refresh();
            const new_response = await fetch(api_link + "/api/post-team-task", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ team_id, task_subject, task_body }),
            });
            const { message: new_message } = await new_response.json();
            if (new_response.status != 200) {
                toast.error(new_message);
                return;
            }
            loadTasks();
            toast.success(new_message);
            return;
        } else if (response.status != 200) {
            toast.error(message);
            return;
        }
        loadTasks();
        toast.success(message);
    };

    return (
        <>
            <Navbar user={user} />
            <Link to={"/teams"}>Go back to Teams List page</Link>
            <h1>Tasks</h1>
            {tasks?.map((a) => {
                return (
                    <div>
                        <span
                            style={{
                                color: "blue",
                                textDecoration: "underline",
                                cursor: "pointer",
                            }}
                            onClick={() => handleGotoTask(a.task_id)}
                        >
                            Task Subject: {a.task_subject}
                        </span>
                        <br />
                        Task Body: {a.task_body}
                        <br />
                        Task Creator: {a.users.username}
                        <br />
                        Task Completed: {a.completed ? "Yes" : "No"}
                        <br />
                        <span
                            style={{
                                color: "blue",
                                textDecoration: "underline",
                                cursor: "pointer",
                            }}
                            onClick={() => handleCompleteTask(a.task_id)}
                        >
                            Complete Task
                        </span>
                        <br />
                        <br />
                    </div>
                );
            })}

            <h1>Posts</h1>
            {posts?.map((a) => {
                return (
                    <div>
                        <span
                            style={{
                                color: "blue",
                                textDecoration: "underline",
                                cursor: "pointer",
                            }}
                            onClick={() => handleGotoPost(a.post_id)}
                        >
                            Post Subject: {a.post_subject}
                        </span>
                        <br />
                        Post Body: {a.post_body}
                        <br />
                        Post Creator: {a.users.username}
                        <br />
                        <br />
                    </div>
                );
            })}
            <h1>Create Post</h1>

            <form onSubmit={handleAddPost}>
                <input
                    name="Post Subject"
                    type={"text"}
                    value={post_subject}
                    required
                    placeholder="Subject"
                    onChange={(event) => setPostSubject(event.target.value)}
                />
                <input
                    name="Post Body"
                    type={"text"}
                    value={post_body}
                    required
                    placeholder="Body"
                    onChange={(event) => setPostBody(event.target.value)}
                />
                <button type="submit">Login</button>
            </form>
            <h1>Create Task</h1>
            <form onSubmit={handleAddTask}>
                <input
                    name="Task Subject"
                    type={"text"}
                    value={task_subject}
                    required
                    placeholder="Subject"
                    onChange={(event) => setTaskSubject(event.target.value)}
                />
                <input
                    name="Task Body"
                    type={"text"}
                    value={task_body}
                    required
                    placeholder="Body"
                    onChange={(event) => setTaskBody(event.target.value)}
                />
                <button type="submit">Login</button>
            </form>
        </>
    );
}

export default TeamDetails;
