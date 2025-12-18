"use client";

import { useEffect, useState } from "react";
import { Activity, Server, AlertCircle, CheckCircle2, Code, Eye } from "lucide-react";
import FormRenderer from "../components/FormRenderer";

export default function Home() {
  const [apiStatus, setApiStatus] = useState<"loading" | "connected" | "error">("loading");
  const [apiData, setApiData] = useState<any>(null);
  const [prompt, setPrompt] = useState("");
  const [generatedForm, setGeneratedForm] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [viewMode, setViewMode] = useState<"json" | "preview">("preview");

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!generatedForm) return;
    setIsSaving(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/v1/forms/`, {
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
      alert(`Form Saved! ID: ${data.id}`);
    } catch (err) {
      console.error(err);
      alert("Failed to save form to Supabase");
    } finally {
      setIsSaving(false);
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/v1/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: prompt }),
      });
      const data = await res.json();
      setGeneratedForm(data);
    } catch (err) {
      console.error(err);
      setGeneratedForm({ error: "Failed", details: err });
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    // Attempt to connect to the local FastAPI backend
    fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/health`)
      .then((res) => res.json())
      .then((data) => {
        setApiData(data);
        setApiStatus("connected");
      })
      .catch((err) => {
        console.error("API Connection Error:", err);
        setApiStatus("error");
      });
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 font-sans">
      {/* Header */}
      <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-6 py-4 flex items-center gap-3">
        <Activity className="w-6 h-6 text-indigo-500" />
        <h1 className="text-xl font-bold tracking-tight">FormSync AI</h1>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-8 max-w-5xl mx-auto w-full">
        <div className="grid gap-6">

          {/* Welcome Card */}
          <section className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm">
            <h2 className="text-2xl font-semibold mb-2">System Status</h2>
            <div className="flex items-center justify-between mb-6">
              <p className="text-zinc-500 dark:text-zinc-400">
                Checking connectivity between Next.js (Web) and FastAPI (API).
              </p>
              <div className={`text-xs px-2 py-1 rounded-full border ${apiStatus === 'connected' ? 'bg-green-100 border-green-200 text-green-700' : 'bg-red-100 border-red-200 text-red-700'}`}>
                {apiStatus === 'connected' ? 'System Online' : 'System Offline'}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {/* API Status Card */}
              <div className={`
                p-4 rounded-lg border flex items-start gap-4 transition-colors
                ${apiStatus === "connected"
                  ? "bg-green-50/50 border-green-200 dark:bg-green-900/10 dark:border-green-800"
                  : apiStatus === "error"
                    ? "bg-red-50/50 border-red-200 dark:bg-red-900/10 dark:border-red-800"
                    : "bg-zinc-50 border-zinc-200 dark:bg-zinc-800/50 dark:border-zinc-700"}
              `}>
                <div className={`
                  p-2 rounded-full
                  ${apiStatus === "connected" ? "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400" :
                    apiStatus === "error" ? "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400" :
                      "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"}
                `}>
                  <Server className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm mb-1">Backend API</h3>
                  {apiStatus === "loading" && <p className="text-sm text-zinc-500">Connecting...</p>}
                  {apiStatus === "connected" && (
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-green-700 dark:text-green-400 font-medium">
                        <CheckCircle2 className="w-4 h-4" /> Connected
                      </div>
                      <pre className="text-xs font-mono bg-white/50 dark:bg-black/20 p-2 rounded border border-green-200 dark:border-green-800 mt-2">
                        {JSON.stringify(apiData, null, 2)}
                      </pre>
                    </div>
                  )}
                  {apiStatus === "error" && (
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-red-700 dark:text-red-400 font-medium">
                        <AlertCircle className="w-4 h-4" /> Connection Failed
                      </div>
                      <p className="text-xs text-red-600/80 dark:text-red-400/80 mt-1">
                        Is the backend running on port 8000? <br />
                        Check console for CORS errors.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* AI Generator Test */}
          <section className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm">
            <h2 className="text-2xl font-semibold mb-2">Test AI Generation</h2>
            <p className="text-zinc-500 dark:text-zinc-400 mb-6">
              Enter a description to test the OpenAI integration.
            </p>

            <div className="flex flex-col gap-4">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="E.g., Create a registration form for a coding bootcamp with name, email, and experience level."
                className="w-full p-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-black min-h-[100px]"
              />
              <button
                onClick={handleGenerate}
                disabled={isGenerating || !prompt}
                className="self-start px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isGenerating ? "Generating..." : "Generate JSON Schema"}
              </button>
            </div>

            {generatedForm && (
              <div className="mt-8 border-t border-zinc-200 dark:border-zinc-800 pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-zinc-500">Result</h3>
                  <div className="flex bg-zinc-100 dark:bg-zinc-800 p-1 rounded-lg">
                    <button
                      onClick={() => setViewMode("preview")}
                      className={`px-3 py-1.5 text-xs font-medium rounded-md flex items-center gap-2 transition-all ${viewMode === "preview" ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-50 shadow-sm" : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"}`}
                    >
                      <Eye className="w-3.5 h-3.5" /> Preview
                    </button>
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
                    ) : (
                      <pre className="bg-zinc-950 text-zinc-50 p-4 rounded-lg overflow-auto max-h-[500px] text-sm font-mono border border-zinc-800">
                        {JSON.stringify(generatedForm, null, 2)}
                      </pre>
                    )}
                  </div>
                )}
              </div>
            )}
          </section>

          {/* Setup Checklist */}
          <section className="grid gap-4 md:grid-cols-3">
            <div className="bg-white dark:bg-zinc-900 p-5 rounded-lg border border-zinc-200 dark:border-zinc-800">
              <h3 className="font-medium mb-2">1. Infrastructure</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">Docker Compose orchestrating Web (3000) and API (8000).</p>
            </div>
            <div className="bg-white dark:bg-zinc-900 p-5 rounded-lg border border-zinc-200 dark:border-zinc-800">
              <h3 className="font-medium mb-2">2. Database</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">Supabase client installed but not configured.</p>
            </div>
            <div className="bg-white dark:bg-zinc-900 p-5 rounded-lg border border-zinc-200 dark:border-zinc-800">
              <h3 className="font-medium mb-2">3. AI Engine</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">FastAPI ready. No models connected yet.</p>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}
