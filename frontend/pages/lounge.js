import { useEffect, useState } from "react";

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function Lounge() {
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const [loading, setLoading] = useState(true);

    const fetchMessages = async () => {
        try {
            const res = await fetch(`${BACKEND}/api/lounge/messages`);
            const data = await res.json();
            if (data.success) setMessages(data.messages);
            setLoading(false);
        } catch (err) {
            console.error("Fetch lounge failed", err);
        }
    };

    const sendMessage = async () => {
        if (!text.trim()) return;

        await fetch(`${BACKEND}/api/lounge/message`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text }),
        });

        setText("");
        fetchMessages(); // instant refresh
    };

    useEffect(() => {
        fetchMessages();
        const interval = setInterval(fetchMessages, 5000); // ⏱ realtime feel
        return () => clearInterval(interval);
    }, []);

    return (
        <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
            <h1>🌍 Global Lounge</h1>

            <div style={{ border: "1px solid #ccc", padding: "1rem", marginBottom: "1rem" }}>
                <input
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Say something..."
                    style={{ width: "80%" }}
                />
                <button onClick={sendMessage} style={{ marginLeft: "1rem" }}>
                    Send
                </button>
            </div>

            {loading && <p>Loading messages...</p>}

            {messages.map((msg) => (
                <div key={msg.id} style={{ padding: "0.5rem 0" }}>
                    💬 {msg.text}
                </div>
            ))}
        </div>
    );
}