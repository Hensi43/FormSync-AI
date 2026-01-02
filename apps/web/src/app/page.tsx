"use client";

import { Activity } from "lucide-react";
import Link from "next/link";
import { Toaster } from "sonner";
import StatusCard from "../components/StatusCard";
import GeneratorInput from "../components/GeneratorInput";
import FormPreview from "../components/FormPreview";
import SaveShare from "../components/SaveShare";
import { useFormGenerator } from "../hooks/useFormGenerator";

export default function Home() {
  const {
    apiStatus,
    apiData,
    prompt,
    setPrompt,
    isGenerating,
    generateForm,
    generatedForm,
    googleFormUrl,
    isGoogleAuth,
    isGoogleChecked,
    setIsGoogleChecked,
    connectGoogle,
    isSaving,
    shareUrl,
    saveForm,
    googleEditUrl,
    setGeneratedForm
  } = useFormGenerator();

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 font-sans">
      <Toaster position="top-center" />

      {/* Header */}
      <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-6 py-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Activity className="w-6 h-6 text-indigo-500" />
          <h1 className="text-xl font-bold tracking-tight">FormSync AI</h1>
        </div>
        <Link
          href="/dashboard"
          className="text-sm font-medium text-zinc-600 hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-indigo-400 transition-colors"
        >
          Dashboard
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-8 max-w-5xl mx-auto w-full">
        <div className="grid gap-6">

          {/* 1. Status */}
          <StatusCard status={apiStatus} data={apiData} />

          {/* 2. Generation Input */}
          <GeneratorInput
            prompt={prompt}
            setPrompt={setPrompt}
            isGenerating={isGenerating}
            onGenerate={generateForm}
            isGoogleAuth={isGoogleAuth}
            isGoogleChecked={isGoogleChecked}
            setIsGoogleChecked={setIsGoogleChecked}
            onConnectGoogle={connectGoogle}
            googleFormUrl={googleFormUrl}
            googleEditUrl={googleEditUrl}
          />

          {/* 3. Preview */}
          {generatedForm && (
            <section className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm">
              <FormPreview
                generatedForm={generatedForm}
                onUpdate={(newSchema) => setGeneratedForm({ ...generatedForm, ...newSchema })}
              />

              {!generatedForm.error && (
                <SaveShare
                  shareUrl={shareUrl}
                  onSave={saveForm}
                  isSaving={isSaving}
                />
              )}
            </section>
          )}

          {/* Setup Checklist */}
          <section className="grid gap-4 md:grid-cols-3">
            <div className="bg-white dark:bg-zinc-900 p-5 rounded-lg border border-zinc-200 dark:border-zinc-800">
              <h3 className="font-medium mb-2">1. Infrastructure</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">Docker Compose orchestrating Web (3000) and API (8000).</p>
            </div>
            <div className="bg-white dark:bg-zinc-900 p-5 rounded-lg border border-zinc-200 dark:border-zinc-800">
              <h3 className="font-medium mb-2">2. Database</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                {apiData?.database === "initialized"
                  ? <span className="text-green-600 dark:text-green-400 font-medium">Supabase Connected & Ready.</span>
                  : "Supabase client installed but not configured."}
              </p>
            </div>
            <div className="bg-white dark:bg-zinc-900 p-5 rounded-lg border border-zinc-200 dark:border-zinc-800">
              <h3 className="font-medium mb-2">3. AI Engine</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                {apiData ? <span className="text-green-600 dark:text-green-400 font-medium">Gemini 1.5 Flash Active.</span> : "FastAPI ready. No models connected yet."}
              </p>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}
