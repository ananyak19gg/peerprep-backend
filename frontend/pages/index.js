import { useEffect, useState } from "react";

const API = "https://campusconnect-backend.up.railway.app";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const fetchPosts = async () => {
    const res = await fetch(`${API}/api/posts?communityId=general`);
    const data = await res.json();
    if (data.success) setPosts(data.posts);
  };

  const createPost = async () => {
    await fetch(`${API}/api/posts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        communityId: "general",
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
    <div style={{ padding: 40 }}>
      <h1>CampusConnect</h1>

      <input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <button onClick={createPost}>Post</button>

      <hr />

      {posts.map((p) => (
        <div key={p.id}>
          <h3>{p.title}</h3>
          <p>{p.description}</p>
        </div>
      ))}
    </div>
  );
}