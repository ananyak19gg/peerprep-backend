import { useState } from "react";
import { useRouter } from "next/router";
import { signupWithEmail, loginWithGoogle } from "../firebase/auth";

export default function Signup() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSignup = async () => {
        if (!email.endsWith(".edu")) {
            return alert("Use college email only");
        }
        try {
            await signupWithEmail(email, password);
            router.push("/communities");
        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="p-6 border rounded w-96">
                <h1 className="text-2xl font-bold mb-4">Create Account</h1>

                <input
                    placeholder="College Email"
                    className="w-full border p-2 mb-2"
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    className="w-full border p-2 mb-3"
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button
                    onClick={handleSignup}
                    className="w-full bg-green-600 text-white py-2 rounded"
                >
                    Sign Up
                </button>

                <button
                    onClick={loginWithGoogle}
                    className="w-full border py-2 rounded mt-3"
                >
                    Continue with Google
                </button>
            </div>
        </div>
    );
}