import { createFileRoute } from "@tanstack/react-router";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Card, Bar, PageHeader } from "@/components/ui-kit";
import { sampleQuizHistory } from "@/lib/data";
import { useEffect, useState } from "react";
import { useLessonProgress } from "@/lib/progress";
import { useLocal, type Attempt } from "@/lib/store";
import { useAuth } from "@/lib/auth-context";
import { fetchRemoteQuizAttempts } from "@/lib/supabase";
import { getFirebaseQuizAttempts } from "@/lib/firebase";

export const Route = createFileRoute("/_app/progress")({
  head: () => ({
    meta: [
      { title: "My Progress – PlacePrep" },
      { name: "description", content: "Quiz scores and module completion." },
      { property: "og:title", content: "My Progress – PlacePrep" },
      { property: "og:description", content: "Quiz scores and module completion." },
    ],
  }),
  component: Progress,
});

function Progress() {
  const { user, firebaseUser } = useAuth();
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

  const mine = attempts
    .slice(-6)
    .map((a, i) => ({ name: `Try ${i + 1}`, score: Math.round((a.score / a.total) * 100) }));
  const data = mine.length ? mine : sampleQuizHistory;
  const totalL = courses.reduce((a, c) => a + c.lessons, 0);
  const doneL = courses.reduce((a, c) => a + c.done, 0);
  const pie = [
    { name: "Completed", value: doneL },
    { name: "Remaining", value: totalL - doneL },
  ];

  return (
    <>
      <PageHeader title="My Progress" sub="See how far you've come." />
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <h2 className="font-semibold">Quiz scores (%)</h2>
          <p className="text-xs text-muted-foreground">
            {mine.length
              ? "Your recent quiz attempts"
              : "Sample data — take a quiz in the Practice Center to see your own"}
          </p>
          <div className="mt-4 h-64">
            <ResponsiveContainer>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" fontSize={12} stroke="var(--muted-foreground)" />
                <YAxis domain={[0, 100]} fontSize={12} stroke="var(--muted-foreground)" />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="var(--chart-1)"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <h2 className="font-semibold">Overall learning</h2>
          <div className="relative mt-2 h-56">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={pie}
                  dataKey="value"
                  innerRadius={60}
                  outerRadius={85}
                  startAngle={90}
                  endAngle={-270}
                >
                  <Cell fill="var(--chart-1)" />
                  <Cell fill="var(--secondary)" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-display text-3xl font-bold">
                {Math.round((doneL / totalL) * 100)}%
              </span>
              <span className="text-xs text-muted-foreground">
                {doneL} of {totalL} lessons
              </span>
            </div>
          </div>
        </Card>
      </div>
      <Card className="mt-6">
        <h2 className="font-semibold">Modules</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {courses.map((c) => (
            <div key={c.id}>
              <div className="flex justify-between text-sm">
                <span>{c.title}</span>
                <span className="text-muted-foreground">
                  {Math.round((c.done / c.lessons) * 100)}%
                </span>
              </div>
              <Bar value={(c.done / c.lessons) * 100} className="mt-1.5" />
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}
