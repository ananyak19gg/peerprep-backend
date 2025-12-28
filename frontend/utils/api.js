const API_BASE_URL =
    "https://campusconnect-production-9235.up.railway.app";

export const postLoungeMessage = async (text) => {
    return fetch(`${API_BASE_URL}/api/lounge/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
    });
};

export const getLoungeMessages = async () => {
    const res = await fetch(`${API_BASE_URL}/api/lounge/messages`);
    return res.json();
};

export const getTLDR = async (text) => {
    const res = await fetch(
        `${API_BASE_URL}/api/lounge/tldr?text=${encodeURIComponent(text)}`
    );
    return res.json();
};