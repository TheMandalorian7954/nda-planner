import { Toaster } from "@/components/ui/sonner";
import { RequireAuth } from "@/components/RequireAuth";
import { VlyToolbar } from "../vly-toolbar-readonly.tsx";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexReactClient } from "convex/react";
import React, { StrictMode, useEffect, lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router";
import "./index.css";

// Lazy load route components for better code splitting
const Landing = lazy(() => import("./pages/Landing.tsx"));
const AuthPage = lazy(() => import("./pages/Auth.tsx"));
const AppShell = lazy(() => import("./components/AppShell.tsx"));
const Dashboard = lazy(() => import("./pages/app/Dashboard.tsx"));
const Written = lazy(() => import("./pages/app/Written.tsx"));
const Ssb = lazy(() => import("./pages/app/Ssb.tsx"));
const Communication = lazy(() => import("./pages/app/Communication.tsx"));
const Olq = lazy(() => import("./pages/app/Olq.tsx"));
const Fitness = lazy(() => import("./pages/app/Fitness.tsx"));
const Medical = lazy(() => import("./pages/app/Medical.tsx"));
const Diet = lazy(() => import("./pages/app/Diet.tsx"));
const Habits = lazy(() => import("./pages/app/Habits.tsx"));
const MockTests = lazy(() => import("./pages/app/MockTests.tsx"));
const Analytics = lazy(() => import("./pages/app/Analytics.tsx"));
const Resources = lazy(() => import("./pages/app/Resources.tsx"));
const Coach = lazy(() => import("./pages/app/Coach.tsx"));
const Roadmap = lazy(() => import("./pages/app/Roadmap.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));

// Simple loading fallback for route transitions
function RouteLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse text-muted-foreground">Loading...</div>
    </div>
  );
}

/** Silent error boundary — if VlyToolbar crashes it renders nothing instead of
 *  crashing the whole app (e.g. hook errors in WebContainer environment). */
class ToolbarErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(err: Error) {
    console.warn("[VlyToolbar] Caught error, toolbar disabled:", err.message);
  }
  render() {
    return this.state.hasError ? null : this.props.children;
  }
}

/** Hard guard so runtime errors never leave the preview as a blank page. */
class RootErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; message: string; stack: string }
> {
  state = { hasError: false, message: "", stack: "" };
  static getDerivedStateFromError(error: Error) {
    return {
      hasError: true

[FILE_TOO_LARGE]: The combined read_files output exceeded the 100,000 character hard limit. This file was truncated after 2,860 characters. Read it separately or use code_search for the relevant section.