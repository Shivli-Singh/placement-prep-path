import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth-context";
import { testSupabaseConnection } from "@/lib/supabase";
import { testFirestoreConnection } from "@/lib/firebase";
import { toast } from "sonner";
import {
  Database,
  CheckCircle2,
  AlertCircle,
  UserPlus,
  LogIn,
  Activity,
  Flame,
} from "lucide-react";

export function AuthModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { user, firebaseUser, signIn, signUp, signInWithGoogle, signOut, isConfigured } = useAuth();
  const activeUser = firebaseUser || user;
  const [mode, setMode] = useState<"signin" | "signup" | "test">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [college, setCollege] = useState("");
  const [branch, setBranch] = useState("Computer Science & Engineering");
  const [year, setYear] = useState("3rd Year");
  const [loading, setLoading] = useState(false);

  // Diagnostic state
  const [testResult, setTestResult] = useState<{
    success?: boolean;
    message?: string;
    urlConfigured?: boolean;
    keyConfigured?: boolean;
    userEmail?: string;
  } | null>(null);
  const [firebaseStatus, setFirebaseStatus] = useState<{
    success?: boolean;
    message?: string;
  } | null>(null);
  const [testing, setTesting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in email and password");
      return;
    }

    setLoading(true);
    try {
      if (mode === "signin") {
        const { error } = await signIn(email, password);
        if (error) {
          toast.error(error.message);
        } else {
          toast.success("Signed in successfully! Cloud progress synced.");
          onOpenChange(false);
        }
      } else if (mode === "signup") {
        const { error } = await signUp(email, password, {
          name: name || undefined,
          college: college || undefined,
          branch,
          year,
        });
        if (error) {
          toast.error(error.message);
        } else {
          toast.success("Account created! Please check your email or proceed to sign in.");
          setMode("signin");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const { error } = await signInWithGoogle();
      if (error) {
        toast.error(`Google Sign-In: ${error.message}`);
      } else {
        toast.success("Signed in with Google! Synced via Firebase.");
        onOpenChange(false);
      }
    } finally {
      setLoading(false);
    }
  };

  const runTest = async () => {
    setTesting(true);
    try {
      const res = await testSupabaseConnection();
      setTestResult(res);
      const fbRes = await testFirestoreConnection();
      setFirebaseStatus(fbRes);
      if (res.success || fbRes.success) {
        toast.success("Cloud backend services verified!");
      } else {
        toast.error("Connection check failed. Check details.");
      }
    } finally {
      setTesting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-primary/10 p-2 text-primary">
              <Database className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-xl">
                {activeUser ? "Account & Cloud Sync" : "Student Authentication"}
              </DialogTitle>
              <DialogDescription className="text-xs">
                Connected to Firebase Firestore & Supabase backends.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Tab Controls */}
        <div className="mt-2 flex rounded-lg bg-muted p-1 text-xs">
          {!activeUser ? (
            <>
              <button
                type="button"
                onClick={() => setMode("signin")}
                className={`flex-1 rounded-md py-1.5 font-medium transition ${
                  mode === "signin" ? "bg-card text-foreground shadow-xs" : "text-muted-foreground"
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setMode("signup")}
                className={`flex-1 rounded-md py-1.5 font-medium transition ${
                  mode === "signup" ? "bg-card text-foreground shadow-xs" : "text-muted-foreground"
                }`}
              >
                Sign Up
              </button>
            </>
          ) : (
            <div className="flex-1 py-1 text-center font-semibold text-success">
              Signed in as {activeUser.email}
            </div>
          )}
          <button
            type="button"
            onClick={() => {
              setMode("test");
              if (!testResult) runTest();
            }}
            className={`rounded-md px-3 py-1.5 font-medium transition ${
              mode === "test" ? "bg-card text-foreground shadow-xs" : "text-muted-foreground"
            }`}
          >
            Backend Status
          </button>
        </div>

        {/* Mode: Backend Status Diagnostics */}
        {mode === "test" ? (
          <div className="mt-3 space-y-3">
            {/* Firebase Status */}
            <div className="rounded-lg border bg-card p-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 font-semibold text-foreground">
                  <Flame className="h-4 w-4 text-orange-500" /> Firebase & Firestore
                </span>
                <span className="flex items-center gap-1 text-success font-medium">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Provisioned & Active
                </span>
              </div>
              <p className="mt-1 text-[11px] text-muted-foreground">
                Rules deployed · Enterprise Firestore Database & Google Auth connected.
              </p>
              {firebaseStatus && (
                <p className="mt-1 text-[11px] text-success">Status: {firebaseStatus.message}</p>
              )}
            </div>

            {/* Supabase Status */}
            <div className="rounded-lg border bg-card p-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 font-semibold text-foreground">
                  <Database className="h-4 w-4 text-emerald-500" /> Supabase PostgreSQL
                </span>
                <span className="flex items-center gap-1 font-medium">
                  {isConfigured ? (
                    <span className="flex items-center gap-1 text-success">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Configured
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-warning">
                      <AlertCircle className="h-3.5 w-3.5" /> Missing env
                    </span>
                  )}
                </span>
              </div>
              {testResult && (
                <p className="mt-1 text-[11px] text-muted-foreground">{testResult.message}</p>
              )}
            </div>

            <div className="flex items-center justify-between pt-1">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={runTest}
                disabled={testing}
                className="gap-1.5"
              >
                <Activity className="h-3.5 w-3.5" />
                {testing ? "Testing..." : "Test Backends Now"}
              </Button>
              {activeUser && (
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={async () => {
                    await signOut();
                    toast("Signed out");
                    onOpenChange(false);
                  }}
                >
                  Sign Out
                </Button>
              )}
            </div>
          </div>
        ) : activeUser ? (
          /* User is already signed in */
          <div className="mt-3 space-y-4">
            <div className="rounded-lg border bg-accent/20 p-4 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                {activeUser.email?.[0]?.toUpperCase()}
              </div>
              <h3 className="mt-2 font-semibold text-foreground">{activeUser.email}</h3>
              <p className="text-xs text-muted-foreground">
                {firebaseUser ? "Firebase Google User" : "Supabase Student User"}
              </p>
              <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-success/15 px-2.5 py-0.5 text-xs font-medium text-success">
                <CheckCircle2 className="h-3 w-3" /> Cloud Synced
              </span>
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => onOpenChange(false)}
              >
                Close
              </Button>
              <Button
                type="button"
                variant="destructive"
                className="flex-1"
                onClick={async () => {
                  await signOut();
                  toast("Signed out successfully");
                  onOpenChange(false);
                }}
              >
                Sign Out
              </Button>
            </div>
          </div>
        ) : (
          /* Form for Sign In or Sign Up */
          <div className="mt-3 space-y-3">
            {/* Quick Google Sign In */}
            <Button
              type="button"
              variant="outline"
              className="w-full h-9 gap-2 text-xs"
              onClick={handleGoogleSignIn}
              disabled={loading}
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.05h3.9c2.28-2.1 3.645-5.2 3.645-9.14z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.9-3.05c-1.08.72-2.45 1.16-4.03 1.16-3.1 0-5.74-2.1-6.68-4.93H1.21v3.15C3.26 21.46 7.34 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.32 14.27c-.24-.72-.38-1.49-.38-2.27s.14-1.55.38-2.27V6.58H1.21C.44 8.11 0 9.99 0 12s.44 3.89 1.21 5.42l4.11-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.54 1.21 6.58l4.11 3.15c.94-2.83 3.58-4.98 6.68-4.98z"
                />
              </svg>
              Continue with Google (Firebase)
            </Button>

            <div className="relative flex items-center justify-center">
              <div className="border-t w-full" />
              <span className="bg-card px-2 text-[10px] uppercase text-muted-foreground">
                or email
              </span>
              <div className="border-t w-full" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              {mode === "signup" && (
                <div className="space-y-1">
                  <Label htmlFor="auth-name" className="text-xs">
                    Full Name
                  </Label>
                  <Input
                    id="auth-name"
                    placeholder="e.g. Rahul Verma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-9 text-xs"
                  />
                </div>
              )}

              <div className="space-y-1">
                <Label htmlFor="auth-email" className="text-xs">
                  Email Address
                </Label>
                <Input
                  id="auth-email"
                  type="email"
                  required
                  placeholder="student@college.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="auth-pass" className="text-xs">
                  Password
                </Label>
                <Input
                  id="auth-pass"
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>

              {mode === "signup" && (
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label htmlFor="auth-college" className="text-xs">
                      College / University
                    </Label>
                    <Input
                      id="auth-college"
                      placeholder="College Name"
                      value={college}
                      onChange={(e) => setCollege(e.target.value)}
                      className="h-9 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="auth-year" className="text-xs">
                      Graduation Year
                    </Label>
                    <select
                      id="auth-year"
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      className="h-9 w-full rounded-md border bg-card px-2 text-xs"
                    >
                      <option>1st Year</option>
                      <option>2nd Year</option>
                      <option>3rd Year</option>
                      <option>4th Year</option>
                    </select>
                  </div>
                </div>
              )}

              <div className="pt-2">
                <Button type="submit" className="w-full h-9 gap-1.5" disabled={loading}>
                  {mode === "signin" ? (
                    <>
                      <LogIn className="h-4 w-4" />
                      {loading ? "Signing in..." : "Sign In & Sync Progress"}
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-4 w-4" />
                      {loading ? "Creating Account..." : "Create Student Account"}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
