import api_link from "./api_link";

export default async function refresh() {
    const res = await fetch(api_link + "/api/refresh", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
    });
}
