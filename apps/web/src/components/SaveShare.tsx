"use client";

import { motion } from "framer-motion";

interface SaveShareProps {
    shareUrl: string | null;
    onSave: () => void;
    isSaving: boolean;
}

export default function SaveShare({ shareUrl, onSave, isSaving }: SaveShareProps) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 rounded-xl p-6"
        >
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="font-semibold text-indigo-900 dark:text-indigo-100">Save & Share</h3>
                    <p className="text-sm text-indigo-700 dark:text-indigo-300">Publish this form to collect responses.</p>
                </div>
                {!shareUrl ? (
                    <button
                        onClick={onSave}
                        disabled={isSaving}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium disabled:opacity-50 transition-colors"
                    >
                        {isSaving ? "Saving..." : "Save Form"}
                    </button>
                ) : (
                    <div className="flex items-center gap-2">
                        <input
                            readOnly
                            value={shareUrl}
                            className="bg-white dark:bg-black border border-indigo-200 dark:border-indigo-700 text-sm px-3 py-2 rounded-lg w-64 text-zinc-600 dark:text-zinc-300 outline-none"
                        />
                        <button
                            onClick={() => {
                                navigator.clipboard.writeText(shareUrl);
                                alert("Copied!");
                                // ideally use toast here but keeping component pure-ish, 
                                // though usually you'd trigger toast from parent or hook. 
                                // We'll leave alert for now or upgrade if we pass toast.
                            }}
                            className="px-3 py-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700 rounded-lg text-sm font-medium transition-colors"
                        >
                            Copy
                        </button>
                        <a
                            href={shareUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors"
                        >
                            Open
                        </a>
                    </div>
                )}
            </div>
        </motion.div>
    );
}
