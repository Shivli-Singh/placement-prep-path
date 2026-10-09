import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, Trophy, Flame, CheckCircle2, ArrowRight, CalendarClock } from "lucide-react";
import { Card, Bar, Stat, PageHeader } from "@/components/ui-kit";
import { ResumeChecklist } from "@/components/ResumeChecklist";
import { upcomingTasks } from "@/lib/data";
import { useLessonProgress } from "@/lib/progress";
import { useLocal, type Attempt } from "@/lib/store";
import { useAuth } from "@/lib/auth-context";
import { fetchRemoteQuizAttempts } from "@/lib/supabase";
import { getFirebaseQuizAttempts } from "@/lib/firebase";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/_app/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard – PlacePrep" },
      { name: "description", content: "Your placement preparation overview." },
      { property: "og:title", content: "Dashboard – PlacePrep" },
      { property: "og:description", content: "Your placement preparation overview." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { user, firebaseUser, profile } = useAuth();
  const { courses } = useLessonProgress();
  const [localAttempts] = useLocal<Attempt[]>("pp-attempts", []);
  const [attempts, setAttempts] = useState<Attempt[]>(localAttempts);

  useEffect(() => {
    if (firebaseUser) {
      getFirebaseQuizAttempts(firebaseUser.uid)
        .then((remote) => {
          if (remote && remote.length > 0) {
            setAttempts(remote);
          } else {
            setAttempts(localAttempts);
          }
        })
        .catch(() => setAttempts(localAttempts));
    } else if (user) {
      fetchRemoteQuizAttempts(user.id).then((remote) => {
        if (remote && remote.length > 0) {
          setAttempts(remote);
        } else {
          setAttempts(localAttempts);
        }
      });
    } else {
      setAttempts(localAttempts);
    }
  }, [user, firebaseUser, localAttempts]);

  const totalL = courses.reduce((a, c) => a + c.lessons, 0);
  const doneL = courses.reduce((a, c) => a + c.done, 0);
  const last = attempts[attempts.length - 1];
  const recs = [...courses].sort((a, b) => a.done / a.lessons - b.done / b.lessons).slice(0, 3);

  return (
    <>
      <PageHeader
        title={`Welcome back, ${profile.name.split(" ")[0]} 👋`}
        sub="Here's how your placement preparation is going."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat
          label="Overall progress"
          value={`${Math.round((doneL / totalL) * 100)}%`}
          hint="Across all 6 learning paths"
          icon={<BookOpen className="h-4 w-4" />}
        />
        <Stat
          label="Lessons completed"
          value={`${doneL}/${totalL}`}
          hint="Sample data"
          icon={<CheckCircle2 className="h-4 w-4" />}
        />
        <Stat
          label="Latest quiz score"
          value={last ? `${Math.round((last.score / last.total) * 100)}%` : "82%"}
          hint={last ? "Your last attempt" : "Sample — take a quiz!"}
          icon={<Trophy className="h-4 w-4" />}
        />
        <Stat
          label="Current streak"
          value="7 days"
          hint="Sample data"
          icon={<Flame className="h-4 w-4" />}
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <h2 className="font-semibold">Recommended for you</h2>
          <div className="mt-4 space-y-4">
            {recs.map((c) => (
              <div key={c.id} className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{c.title}</span>
                    <span className="text-muted-foreground">
                      {c.done}/{c.lessons} lessons
                    </span>
                  </div>
                  <Bar value={(c.done / c.lessons) * 100} className="mt-2" />
                </div>
              </div>
            ))}
            <Link
              to="/practice"
              className="flex items-center justify-between rounded-lg bg-accent p-4 text-sm font-medium text-accent-foreground"
            >
              Take today's aptitude quiz <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Card>
        <Card>
          <h2 className="flex items-center gap-2 font-semibold">
            <CalendarClock className="h-4 w-4 text-primary" /> Upcoming tasks
          </h2>
          <ul className="mt-4 space-y-3">
            {upcomingTasks.map((t) => (
              <li key={t.title} className="rounded-lg border p-3">
                <p className="text-sm font-medium">{t.title}</p>
                <p className="mt-1 flex justify-between text-xs text-muted-foreground">
                  <span>{t.due}</span>
                  <span className="rounded bg-secondary px-1.5">{t.tag}</span>
                </p>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="mt-8">
        <ResumeChecklist />
      </div>
    </>
  );
}
