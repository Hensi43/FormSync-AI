"use client";

import { useState } from "react";
import { Eye, Code, Edit } from "lucide-react";
import FormRenderer from "../components/FormRenderer";
import FormBuilder from "../components/FormBuilder";
import { motion } from "framer-motion";

interface FormPreviewProps {
    generatedForm: any;
}

export default function FormPreview({ generatedForm, onUpdate }: { generatedForm: any, onUpdate?: (newSchema: any) => void }) {
    const [viewMode, setViewMode] = useState<"json" | "preview" | "edit">("preview");

    if (!generatedForm) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 border-t border-zinc-200 dark:border-zinc-800 pt-6"
        >
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-zinc-500">Result</h3>
                <div className="flex bg-zinc-100 dark:bg-zinc-800 p-1 rounded-lg">
                    <button
                        onClick={() => setViewMode("preview")}
                        className={`px-3 py-1.5 text-xs font-medium rounded-md flex items-center gap-2 transition-all ${viewMode === "preview" ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-50 shadow-sm" : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"}`}
                    >
                        <Eye className="w-3.5 h-3.5" /> Preview
                    </button>
                    {onUpdate && (
                        <button
                            onClick={() => setViewMode("edit")}
                            className={`px-3 py-1.5 text-xs font-medium rounded-md flex items-center gap-2 transition-all ${viewMode === "edit" ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-50 shadow-sm" : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"}`}
                        >
                            <Edit className="w-3.5 h-3.5" /> Edit
                        </button>
                    )}
                    <button
                        onClick={() => setViewMode("json")}
                        className={`px-3 py-1.5 text-xs font-medium rounded-md flex items-center gap-2 transition-all ${viewMode === "json" ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-50 shadow-sm" : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"}`}
                    >
                        <Code className="w-3.5 h-3.5" /> JSON
                    </button>
                </div>
            </div>

            {generatedForm.error ? (
                <div className="p-4 bg-red-50 text-red-900 border border-red-200 rounded-lg text-sm">
                    <p className="font-semibold">Generation Failed</p>
                    <pre className="mt-2 text-xs opacity-75">{JSON.stringify(generatedForm.details, null, 2)}</pre>
                </div>
            ) : (
                <div className="min-h-[300px]">
                    {viewMode === "preview" ? (
                        <div className="bg-zinc-50 dark:bg-black/50 p-6 rounded-xl border border-zinc-200/50 dark:border-zinc-800/50">
                            <FormRenderer schema={generatedForm} />
                        </div>
                    ) : viewMode === "edit" ? (
                        <div className="bg-zinc-50 dark:bg-black/50 p-6 rounded-xl border border-zinc-200/50 dark:border-zinc-800/50">
                            <FormBuilder schema={generatedForm} onUpdate={(newSchema) => {
                                if (onUpdate) {
                                    onUpdate(newSchema);
                                    setViewMode("preview");
                                }
                            }} />
                        </div>
                    ) : (
                        <pre className="bg-zinc-950 text-zinc-50 p-4 rounded-lg overflow-auto max-h-[500px] text-sm font-mono border border-zinc-800">
                            {JSON.stringify(generatedForm, null, 2)}
                        </pre>
                    )}
                </div>
            )}
        </motion.div>
    );
}
