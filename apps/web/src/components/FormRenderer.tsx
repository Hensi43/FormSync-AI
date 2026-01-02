"use client";

import { useForm } from "react-hook-form";
import { Check, ChevronDown, CheckCircle } from "lucide-react";

type FormField = {
    id: string;
    label: string;
    type: "text" | "email" | "number" | "textarea" | "select" | "checkbox" | "radio";
    required?: boolean;
    options?: string[]; // For select/radio
    placeholder?: string;
};

type FormSchema = {
    title: string;
    description?: string;
    fields: FormField[];
};

export default function FormRenderer({ schema, onSubmit: externalSubmit, defaultValues }: { schema: FormSchema, onSubmit?: (data: any) => Promise<void>, defaultValues?: any }) {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting, isSubmitSuccessful },
        reset,
    } = useForm({
        defaultValues: defaultValues || {} // Pre-fill if editing
    });

    const onSubmit = async (data: any) => {
        if (externalSubmit) {
            await externalSubmit(data);
        } else {
            // Simulate API call for preview mode
            console.log("Form Data Submitted:", data);
            await new Promise((resolve) => setTimeout(resolve, 1000));
            alert("This is a preview. Form Data: \n" + JSON.stringify(data, null, 2));
        }
        reset();
    };

    if (!schema || !schema.fields) return null;

    return (
        <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl p-8 max-w-2xl mx-auto w-full transition-all hover:shadow-2xl hover:border-indigo-500/30">
            <div className="mb-8 text-center">
                <div className="inline-block p-3 rounded-full bg-indigo-50 dark:bg-indigo-900/30 mb-4">
                    <span className="text-2xl">✨</span>
                </div>
                <h2 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                    {schema.title}
                </h2>
                {schema.description && (
                    <p className="text-zinc-500 dark:text-zinc-400 mt-2 text-base leading-relaxed max-w-lg mx-auto">
                        {schema.description}
                    </p>
                )}
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {schema.fields.map((field) => (
                    <div key={field.id} className="group flex flex-col gap-2 relative transition-all">
                        <label
                            htmlFor={field.id}
                            className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 transition-colors group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400"
                        >
                            {field.label}
                            {field.required && <span className="text-red-500 ml-1" title="Required">*</span>}
                        </label>

                        {/* Render Input Based on Type */}
                        {field.type === "textarea" ? (
                            <textarea
                                id={field.id}
                                placeholder={field.placeholder || "Type your answer here..."}
                                rows={4}
                                className="w-full px-4 py-3 rounded-xl border-2 border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/50 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all text-sm resize-none"
                                {...register(field.id, { required: field.required })}
                            />
                        ) : field.type === "select" ? (
                            <div className="relative">
                                <select
                                    id={field.id}
                                    className="w-full px-4 py-3 rounded-xl border-2 border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/50 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 appearance-none transition-all text-sm cursor-pointer"
                                    {...register(field.id, { required: field.required })}
                                >
                                    <option value="">Select an option...</option>
                                    {field.options?.map((opt) => (
                                        <option key={opt} value={opt}>
                                            {opt}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-4 top-3.5 w-5 h-5 text-zinc-400 pointer-events-none group-focus-within:text-indigo-500 transition-colors" />
                            </div>
                        ) : field.type === "checkbox" ? (
                            <label className="flex items-center gap-3 p-3 rounded-xl border-2 border-zinc-100 dark:border-zinc-800 hover:border-indigo-500/20 bg-zinc-50 dark:bg-zinc-950/50 cursor-pointer transition-all">
                                <input
                                    type="checkbox"
                                    id={field.id}
                                    className="w-5 h-5 rounded-md border-zinc-300 text-indigo-600 focus:ring-indigo-500 transition-all"
                                    {...register(field.id, { required: field.required })}
                                />
                                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300 select-none">
                                    {field.label}
                                </span>
                            </label>
                        ) : field.type === "radio" ? (
                            <div className="space-y-2">
                                {field.options?.map((opt) => (
                                    <label key={opt} className="flex items-center gap-3 p-3 rounded-xl border-2 border-zinc-100 dark:border-zinc-800 hover:border-indigo-500/20 bg-zinc-50 dark:bg-zinc-950/50 cursor-pointer transition-all">
                                        <input
                                            type="radio"
                                            value={opt}
                                            className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                                            {...register(field.id, { required: field.required })}
                                        />
                                        <span className="text-sm text-zinc-700 dark:text-zinc-300">{opt}</span>
                                    </label>
                                ))}
                            </div>
                        ) : (
                            // Text, Email, Number
                            <input
                                type={field.type}
                                id={field.id}
                                placeholder={field.placeholder || "Type your answer..."}
                                className="w-full px-4 py-3 rounded-xl border-2 border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/50 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all text-sm shadow-sm"
                                {...register(field.id, { required: field.required })}
                            />
                        )}

                        {errors[field.id] && (
                            <div className="flex items-center gap-1.5 text-xs text-red-500 font-medium animate-in slide-in-from-top-1">
                                <div className="w-1 h-1 rounded-full bg-red-500" />
                                <span>This field is required</span>
                            </div>
                        )}
                    </div>
                ))}

                <div className="pt-6">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg hover:shadow-indigo-500/25 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isSubmitting ? (
                            <>Processing...</>
                        ) : (
                            <>Submit Application <CheckCircle className="w-5 h-5" /></>
                        )}
                    </button>
                    <p className="text-center text-xs text-zinc-400 mt-4">
                        Powered by <strong>FormSync AI</strong> • Secure & Private
                    </p>
                </div>
            </form>
        </div>
    );
}
