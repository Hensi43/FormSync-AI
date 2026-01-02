"use client";

import { Server, CheckCircle2, AlertCircle } from "lucide-react";
import { ApiStatus } from "../hooks/useFormGenerator";
import { cn } from "@/lib/utils"; // Assuming utils exists, if not I will create it or use inline

export default function StatusCard({ status, data }: { status: ApiStatus, data: any }) {
    return (
        <section className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm">
            <h2 className="text-2xl font-semibold mb-2">System Status</h2>
            <div className="flex items-center justify-between mb-6">
                <p className="text-zinc-500 dark:text-zinc-400">
                    Checking connectivity between Next.js (Web) and FastAPI (API).
                </p>
                <div className={cn(
                    "text-xs px-2 py-1 rounded-full border",
                    status === 'connected' ? 'bg-green-100 border-green-200 text-green-700' : 'bg-red-100 border-red-200 text-red-700'
                )}>
                    {status === 'connected' ? 'System Online' : 'System Offline'}
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <div className={cn(
                    "p-4 rounded-lg border flex items-start gap-4 transition-colors",
                    status === "connected"
                        ? "bg-green-50/50 border-green-200 dark:bg-green-900/10 dark:border-green-800"
                        : status === "error"
                            ? "bg-red-50/50 border-red-200 dark:bg-red-900/10 dark:border-red-800"
                            : "bg-zinc-50 border-zinc-200 dark:bg-zinc-800/50 dark:border-zinc-700"
                )}>
                    <div className={cn(
                        "p-2 rounded-full",
                        status === "connected" ? "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400" :
                            status === "error" ? "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400" :
                                "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                    )}>
                        <Server className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-sm mb-1">Backend API</h3>
                        {status === "loading" && <p className="text-sm text-zinc-500">Connecting...</p>}
                        {status === "connected" && (
                            <div className="space-y-1">
                                <div className="flex items-center gap-2 text-sm text-green-700 dark:text-green-400 font-medium">
                                    <CheckCircle2 className="w-4 h-4" /> Connected
                                </div>
                            </div>
                        )}
                        {status === "error" && (
                            <div className="space-y-1">
                                <div className="flex items-center gap-2 text-sm text-red-700 dark:text-red-400 font-medium">
                                    <AlertCircle className="w-4 h-4" /> Connection Failed
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
