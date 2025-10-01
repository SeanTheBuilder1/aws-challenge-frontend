import { useParams, useNavigate, Link } from "react-router";
import { useState, useEffect } from "react";
import api_link from "../api_link";
import refresh from "../refresh";
import { toast } from "sonner";
import Navbar from "./Navbar";

function TeamTask({ user }) {
    const navigate = useNavigate();
    const { team_id, task_id } = useParams();
    const [task, setTask] = useState();
    const [comments, setComments] = useState();
    const [comment, setComment] = useState("");
    const [isCreator, setIsCreator] = useState(false);
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

    const loadTasks = async () => {
        const response = await fetch(api_link + "/api/get-task", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ team_id, task_id }),
        });
        if (response.status == 401) {
            await refresh();
            const new_response = await fetch(api_link + "/api/get-task", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ team_id, task_id }),
            });
            if (new_response.status != 200) {
                return;
            }
            const { message: new_message, task: new_task } =
                await new_response.json();
            setTask(new_task);
            return;
        } else if (response.status != 200) {
            return;
        }
        const { message, task: real_task } = await response.json();
        setTask(real_task);
    };

    const loadComments = async () => {
        const response = await fetch(api_link + "/api/get-task-comments", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ team_id, task_id }),
        });
        if (response.status == 401) {
            await refresh();
            const new_response = await fetch(api_link + "/api/get-task-comments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ team_id, task_id }),
            });
            if (new_response.status != 200) {
                return;
            }
            const { message: new_message, comments: new_comments } =
                await new_response.json();
            setComments(new_comments);
            return;
        } else if (response.status != 200) {
            return;
        }
        const { message, comments: real_comments } = await response.json();
        setComments(real_comments);
    };
    const loadIsCreator = async () => {
        const response = await fetch(api_link + "/api/is-task-creator", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ team_id, task_id }),
        });
        if (response.status == 401) {
            await refresh();
            const new_response = await fetch(api_link + "/api/is-task-creator", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ team_id, task_id }),
            });
            if (new_response.status != 200) {
                return;
            }
            const { message: new_message, is_creator: new_is_creator } =
                await new_response.json();
            setIsCreator(new_is_creator);
            return;
        } else if (response.status != 200) {
            return;
        }
        const { message, is_creator } = await response.json();
        setIsCreator(is_creator);
    };

    const handleAddComment = async (e) => {
        e.preventDefault();

        const response = await fetch(api_link + "/api/comment-team-task", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ team_id, task_id, comment }),
        });
        const { message } = await response.json();
        if (response.status == 401) {
            await refresh();
            const new_response = await fetch(api_link + "/api/comment-team-task", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ team_id, task_id, comment }),
            });
            const { message: new_message } = await new_response.json();
            if (new_response.status != 200) {
                toast.error(new_message);
                return;
            }
            loadComments();
            toast.success(new_message);
            return;
        } else if (response.status != 200) {
            toast.error(message);
            return;
        }
        loadComments();
        toast.success(message);
    };

    const handleDeleteTask = async (task_id) => {
        if (!confirm("Are you sure about deleting the task?")) {
            return;
        }

        const response = await fetch(api_link + "/api/delete-task", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ team_id, task_id }),
        });
        const { message } = await response.json();
        if (response.status == 401) {
            await refresh();
            const new_response = await fetch(api_link + "/api/delete-task", {
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
            toast.success(new_message);
            navigate("/team/" + team_id);
            return;
        } else if (response.status != 200) {
            toast.error(message);
            return;
        }
        toast.success(message);
        navigate("/team/" + team_id);
    };
    useEffect(() => {
        loadTasks();
        loadComments();
        loadIsCreator();
    }, []);

    return (
        <div>
            <Navbar user={user} />
            <Link to={"/team/" + team_id}>Go back to Team page</Link>
            <br />
            Task Subject: {task?.task_subject}
            <br />
            Task Body: {task?.task_body}
            <br />
            Task Creator: {task?.users.username}
            <br />
            <span
                style={{
                    color: "blue",
                    textDecoration: "underline",
                    cursor: "pointer",
                }}
                onClick={() => handleCompleteTask(task?.task_id)}
            >
                Complete Task
            </span>
            <br />
            {isCreator ? (
                <>
                    <span
                        style={{
                            color: "blue",
                            textDecoration: "underline",
                            cursor: "pointer",
                        }}
                        onClick={() => handleDeleteTask(task?.task_id)}
                    >
                        Delete Task
                    </span>
                    <br />
                </>
            ) : (
                ""
            )}
            <h1>Comments</h1>
            {comments?.map((c) => {
                return (
                    <div key={c.comment_id}>
                        Comment Poster: {c.users.username}
                        <br />
                        Comment: {c.comment}
                        <br />
                        Date: {new Date(c.created_at).toLocaleString("en-US")}
                        <br />
                        <br />
                    </div>
                );
            })}
            <form onSubmit={handleAddComment}>
                <input
                    name="Comment"
                    type={"text"}
                    value={comment}
                    required
                    placeholder="Comment"
                    onChange={(event) => setComment(event.target.value)}
                />
                <button type="submit">Post Comment</button>
            </form>
        </div>
    );
}

export default TeamTask;
