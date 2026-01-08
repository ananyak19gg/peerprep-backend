import { useState } from "react";
import { useRouter } from "next/router";
import { loginWithEmail, loginWithGoogle } from "../firebase/auth";

export default function Login() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        if (!email.endsWith(".edu")) {
            return alert("Use college email only");
        }
        try {
            await loginWithEmail(email, password);
            router.push("/communities");
        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100">
            <div className="bg-white p-8 rounded-xl shadow-lg w-96">
                <h1 className="text-3xl font-bold text-center mb-1">
                    🎓 CampusConnect
                </h1>
                <p className="text-center text-gray-500 mb-6">
                    Login with your college account
                </p>

                <input
                    placeholder="College Email"
                    className="w-full border p-2 rounded mb-3"
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Password"
                    className="w-full border p-2 rounded mb-4"
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button
                    onClick={handleLogin}
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                    Login
                </button>

                <button
                    onClick={loginWithGoogle}
                    className="w-full border py-2 rounded mt-3 hover:bg-gray-50"
                >
                    Continue with Google
                </button>

                <p className="mt-4 text-sm text-center">
                    New user?{" "}
                    <span
                        className="text-blue-600 cursor-pointer"
                        onClick={() => router.push("/signup")}
                    >
                        Register here
                    </span>
                </p>
            </div>
        </div>
    );
}