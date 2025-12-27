import { useEffect, useState } from "react";

export default function Lounge() {
    const [messages, setMessages] = useState([]);
    const [error, setError] = useState(false);

    const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL;

    const fetchMessages = async () => {
        try {
            if (!BACKEND) return;

            const res = await fetch(`${BACKEND}/api/lounge/messages`);
            const data = await res.json();

            if (data.success) {
                setMessages(data.messages || []);
                setError(false);
            } else {
                setError(true);
            }
        } catch (err) {
            console.error("Fetch lounge failed:", err);
            setError(true);
        }
    };

    useEffect(() => {
        fetchMessages();
        const interval = setInterval(fetchMessages, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div style={{ padding: "2rem" }}>
            <h1>🌍 Global Lounge</h1>

            {error && <p style={{ color: "red" }}>Backend not reachable</p>}

            {messages.map(msg => (
                <div key={msg._id} style={{ borderBottom: "1px solid #ddd", padding: "0.5rem" }}>
                    <strong>{msg.anonymous ? "Anonymous" : "User"}:</strong>
                    <p>{msg.text}</p>
                </div>
            ))}
        </div>
    );
}