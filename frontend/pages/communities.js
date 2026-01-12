import { useRouter } from "next/router";

const communities = [
    { id: "coding", name: "Coding" },
    { id: "chess", name: "Chess" },
    { id: "basketball", name: "Basketball" },
];

export default function Communities() {
    const router = useRouter();

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Communities</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {communities.map((c) => (
                    <div
                        key={c.id}
                        onClick={() => router.push(`/communities/${c.id}`)}
                        className="border p-4 rounded cursor-pointer hover:bg-gray-100"
                    >
                        <h2 className="text-lg font-semibold">{c.name}</h2>
                        <p className="text-sm text-gray-500">
                            Join discussions, events & skill sharing
                        </p>
                    </div>
                ))}
            </div>

            <button
                onClick={() => router.push("/lounge")}
                className="mt-6 underline text-blue-600"
            >
                Go to Global Lounge
            </button>
        </div>
    );
}