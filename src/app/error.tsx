"use client";
import { Button } from "@/components/ui/button";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return <div className="mx-auto max-w-lg px-4 py-24 text-center"><h1 className="text-2xl font-semibold">That didn’t load correctly.</h1><p className="mb-6 mt-3 text-sm text-muted">Try loading the page again. Your saved library stays in this browser.</p><Button onClick={reset}>Try again</Button></div>;
}
