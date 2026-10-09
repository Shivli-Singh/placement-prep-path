import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import {
  supabase,
  isSupabaseConfigured,
  fetchRemoteProfile,
  saveRemoteProfile,
  type User as SupabaseUser,
  type Session,
} from "./supabase";
import {
  auth as firebaseAuth,
  signInWithGoogle as fbSignInWithGoogle,
  signOutFirebase,
  getFirebaseProfile,
  saveFirebaseProfile,
  onAuthStateChanged,
  type FirebaseUser,
} from "./firebase";
import { defaultProfile, type Profile } from "./store";

interface AuthContextValue {
  user: SupabaseUser | null;
  firebaseUser: FirebaseUser | null;
  session: Session | null;
  profile: Profile;
  loading: boolean;
  isConfigured: boolean;
  isFirebaseActive: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (
    email: string,
    password: string,
    meta?: Partial<Profile>,
  ) => Promise<{ error: Error | null }>;
  signInWithGoogle: () => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  updateProfile: (updated: Profile) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile>(() => {
    try {
      const local = localStorage.getItem("pp-profile");
      return local ? JSON.parse(local) : defaultProfile;
    } catch {
      return defaultProfile;
    }
  });
  const [loading, setLoading] = useState(true);

  // Initialize Firebase Auth listener
  useEffect(() => {
    const unsubscribeFb = onAuthStateChanged(firebaseAuth, async (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        try {
          const remote = await getFirebaseProfile(fbUser.uid);
          if (remote) {
            setProfile(remote);
            localStorage.setItem("pp-profile", JSON.stringify(remote));
          } else {
            const initial: Profile = {
              name: fbUser.displayName || defaultProfile.name,
              email: fbUser.email || defaultProfile.email,
              college: defaultProfile.college,
              branch: defaultProfile.branch,
              year: defaultProfile.year,
            };
            setProfile(initial);
            localStorage.setItem("pp-profile", JSON.stringify(initial));
            await saveFirebaseProfile(fbUser.uid, initial);
          }
        } catch (err) {
          console.warn("Could not load Firebase profile:", err);
        }
      }
    });

    return () => unsubscribeFb();
  }, []);

  // Initialize Supabase Auth session and listener
  useEffect(() => {
    if (!supabase || !isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          fetchRemoteProfile(session.user.id).then((remote) => {
            if (remote) {
              setProfile(remote);
              localStorage.setItem("pp-profile", JSON.stringify(remote));
            }
          });
        }
      })
      .finally(() => setLoading(false));

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
      if (newSession?.user) {
        const remote = await fetchRemoteProfile(newSession.user.id);
        if (remote) {
          setProfile(remote);
          localStorage.setItem("pp-profile", JSON.stringify(remote));
        } else {
          await saveRemoteProfile(newSession.user.id, profile);
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const signIn = async (email: string, password: string) => {
    if (!supabase) {
      return { error: new Error("Supabase is not configured.") };
    }
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (!error && data.user) {
      const remote = await fetchRemoteProfile(data.user.id);
      if (remote) {
        setProfile(remote);
        localStorage.setItem("pp-profile", JSON.stringify(remote));
      }
    }
    return { error: error ? new Error(error.message) : null };
  };

  const signUp = async (email: string, password: string, meta?: Partial<Profile>) => {
    if (!supabase) {
      return { error: new Error("Supabase is not configured.") };
    }
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: meta?.name || profile.name,
          college: meta?.college || profile.college,
          branch: meta?.branch || profile.branch,
          year: meta?.year || profile.year,
        },
      },
    });

    if (!error && data.user) {
      const newProfile: Profile = {
        name: meta?.name || profile.name,
        email,
        college: meta?.college || profile.college,
        branch: meta?.branch || profile.branch,
        year: meta?.year || profile.year,
      };
      setProfile(newProfile);
      localStorage.setItem("pp-profile", JSON.stringify(newProfile));
      await saveRemoteProfile(data.user.id, newProfile);
    }

    return { error: error ? new Error(error.message) : null };
  };

  const signInWithGoogle = async () => {
    try {
      const res = await fbSignInWithGoogle();
      if (res.user) {
        const remote = await getFirebaseProfile(res.user.uid);
        if (remote) {
          setProfile(remote);
          localStorage.setItem("pp-profile", JSON.stringify(remote));
        } else {
          const newProfile: Profile = {
            name: res.user.displayName || defaultProfile.name,
            email: res.user.email || defaultProfile.email,
            college: defaultProfile.college,
            branch: defaultProfile.branch,
            year: defaultProfile.year,
          };
          setProfile(newProfile);
          localStorage.setItem("pp-profile", JSON.stringify(newProfile));
          await saveFirebaseProfile(res.user.uid, newProfile);
        }
      }
      return { error: null };
    } catch (err) {
      return { error: err instanceof Error ? err : new Error(String(err)) };
    }
  };

  const signOut = async () => {
    if (firebaseUser) {
      await signOutFirebase();
      setFirebaseUser(null);
    }
    if (supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setSession(null);
  };

  const updateProfile = async (updated: Profile) => {
    setProfile(updated);
    localStorage.setItem("pp-profile", JSON.stringify(updated));
    if (firebaseUser) {
      await saveFirebaseProfile(firebaseUser.uid, updated);
    }
    if (user) {
      await saveRemoteProfile(user.id, updated);
    }
    return true;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        session,
        profile,
        loading,
        isConfigured: isSupabaseConfigured,
        isFirebaseActive: true,
        signIn,
        signUp,
        signInWithGoogle,
        signOut,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
