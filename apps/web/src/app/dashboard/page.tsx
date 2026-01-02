"use client";

import { useEffect, useState } from "react";
import { Activity, Plus, FileText, BarChart3, Loader2, ArrowLeft, Trash2 } from "lucide-react";
import Link from "next/link";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
    const { user, loading: authLoading, signOut } = useAuth();
    const router = useRouter();

    const [forms, setForms] = useState<any[]>([]);
    const [selectedFormId, setSelectedFormId] = useState<string | null>(null);
    const [responses, setResponses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingResponses, setLoadingResponses] = useState(false);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/login");
            return;
        }

        if (user) {
            fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/v1/forms/`)
                .then((res) => res.json())
                .then((data) => {
                    setForms(data);
                    setLoading(false);
                })
                .catch((err) => {
                    console.error("Failed to load forms", err);
                    setLoading(false);
                });
        }
    }, [user, authLoading, router]);

    const handleSelectForm = async (id: string) => {
        setSelectedFormId(id);
        setLoadingResponses(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/v1/forms/${id}/responses`);
            const data = await res.json();
            setResponses(data);
        } catch (err) {
            console.error("Failed to load responses", err);
        } finally {
            setLoadingResponses(false);
        }
    };

    const handleDeleteForm = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (!confirm("Are you sure you want to delete this form? This cannot be undone.")) return;

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/v1/forms/${id}`, {
                method: "DELETE",
            });

            if (res.ok) {
                setForms(forms.filter(f => f.id !== id));
                if (selectedFormId === id) {
                    setSelectedFormId(null);
                    setResponses([]);
                }
            } else {
                alert("Failed to delete form");
            }
        } catch (err) {
            console.error("Delete failed", err);
        }
    };

    if (authLoading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;

    const selectedForm = forms.find((f) => f.id === selectedFormId);

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 font-sans">
            <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Activity className="w-6 h-6 text-indigo-500" />
                    <h1 className="text-xl font-bold tracking-tight">Dashboard</h1>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-zinc-500 hidden md:block">{user?.email}</span>
                    <button onClick={signOut} className="text-sm font-medium text-red-500 hover:text-red-700">Logout</button>
                    <Link
                        href="/"
                        className="flex items-center gap-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                    >
                        <ArrowLeft className="w-4 h-4" /> Back to Generator
                    </Link>
                </div>
            </header>

            <main className="p-8 max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-3 gap-8">

                {/* Sidebar: Form List */}
                <div className="md:col-span-1 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="font-semibold text-lg">Your Forms</h2>
                        <Link href="/" className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                            <Plus className="w-4 h-4" />
                        </Link>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-8"><Loader2 className="animate-spin text-zinc-400" /></div>
                    ) : forms.length === 0 ? (
                        <div className="text-center py-8 text-zinc-500 border border-dashed border-zinc-300 rounded-lg">
                            No forms yet.
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {forms.map((form) => (
                                <div
                                    key={form.id}
                                    onClick={() => handleSelectForm(form.id)}
                                    className={`group w-full text-left p-4 rounded-xl border transition-all cursor-pointer relative hover:shadow-sm ${selectedFormId === form.id ? 'bg-white dark:bg-zinc-900 border-indigo-500 ring-1 ring-indigo-500' : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'}`}
                                >
                                    <div className="pr-8">
                                        <h3 className="font-medium truncate">{form.title}</h3>
                                        <p className="text-xs text-zinc-500 mt-1 truncate">{form.description}</p>
                                    </div>
                                    <div className="flex items-center gap-2 mt-3 text-xs text-zinc-400">
                                        <FileText className="w-3 h-3" />
                                        <span>{new Date(form.created_at).toLocaleDateString()}</span>
                                    </div>

                                    <button
                                        onClick={(e) => handleDeleteForm(e, form.id)}
                                        className="absolute top-4 right-4 p-1.5 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md opacity-0 group-hover:opacity-100 transition-all"
                                        title="Delete form"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Maintain Content: Responses */}
                <div className="md:col-span-2">
                    {!selectedFormId ? (
                        <div className="h-full flex flex-col items-center justify-center text-zinc-400 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl min-h-[400px]">
                            <BarChart3 className="w-12 h-12 mb-4 opacity-50" />
                            <p>Select a form to view responses</p>
                        </div>
                    ) : (
                        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm min-h-[500px]">
                            <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center">
                                <div>
                                    <h2 className="text-xl font-bold">{selectedForm?.title}</h2>
                                    <p className="text-sm text-zinc-500">Responses</p>
                                </div>
                                <a
                                    href={`/public/${selectedFormId}`}
                                    target="_blank"
                                    className="text-xs bg-zinc-100 hover:bg-zinc-200 px-3 py-2 rounded-lg text-zinc-600 font-medium"
                                >
                                    View Live Form
                                </a>
                            </div>

                            <div className="p-0">
                                {loadingResponses ? (
                                    <div className="flex justify-center py-12"><Loader2 className="animate-spin text-zinc-400" /></div>
                                ) : responses.length === 0 ? (
                                    <div className="p-12 text-center text-zinc-500">
                                        No responses yet.
                                    </div>
                                ) : (
                                    <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
                                        {responses.map((res) => (
                                            <div key={res.id} className="p-6 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-colors">
                                                <div className="flex items-center gap-2 mb-3 text-xs font-medium text-zinc-400">
                                                    <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                                                    {new Date(res.created_at).toLocaleString()}
                                                </div>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    {Object.entries(res.response_data).map(([key, value]) => (
                                                        <div key={key} className="bg-zinc-50 dark:bg-zinc-950/50 rounded-lg p-3 border border-zinc-100 dark:border-zinc-800">
                                                            <div className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1">{key.replace(/_/g, " ")}</div>
                                                            <div className="text-sm text-zinc-900 dark:text-zinc-200 break-words">
                                                                {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

            </main>
        </div>
    );
}
