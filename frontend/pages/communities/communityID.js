import { useRouter } from "next/router";
import { useState } from "react";

const TABS = ["skill", "events", "discussion"];

export default function CommunityPage() {
    const router = useRouter();
    const { communityId } = router.query;
    const [activeTab, setActiveTab] = useState("skill");

    if (!communityId) return null;

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold capitalize">
                    {communityId.replace("-", " ")} Community
                </h1>

                <button
                    onClick={() => router.push("/communities")}
                    className="text-blue-600 underline"
                >
                    ← Back to Communities
                </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 mb-6">
                {TABS.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 rounded ${activeTab === tab
                                ? "bg-blue-600 text-white"
                                : "bg-white border"
                            }`}
                    >
                        {tab === "skill" && "Skill Share"}
                        {tab === "events" && "Events"}
                        {tab === "discussion" && "Discussions"}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="bg-white p-4 rounded shadow">
                {activeTab === "skill" && (
                    <p>Skill sharing posts will appear here.</p>
                )}

                {activeTab === "events" && (
                    <p>Community events will appear here.</p>
                )}

                {activeTab === "discussion" && (
                    <p>Community discussions will appear here.</p>
                )}
            </div>
        </div>
    );
}