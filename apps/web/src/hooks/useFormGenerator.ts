"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";

export type ApiStatus = "loading" | "connected" | "error";

interface GeneratedSchema {
    title: string;
    description?: string;
    fields: any[];
    error?: string;
    details?: any;
}

export function useFormGenerator() {
    const [apiStatus, setApiStatus] = useState<ApiStatus>("loading");
    const [apiData, setApiData] = useState<any>(null);

    const [prompt, setPrompt] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedForm, setGeneratedForm] = useState<GeneratedSchema | null>(null);
    const [googleFormUrl, setGoogleFormUrl] = useState<string | null>(null);
    const [googleEditUrl, setGoogleEditUrl] = useState<string | null>(null);

    const [isGoogleAuth, setIsGoogleAuth] = useState(false);
    const [isGoogleChecked, setIsGoogleChecked] = useState(false);

    const [isSaving, setIsSaving] = useState(false);
    const [shareUrl, setShareUrl] = useState<string | null>(null);

    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

    // 1. System Health Check
    useEffect(() => {
        checkSystemStatus();
        checkGoogleAuth();
    }, []);

    const checkSystemStatus = async () => {
        try {
            const res = await fetch(`${API_URL}/health`);
            const data = await res.json();
            setApiData(data);
            setApiStatus("connected");
        } catch (err) {
            console.error("API Error", err);
            setApiStatus("error");
        }
    };

    const checkGoogleAuth = async () => {
        try {
            const res = await fetch(`${API_URL}/api/v1/google/status`);
            const data = await res.json();
            setIsGoogleAuth(data.authenticated);
        } catch (e) {
            console.error("Auth check failed", e);
        }
    };

    // 2. Actions
    const connectGoogle = async () => {
        try {
            const res = await fetch(`${API_URL}/api/v1/google/auth/url`);
            const data = await res.json();
            window.location.href = data.url;
        } catch (e) {
            toast.error("Failed to initiate Google Login");
        }
    };

    const generateForm = async () => {
        if (!prompt.trim()) {
            toast.warning("Please enter a description first");
            return;
        }

        setIsGenerating(true);
        setGoogleFormUrl(null);
        setGoogleEditUrl(null);
        setGeneratedForm(null);

        try {
            const endpoint = isGoogleChecked ? "/api/v1/generate/google" : "/api/v1/generate";
            const res = await fetch(`${API_URL}${endpoint}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ description: prompt }),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.detail || "Generation failed");

            if (isGoogleChecked && data.formUrl) {
                setGoogleFormUrl(data.formUrl);
                // Handle new backend structure if it returns editUrl in response.
                // Note: The backend returns { formUrl: ..., schema: ... } in generator.py router
                // We need to check if we updated the router to pass editUrl or if it's inside `data`
                if (data.editUrl) {
                    setGoogleEditUrl(data.editUrl);
                } else if (data.formUrl && data.formUrl.includes("/viewform")) {
                    // Fallback heuristic if backend not updated fully
                    setGoogleEditUrl(data.formUrl.replace("/viewform", "/edit"));
                }

                setGeneratedForm(data.schema);
                toast.success("Google Form Created Successfully!");
            } else {
                setGeneratedForm(data);
                toast.success("Form Schema Generated!");
            }
        } catch (err: any) {
            console.error(err);
            setGeneratedForm({ title: "Error", fields: [], error: "Failed", details: err.message });
            toast.error(`Generation Failed: ${err.message}`);
        } finally {
            setIsGenerating(false);
        }
    };

    const saveForm = async () => {
        if (!generatedForm) return;
        setIsSaving(true);
        try {
            const res = await fetch(`${API_URL}/api/v1/forms/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: generatedForm.title || "Untitled Form",
                    description: generatedForm.description,
                    schema_body: generatedForm
                }),
            });
            if (!res.ok) throw new Error("Failed to save");
            const data = await res.json();
            const url = `${window.location.origin}/public/${data.id}`;
            setShareUrl(url);
            toast.success("Form Saved to Database!");
        } catch (err) {
            toast.error("Failed to save form");
        } finally {
            setIsSaving(false);
        }
    };

    return {
        // State
        apiStatus,
        apiData,
        prompt,
        setPrompt,
        isGenerating,
        generatedForm,
        googleFormUrl,
        googleEditUrl,
        isGoogleAuth,
        isGoogleChecked,
        setIsGoogleChecked,
        isSaving,
        shareUrl,

        // Actions
        connectGoogle,
        generateForm,
        saveForm,
        setGeneratedForm
    };
}
