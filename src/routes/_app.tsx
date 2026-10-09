import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { useState } from "react";
import {
  LayoutDashboard,
  BookOpen,
  Code2,
  Map,
  BarChart3,
  User,
  Menu,
  X,
  GraduationCap,
  LogOut,
  Database,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import { AuthModal } from "@/components/AuthModal";

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
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const { user, profile, isConfigured } = useAuth();

  return (
    <div className="min-h-screen bg-background lg:flex">
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-sidebar text-sidebar-foreground transition-transform lg:static lg:translate-x-0 flex flex-col justify-between",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div>
          <div className="flex h-16 items-center justify-between px-5">
            <Link
              to="/"
              className="flex items-center gap-2 font-display text-lg font-bold text-sidebar-accent-foreground"
            >
              <GraduationCap className="h-6 w-6" /> PlacePrep
            </Link>
            <button className="lg:hidden" onClick={() => setOpen(false)} aria-label="Close menu">
              <X className="h-5 w-5" />
            </button>
          </div>
          <nav className="mt-4 space-y-1 px-3">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                activeProps={{
                  className:
                    "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary",
                }}
              >
                <n.icon className="h-4 w-4" /> {n.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="p-3 space-y-2 border-t border-sidebar-border">
          {/* Supabase Account & Sync Button */}
          <button
            onClick={() => {
              setOpen(false);
              setAuthModalOpen(true);
            }}
            className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-medium bg-sidebar-accent/50 hover:bg-sidebar-accent text-sidebar-accent-foreground transition-colors"
          >
            <div className="flex items-center gap-2 truncate">
              <Database className="h-3.5 w-3.5 shrink-0 text-sidebar-primary-foreground" />
              <span className="truncate">{user ? user.email : "Connect Supabase"}</span>
            </div>
            {user ? (
              <span
                className="flex h-2 w-2 rounded-full bg-success shrink-0"
                title="Cloud Synced"
              />
            ) : (
              <span className="text-[10px] text-muted-foreground uppercase tracking-wide">
                Sync
              </span>
            )}
          </button>

          <Link
            to="/"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-xs text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            <LogOut className="h-3.5 w-3.5" /> Exit to home
          </Link>
        </div>
      </aside>
      {open && (
        <div className="fixed inset-0 z-30 bg-navy/40 lg:hidden" onClick={() => setOpen(false)} />
      )}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="flex h-16 items-center justify-between border-b bg-card px-4 lg:hidden">
          <div className="flex items-center gap-3">
            <button onClick={() => setOpen(true)} aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </button>
            <span className="font-display font-bold">PlacePrep</span>
          </div>
          <button
            onClick={() => setAuthModalOpen(true)}
            className="flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium"
          >
            <Database className="h-3.5 w-3.5" />
            <span>{user ? "Synced" : "Sync"}</span>
          </button>
        </header>

        {/* Global Connection & Sync Status Banner */}
        <div className="border-b bg-accent/40 px-4 py-1.5 text-xs text-accent-foreground">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-2">
            <div className="flex items-center gap-2 truncate">
              {user ? (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5 text-success shrink-0" />
                  <span className="truncate">
                    Connected to Supabase · Synced as <strong>{profile.name}</strong> ({user.email})
                  </span>
                </>
              ) : isConfigured ? (
                <>
                  <Database className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span className="truncate">
                    Supabase configured · Sign in to synchronize your scores and progress to the
                    cloud.
                  </span>
                </>
              ) : (
                <>
                  <Database className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  <span className="truncate">
                    Local storage mode active. Connect your Supabase project URL and anon key to
                    enable remote sync.
                  </span>
                </>
              )}
            </div>
            <button
              onClick={() => setAuthModalOpen(true)}
              className="font-semibold underline shrink-0 text-primary hover:text-primary/80"
            >
              {user ? "Manage Sync" : "Sign In / Connect"}
            </button>
          </div>
        </div>

        <main className="mx-auto max-w-6xl p-4 sm:p-6 lg:p-8 flex-1 w-full">
          <Outlet />
        </main>
      </div>

      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
    </div>
  );
}
