import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const API = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function Lounge() {
    const [posts, setPosts] = useState([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(true);

    const fetchPosts = async () => {
        try {
            const res = await fetch(`${API}/api/posts?communityId=general`);
            const data = await res.json();
            if (data.success) setPosts(data.posts);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const createPost = async () => {
        if (!title || !description) return;

        await fetch(`${API}/api/posts`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                communityId: "general",
                type: "text",
                title,
                description,
            }),
        });

        setTitle("");
        setDescription("");
        fetchPosts();
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    return (
        <div className="min-h-screen bg-bg p-6">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-bold text-primary mb-6">
                    🌍 CampusConnect – Global Lounge
                </h1>

                {/* Create Post */}
                <div className="bg-card shadow-soft rounded-xl p-4 mb-6">
                    <input
                        className="w-full border p-2 rounded mb-2"
                        placeholder="Post title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <textarea
                        className="w-full border p-2 rounded mb-2"
                        placeholder="What's happening on campus?"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <button
                        onClick={createPost}
                        className="bg-primary text-white px-4 py-2 rounded hover:opacity-90"
                    >
                        Post
                    </button>
                </div>

                {/* Feed */}
                {loading && <p>Loading feed…</p>}

                {posts.map((post) => (
                    <div
                        key={post.id}
                        className="bg-card shadow-soft rounded-xl p-4 mb-4"
                    >
                        <h3 className="font-semibold text-lg">{post.title}</h3>
                        <p className="text-muted mt-1">{post.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}