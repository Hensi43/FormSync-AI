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

export default function FormRenderer({ schema, onSubmit: externalSubmit }: { schema: FormSchema, onSubmit?: (data: any) => Promise<void> }) {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting, isSubmitSuccessful },
        reset,
    } = useForm();

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
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-lg p-6 max-w-2xl mx-auto w-full transition-all">
            <div className="mb-6">
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                    {schema.title}
                </h2>
                {schema.description && (
                    <p className="text-zinc-500 dark:text-zinc-400 mt-1">
                        {schema.description}
                    </p>
                )}
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {schema.fields.map((field) => (
                    <div key={field.id} className="flex flex-col gap-1.5">
                        <label
                            htmlFor={field.id}
                            className="text-sm font-medium text-zinc-900 dark:text-zinc-200"
                        >
                            {field.label}
                            {field.required && <span className="text-red-500 ml-0.5">*</span>}
                        </label>

                        {/* Render Input Based on Type */}
                        {field.type === "textarea" ? (
                            <textarea
                                id={field.id}
                                placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}...`}
                                rows={3}
                                className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-black focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-sm"
                                {...register(field.id, { required: field.required })}
                            />
                        ) : field.type === "select" ? (
                            <div className="relative">
                                <select
                                    id={field.id}
                                    className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-black focus:outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none transition-all text-sm"
                                    {...register(field.id, { required: field.required })}
                                >
                                    <option value="">Select an option</option>
                                    {field.options?.map((opt) => (
                                        <option key={opt} value={opt}>
                                            {opt}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-3 top-2.5 w-4 h-4 text-zinc-400 pointer-events-none" />
                            </div>
                        ) : field.type === "checkbox" ? (
                            <div className="flex items-center gap-2 mt-1">
                                <input
                                    type="checkbox"
                                    id={field.id}
                                    className="w-4 h-4 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500"
                                    {...register(field.id, { required: field.required })}
                                />
                                <span className="text-sm text-zinc-600 dark:text-zinc-400">
                                    {field.label} (Yes/No)
                                </span>
                            </div>
                        ) : (
                            // Text, Email, Number
                            <input
                                type={field.type}
                                id={field.id}
                                placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}...`}
                                className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-black focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-sm"
                                {...register(field.id, { required: field.required })}
                            />
                        )}

                        {errors[field.id] && (
                            <span className="text-xs text-red-500 font-medium">
                                This field is required
                            </span>
                        )}
                    </div>
                ))}

                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? "Submitting..." : "Submit Form"}
                    </button>
                </div>
            </form>
        </div>
    );
}
