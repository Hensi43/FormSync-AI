"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import FormRenderer from "../../../components/FormRenderer";
import { Loader2 } from "lucide-react";

export default function PublicFormPage() {
    const params = useParams();
    const id = params?.id as string;

    const [form, setForm] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        if (!id) return;
        const fetchForm = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/v1/forms/${id}`);
                if (!res.ok) throw new Error("Form not found");
                const data = await res.json();
                setForm(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchForm();
    }, [id]);

    const handleSubmit = async (data: any) => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/v1/forms/${id}/submit`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ data }),
            });
            if (!res.ok) throw new Error("Failed to submit");
            setSubmitted(true);
        } catch (err) {
            alert("Error submitting form");
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-zinc-50 dark:bg-zinc-950">
                <Loader2 className="w-8 h-8 animate-spin text-zinc-400" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-zinc-50 dark:bg-zinc-950">
                <div className="bg-white dark:bg-zinc-900 p-8 rounded-xl border border-zinc-200 dark:border-zinc-800 text-center">
                    <h1 className="text-xl font-bold text-red-500 mb-2">Error</h1>
                    <p className="text-zinc-500">{error}</p>
                </div>
            </div>
        );
    }

    if (submitted) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-zinc-50 dark:bg-zinc-950">
                <div className="bg-white dark:bg-zinc-900 p-8 rounded-xl border border-zinc-200 dark:border-zinc-800 text-center max-w-md shadow-sm">
                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold mb-2">Thank You!</h1>
                    <p className="text-zinc-500">Your response has been recorded successfully.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-12 px-4">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800 overflow-hidden">
                    <div className="border-b border-zinc-200 dark:border-zinc-800 p-6 bg-zinc-50/50 dark:bg-zinc-900/50">
                        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">{form.title}</h1>
                        {form.description && <p className="text-zinc-500 dark:text-zinc-400">{form.description}</p>}
                    </div>
                    <div className="p-8">
                        <FormRenderer schema={form.schema} onSubmit={handleSubmit} />
                    </div>
                </div>
                <div className="mt-8 text-center text-sm text-zinc-400">
                    Powered by <strong>FormSync AI</strong>
                </div>
            </div>
        </div>
    );
}
