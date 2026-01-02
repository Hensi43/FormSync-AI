"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { Plus, Trash2, GripVertical, Save } from "lucide-react";

export default function FormBuilder({ schema, onUpdate }: { schema: any, onUpdate: (newSchema: any) => void }) {
    const { register, control, handleSubmit, watch } = useForm({
        defaultValues: {
            title: schema.title,
            description: schema.description,
            fields: schema.fields
        }
    });

    const { fields, append, remove, move } = useFieldArray({
        control,
        name: "fields"
    });

    const onSubmit = (data: any) => {
        const updatedSchema = {
            ...schema,
            ...data
        };
        onUpdate(updatedSchema);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Edit Form Details</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Form Title</label>
                        <input
                            {...register("title", { required: true })}
                            className="w-full px-3 py-2 border rounded-lg dark:bg-zinc-950 dark:border-zinc-800"
                            placeholder="Form Title"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Description</label>
                        <textarea
                            {...register("description")}
                            rows={2}
                            className="w-full px-3 py-2 border rounded-lg dark:bg-zinc-950 dark:border-zinc-800"
                            placeholder="Form Description"
                        />
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                {fields.map((field, index) => (
                    <div key={field.id} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 shadow-sm flex gap-4 items-start group">
                        <button type="button" className="mt-2 text-zinc-400 cursor-grab active:cursor-grabbing">
                            <GripVertical className="w-5 h-5" />
                        </button>

                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-zinc-500 mb-1">Label</label>
                                <input
                                    {...register(`fields.${index}.label` as const, { required: true })}
                                    className="w-full px-3 py-2 border rounded-lg dark:bg-zinc-950 dark:border-zinc-800 text-sm"
                                    placeholder="Question Label"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-zinc-500 mb-1">Type</label>
                                <select
                                    {...register(`fields.${index}.type` as const)}
                                    className="w-full px-3 py-2 border rounded-lg dark:bg-zinc-950 dark:border-zinc-800 text-sm"
                                >
                                    <option value="text">Short Text</option>
                                    <option value="textarea">Long Text</option>
                                    <option value="email">Email</option>
                                    <option value="number">Number</option>
                                    <option value="select">Dropdown</option>
                                    <option value="radio">Multiple Choice</option>
                                    <option value="checkbox">Checkbox</option>
                                    <option value="date">Date</option>
                                </select>
                            </div>

                            {/* Optional: Options input for select/radio/checkbox */}
                            <div className="col-span-2">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        {...register(`fields.${index}.required` as const)}
                                        className="rounded border-zinc-300"
                                    />
                                    <span className="text-sm">Required</span>
                                </label>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => remove(index)}
                            className="p-2 text-zinc-400 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        >
                            <Trash2 className="w-5 h-5" />
                        </button>
                    </div>
                ))}
            </div>

            <div className="flex gap-2">
                <button
                    type="button"
                    onClick={() => append({ id: `field_${Date.now()}`, label: "New Question", type: "text", required: false })}
                    className="flex-1 py-3 border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-xl text-zinc-500 hover:text-indigo-600 hover:border-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/10 transition-all flex items-center justify-center gap-2 font-medium"
                >
                    <Plus className="w-5 h-5" /> Add Question
                </button>
            </div>

            <div className="flex justify-end pt-4 border-t border-zinc-200 dark:border-zinc-800">
                <button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg flex items-center gap-2 font-medium shadow-sm transition-colors"
                >
                    <Save className="w-4 h-4" /> Save Changes
                </button>
            </div>
        </form>
    );
}
