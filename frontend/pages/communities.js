import { useRouter } from "next/router";

const communities = [
    { id: "general", name: "🌍 Global Lounge" },
    { id: "coding", name: "💻 Coding Community" },
    { id: "sports", name: "🏀 Sports Club" },
    { id: "hackathons", name: "🚀 Hackathons" },
];

export default function Communities() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <h1 className="text-3xl font-bold text-center mb-8">
                Choose Your Community
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                {communities.map((c) => (
                    <div
                        key={c.id}
                        onClick={() => router.push("/lounge")}
                        className="bg-white p-6 rounded-xl shadow hover:shadow-lg cursor-pointer text-center text-lg font-semibold"
                    >
                        {c.name}
                    </div>
                ))}
            </div>
        </div>
    );
}