import { createClient, type SupabaseClient, type User, type Session } from "@supabase/supabase-js";
import type { Profile, Attempt } from "./store";
import type { CodingQuestion, Mcq } from "./data";
import type { ChecklistStatus } from "./resume-data";

function sanitizeUrl(raw: string | undefined): string {
  if (!raw) return "";
  return raw
    .trim()
    .replace(/\/rest\/v1\/?$/, "")
    .replace(/\/+$/, "");
}

// Safely read Supabase credentials across Vite, SSR, and testing runtimes
const metaEnv = typeof import.meta !== "undefined" && import.meta.env ? import.meta.env : undefined;
const procEnv = typeof process !== "undefined" && process.env ? process.env : undefined;

const rawUrl =
  (metaEnv?.VITE_SUPABASE_URL as string | undefined) ||
  (procEnv?.VITE_SUPABASE_URL as string | undefined) ||
  "";
export const supabaseUrl = sanitizeUrl(rawUrl);

export const supabaseAnonKey = (
  (metaEnv?.VITE_SUPABASE_ANON_KEY as string | undefined) ||
  (procEnv?.VITE_SUPABASE_ANON_KEY as string | undefined) ||
  ""
).trim();

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  !supabaseUrl.includes("your-project-id") &&
  !supabaseAnonKey.includes("your-anon-publishable-key") &&
  supabaseUrl.startsWith("http"),
);

// Single client instance initialized safely
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;

/**
 * Diagnostic utility to test the live Supabase connection
 */
export async function testSupabaseConnection(): Promise<{
  success: boolean;
  message: string;
  urlConfigured: boolean;
  keyConfigured: boolean;
  userEmail?: string;
  tablesCreated?: boolean;
}> {
  const urlConfigured = Boolean(supabaseUrl && supabaseUrl.startsWith("http"));
  const keyConfigured = Boolean(supabaseAnonKey && supabaseAnonKey.length > 20);

  if (!isSupabaseConfigured || !supabase) {
    return {
      success: false,
      message:
        "Supabase environment variables (VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY) are not yet configured in .env",
      urlConfigured,
      keyConfigured,
      tablesCreated: false,
    };
  }

  try {
    const { data: authData, error: authError } = await supabase.auth.getSession();
    if (authError) {
      return {
        success: false,
        message: `Auth check failed: ${authError.message}`,
        urlConfigured,
        keyConfigured,
        tablesCreated: false,
      };
    }

    // Ping public practice_questions table or check health
    const { error: dbError } = await supabase.from("practice_questions").select("id").limit(1);

    if (dbError && dbError.code !== "PGRST116") {
      // If table doesn't exist yet (PGRST205 or 42P01), connection is still valid to the instance
      if (
        dbError.message.includes("does not exist") ||
        dbError.code === "42P01" ||
        dbError.code === "PGRST205"
      ) {
        return {
          success: true,
          message:
            "Connected to your Supabase project! Auth service is online. Next step: Run the provided supabase-schema.sql script in your Supabase SQL Editor to initialize database tables.",
          urlConfigured,
          keyConfigured,
          userEmail: authData.session?.user.email,
          tablesCreated: false,
        };
      }
      return {
        success: false,
        message: `Database check: ${dbError.message}`,
        urlConfigured,
        keyConfigured,
        tablesCreated: false,
      };
    }

    return {
      success: true,
      message: "Successfully connected to Supabase and verified database accessibility!",
      urlConfigured,
      keyConfigured,
      userEmail: authData.session?.user.email,
      tablesCreated: true,
    };
  } catch (err) {
    return {
      success: false,
      message: err instanceof Error ? err.message : "Unknown error connecting to Supabase",
      urlConfigured,
      keyConfigured,
    };
  }
}

// ==============================================================================
// Database Operations (with automatic graceful fallback)
// ==============================================================================

export async function fetchRemoteProfile(userId: string): Promise<Profile | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("name, email, college, branch, year")
      .eq("id", userId)
      .maybeSingle();

    if (error || !data) return null;
    return {
      name: data.name ?? "",
      email: data.email ?? "",
      college: data.college ?? "",
      branch: data.branch ?? "",
      year: data.year ?? "3rd Year",
    };
  } catch {
    return null;
  }
}

export async function saveRemoteProfile(userId: string, profile: Profile): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase.from("profiles").upsert({
      id: userId,
      name: profile.name,
      email: profile.email,
      college: profile.college,
      branch: profile.branch,
      year: profile.year,
      updated_at: new Date().toISOString(),
    });
    return !error;
  } catch {
    return false;
  }
}

export async function fetchRemotePracticeQuestions(): Promise<CodingQuestion[] | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from("practice_questions")
      .select("title, topic, company, difficulty")
      .order("created_at", { ascending: true });

    if (error || !data || data.length === 0) return null;
    return data.map((d) => ({
      title: d.title,
      topic: d.topic,
      company: d.company,
      difficulty: d.difficulty as CodingQuestion["difficulty"],
    }));
  } catch {
    return null;
  }
}

export async function fetchRemoteQuizQuestions(): Promise<Mcq[] | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from("quiz_questions")
      .select("q, options, answer, topic, explain")
      .order("created_at", { ascending: true });

    if (error || !data || data.length === 0) return null;
    return data.map((d) => ({
      q: d.q,
      options: Array.isArray(d.options) ? d.options : JSON.parse(d.options || "[]"),
      answer: Number(d.answer),
      topic: d.topic,
      explain: d.explain,
    }));
  } catch {
    return null;
  }
}

export async function recordQuizAttempt(
  userId: string | undefined,
  score: number,
  total: number,
  topic = "All",
): Promise<boolean> {
  if (!supabase || !userId) return false;
  try {
    const { error } = await supabase.from("quiz_attempts").insert({
      user_id: userId,
      score,
      total,
      topic,
    });
    return !error;
  } catch {
    return false;
  }
}

export async function fetchRemoteQuizAttempts(userId: string): Promise<Attempt[] | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from("quiz_attempts")
      .select("score, total, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: true });

    if (error || !data) return null;
    return data.map((d) => ({
      score: d.score,
      total: d.total,
      date: d.created_at,
    }));
  } catch {
    return null;
  }
}

export async function fetchRemoteLessonProgress(userId: string): Promise<string[] | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from("student_lesson_progress")
      .select("lesson_id")
      .eq("user_id", userId);

    if (error || !data) return null;
    return data.map((d) => d.lesson_id);
  } catch {
    return null;
  }
}

export async function syncRemoteLessonProgress(
  userId: string,
  lessonId: string,
  isCompleted: boolean,
): Promise<boolean> {
  if (!supabase) return false;
  try {
    if (isCompleted) {
      const { error } = await supabase.from("student_lesson_progress").upsert({
        user_id: userId,
        lesson_id: lessonId,
        completed_at: new Date().toISOString(),
      });
      return !error;
    } else {
      const { error } = await supabase
        .from("student_lesson_progress")
        .delete()
        .eq("user_id", userId)
        .eq("lesson_id", lessonId);
      return !error;
    }
  } catch {
    return false;
  }
}

export async function fetchRemoteRoadmapProgress(userId: string): Promise<string[] | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from("student_roadmap_progress")
      .select("task_id")
      .eq("user_id", userId);

    if (error || !data) return null;
    return data.map((d) => d.task_id);
  } catch {
    return null;
  }
}

export async function syncRemoteRoadmapTask(
  userId: string,
  taskId: string,
  isCompleted: boolean,
): Promise<boolean> {
  if (!supabase) return false;
  try {
    if (isCompleted) {
      const { error } = await supabase.from("student_roadmap_progress").upsert({
        user_id: userId,
        task_id: taskId,
        completed_at: new Date().toISOString(),
      });
      return !error;
    } else {
      const { error } = await supabase
        .from("student_roadmap_progress")
        .delete()
        .eq("user_id", userId)
        .eq("task_id", taskId);
      return !error;
    }
  } catch {
    return false;
  }
}

export async function fetchRemoteResumeChecklist(
  userId: string,
): Promise<Record<string, ChecklistStatus> | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from("student_resume_checklist")
      .select("item_id, status")
      .eq("user_id", userId);

    if (error || !data || data.length === 0) return null;
    const result: Record<string, ChecklistStatus> = {};
    data.forEach((row) => {
      result[row.item_id] = row.status as ChecklistStatus;
    });
    return result;
  } catch {
    return null;
  }
}

export async function syncRemoteResumeItem(
  userId: string,
  itemId: string,
  status: ChecklistStatus,
): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase.from("student_resume_checklist").upsert({
      user_id: userId,
      item_id: itemId,
      status,
      updated_at: new Date().toISOString(),
    });
    return !error;
  } catch {
    return false;
  }
}

export type { User, Session };
