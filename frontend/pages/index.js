import { useState } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();
  const [email, setEmail] = useState("");

  const handleLogin = () => {
    if (!email) return alert("Enter college email");
    localStorage.setItem("userEmail", email);
    router.push("/communities");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white rounded-2xl shadow-xl p-10 w-full max-w-md text-center">
        <h1 className="text-3xl font-bold text-indigo-600 mb-2">
          🌍 CampusConnect
        </h1>
        <p className="text-gray-500 mb-6">
          Connect with your campus community
        </p>

        <input
          type="email"
          placeholder="Enter college email ID"
          className="w-full border rounded-lg p-3 mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
        >
          Login / Signup →
        </button>

        <p className="text-xs text-gray-400 mt-4">
          No password required · Demo login
        </p>
      </div>
    </div>
  );
}