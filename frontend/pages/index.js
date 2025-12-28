import { useState } from "react";
import { useRouter } from "next/router";

export default function Login() {
  const [name, setName] = useState("");
  const router = useRouter();

  const handleLogin = () => {
    if (!name) return;
    localStorage.setItem("username", name);
    router.push("/lounge");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg">
      <div className="bg-card p-8 rounded-xl shadow-soft w-full max-w-md">
        <h1 className="text-3xl font-bold text-primary mb-4 text-center">
          🌍 CampusConnect
        </h1>

        <p className="text-muted text-center mb-6">
          Enter Global Campus Lounge
        </p>

        <input
          className="w-full border p-3 rounded mb-4"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full bg-primary text-white py-3 rounded hover:opacity-90"
        >
          Enter Lounge →
        </button>
      </div>
    </div>
  );
}