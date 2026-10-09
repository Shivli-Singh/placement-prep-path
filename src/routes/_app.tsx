import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { useState } from "react";
import { LayoutDashboard, BookOpen, Code2, Map, BarChart3, User, Menu, X, GraduationCap, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app")({ component: AppLayout });

const nav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/learning", label: "Learning Paths", icon: BookOpen },
  { to: "/practice", label: "Practice Center", icon: Code2 },
  { to: "/roadmap", label: "Roadmap", icon: Map },
  { to: "/progress", label: "Progress", icon: BarChart3 },
  { to: "/profile", label: "Profile", icon: User },
] as const;

function AppLayout() {
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-screen bg-background lg:flex">
      <aside className={cn("fixed inset-y-0 left-0 z-40 w-64 bg-sidebar text-sidebar-foreground transition-transform lg:static lg:translate-x-0", open ? "translate-x-0" : "-translate-x-full")}>
        <div className="flex h-16 items-center justify-between px-5">
          <Link to="/" className="flex items-center gap-2 font-display text-lg font-bold text-sidebar-accent-foreground">
            <GraduationCap className="h-6 w-6" /> PlacePrep
          </Link>
          <button className="lg:hidden" onClick={() => setOpen(false)} aria-label="Close menu"><X className="h-5 w-5" /></button>
        </div>
        <nav className="mt-4 space-y-1 px-3">
          {nav.map((n) => (
            <Link key={n.to} to={n.to} onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              activeProps={{ className: "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary" }}>
              <n.icon className="h-4 w-4" /> {n.label}
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-4 left-3 right-3">
          <Link to="/" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm hover:bg-sidebar-accent"><LogOut className="h-4 w-4" /> Exit to home</Link>
        </div>
      </aside>
      {open && <div className="fixed inset-0 z-30 bg-navy/40 lg:hidden" onClick={() => setOpen(false)} />}
      <div className="flex-1">
        <header className="flex h-16 items-center gap-3 border-b bg-card px-4 lg:hidden">
          <button onClick={() => setOpen(true)} aria-label="Open menu"><Menu className="h-5 w-5" /></button>
          <span className="font-display font-bold">PlacePrep</span>
        </header>
        <div className="border-b bg-accent px-4 py-2 text-center text-xs text-accent-foreground">
          Demo mode: your progress is saved in this browser only. Accounts and cloud sync come next.
        </div>
        <main className="mx-auto max-w-6xl p-4 sm:p-6 lg:p-8"><Outlet /></main>
      </div>
    </div>
  );
}
