import { useEffect, useState } from "react";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [anonymous, setAnonymous] = useState(true);
  const [posting, setPosting] = useState(false);

  const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL;

  if (!BACKEND) {
    console.error("BACKEND URL NOT DEFINED");
  }

  const fetchPosts = async () => {
    try {
      const res = await fetch(`${BACKEND}/api/posts?communityId=general`);
      const data = await res.json();
      if (data.success) setPosts(data.posts || []);
    } catch (err) {
      console.error("Fetch failed", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const createPost = async () => {
    if (!title || !description) {
      alert("Fill all fields");
      return;
    }

    try {
      setPosting(true);

      const res = await fetch(`${BACKEND}/api/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          communityId: "general",
          type: "text",
          anonymous
        })
      });

      const data = await res.json();

      if (data.success) {
        setTitle("");
        setDescription("");
        fetchPosts(); // refresh feed
      }
    } catch (err) {
      console.error("Create post failed:", err);
      alert("Backend not reachable");
    } finally {
      setPosting(false);
    }
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>CampusConnect</h1>

      <a href="/lounge">Go to Global Lounge 🌍</a>

      {/* CREATE POST */}
      <div style={{ border: "1px solid #ccc", padding: "1rem", marginTop: "1rem" }}>
        <h3>Create Post</h3>

        <input
          id="title"
          name="title"
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          style={{ width: "100%", marginBottom: "0.5rem" }}
        />

        <textarea
          id="description"
          name="description"
          placeholder="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          style={{ width: "100%", marginBottom: "0.5rem" }}
        />

        <label style={{ display: "block", marginBottom: "0.5rem" }}>
          <input
            type="checkbox"
            checked={anonymous}
            onChange={() => setAnonymous(!anonymous)}
          />{" "}
          Post Anonymously
        </label>

        <button onClick={createPost} disabled={posting}>
          {posting ? "Posting..." : "Post"}
        </button>
      </div>

      {/* POSTS */}
      {loading && <p>Loading posts...</p>}

      {!loading && posts.length === 0 && <p>No posts yet 🚀</p>}

      {posts.map(post => (
        <div
          key={post.id}
          style={{
            border: "1px solid #ddd",
            padding: "1rem",
            marginTop: "1rem"
          }}
        >
          <h4>{post.title}</h4>
          <p>{post.description}</p>
          <small>
            {post.anonymous ? "Anonymous 🕶️" : "User"}
          </small>
        </div>
      ))}
    </div>
  );
}
