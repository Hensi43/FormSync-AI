"use client";

import { FileText, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

interface GeneratorInputProps {
    prompt: string;
    setPrompt: (val: string) => void;
    isGenerating: boolean;
    onGenerate: () => void;
    isGoogleAuth: boolean;
    isGoogleChecked: boolean;
    setIsGoogleChecked: (val: boolean) => void;
    onConnectGoogle: () => void;
    googleFormUrl: string | null;
    googleEditUrl?: string | null;
}

export default function GeneratorInput({
    prompt, setPrompt, isGenerating, onGenerate,
    isGoogleAuth, isGoogleChecked, setIsGoogleChecked, onConnectGoogle, googleFormUrl, googleEditUrl
}: GeneratorInputProps) {
    return (
        <section className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm">
            <h2 className="text-2xl font-semibold mb-2">Test AI Generation</h2>
            <p className="text-zinc-500 dark:text-zinc-400 mb-6">
                Enter a description to test the Gemini integration.
            </p>

            <div className="flex flex-col gap-4">
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="E.g., Create a registration form for a coding bootcamp with name, email, and experience level."
                    className="w-full p-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-black min-h-[100px] focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                />

                <div className="flex items-center gap-4">
                    <button
                        onClick={onGenerate}
                        disabled={isGenerating || !prompt}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all active:scale-95"
                    >
                        {isGenerating ? "Generating..." : "Generate Form"}
                    </button>

                    <div className="flex items-center gap-2 p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
                        <input
                            type="checkbox"
                            id="useGoogle"
                            checked={isGoogleChecked}
                            onChange={(e) => setIsGoogleChecked(e.target.checked)}
                            className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                            disabled={!isGoogleAuth}
                        />
                        <label htmlFor="useGoogle" className={`text-sm font-medium ${!isGoogleAuth ? "text-zinc-400" : "text-zinc-700 dark:text-zinc-300"}`}>
                            Create Google Form
                        </label>
                        {!isGoogleAuth && (
                            <button
                                onClick={onConnectGoogle}
                                className="ml-2 text-xs bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 px-2 py-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-700 transition"
                            >
                                Connect Google
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {googleFormUrl && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 p-4 bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 dark:bg-green-900 rounded-full text-green-600 dark:text-green-400">
                            <FileText className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-green-900 dark:text-green-100">Google Form Created!</h3>
                            <a href={googleFormUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-green-700 dark:text-green-300 underline hover:no-underline break-all">
                                {googleFormUrl}
                            </a>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        {googleEditUrl && (
                            <a href={googleEditUrl} target="_blank" rel="noopener noreferrer" className="px-3 py-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
                                Edit Form <ExternalLink className="w-3 h-3" />
                            </a>
                        )}
                        <a href={googleFormUrl} target="_blank" rel="noopener noreferrer" className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium flex items-center gap-2 shadow-sm transition-colors">
                            Open Form <ExternalLink className="w-4 h-4" />
                        </a>
                    </div>
                </motion.div>
            )}
        </section>
    );
}
