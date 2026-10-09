import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Check, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, Bar, Level } from "@/components/ui-kit";
import { Button } from "@/components/ui/button";
import { Quiz } from "@/components/Quiz";
import { courses } from "@/lib/data";
import { courseContent } from "@/lib/lessons";
import { useLessonProgress } from "@/lib/progress";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/learning/$courseId")({
  loader: ({ params }) => {
    const course = courses.find((c) => c.id === params.courseId);
    if (!course) throw notFound();
    return { course };
  },
  head: ({ loaderData }) => {
    const t = `${loaderData?.course.title ?? "Course"} – PlacePrep`;
    const d = loaderData?.course.desc ?? "Placement course";
    return {
      meta: [
        { title: t },
        { name: "description", content: d },
        { property: "og:title", content: t },
        { property: "og:description", content: d },
      ],
    };
  },
  notFoundComponent: () => (
    <p className="p-8 text-center">
      Course not found.{" "}
      <Link to="/learning" className="text-primary underline">
        Back to learning paths
      </Link>
    </p>
  ),
  component: CoursePage,
});

function CoursePage() {
  const { course } = Route.useLoaderData();
  const { lessons, questions } = courseContent[course.id]!;
  const { done, toggle } = useLessonProgress();
  const [idx, setIdx] = useState(() =>
    Math.max(
      0,
      lessons.findIndex((l) => !done.includes(l.id)),
    ),
  );
  const [tab, setTab] = useState<"lesson" | "quiz">("lesson");
  const lesson = lessons[idx] ?? lessons[0]!;
  const doneCount = lessons.filter((l) => done.includes(l.id)).length;
  const isDone = done.includes(lesson.id);

  return (
    <>
      <Link
        to="/learning"
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> All learning paths
      </Link>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <Level level={course.difficulty} />
          <h1 className="mt-2 text-2xl font-bold sm:text-3xl">{course.title}</h1>
          <p className="mt-1 text-muted-foreground">{course.desc}</p>
        </div>
        <div className="w-56 text-sm">
          <span className="font-semibold">
            {doneCount}/{lessons.length}
          </span>{" "}
          lessons complete
          <Bar value={(doneCount / lessons.length) * 100} className="mt-1" />
        </div>
      </div>

      <div className="mb-4 flex gap-2">
        {(["lesson", "quiz"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm font-medium",
              tab === t
                ? "border-primary bg-primary text-primary-foreground"
                : "bg-card hover:bg-secondary",
            )}
          >
            {t === "lesson" ? "Lessons" : `Practice questions (${questions.length})`}
          </button>
        ))}
      </div>

      {tab === "quiz" ? (
        <Card>
          <h2 className="text-xl font-bold">{course.title} — practice quiz</h2>
          <Quiz questions={questions} />
        </Card>
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="p-2 lg:order-2">
            <ul>
              {lessons.map((l, i) => {
                const on = done.includes(l.id);
                return (
                  <li key={l.id}>
                    <button
                      onClick={() => setIdx(i)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-lg p-3 text-left text-sm",
                        i === idx ? "bg-accent text-accent-foreground" : "hover:bg-muted",
                      )}
                    >
                      <span
                        className={cn(
                          "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs",
                          on ? "border-success bg-success text-primary-foreground" : "bg-card",
                        )}
                      >
                        {on ? <Check className="h-3.5 w-3.5" /> : i + 1}
                      </span>
                      <span className="flex-1">{l.title}</span>
                      <span className="text-xs text-muted-foreground">{l.minutes}m</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </Card>
          <Card className="lg:col-span-2">
            <p className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3.5 w-3.5" /> Lesson {idx + 1} of {lessons.length} ·{" "}
              {lesson.minutes} min read
            </p>
            <h2 className="mt-2 text-xl font-bold">{lesson.title}</h2>
            <div className="mt-4 space-y-3 leading-relaxed">
              {lesson.body.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            <div className="mt-5 rounded-lg border-l-4 border-primary bg-accent p-4 text-sm">
              <span className="font-semibold">Placement tip: </span>
              {lesson.tip}
            </div>
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
              <Button variant={isDone ? "outline" : "default"} onClick={() => toggle(lesson.id)}>
                {isDone ? "Completed ✓ (undo)" : "Mark as complete"}
              </Button>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  disabled={idx === 0}
                  onClick={() => setIdx(idx - 1)}
                  aria-label="Previous lesson"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                {idx < lessons.length - 1 ? (
                  <Button variant="outline" onClick={() => setIdx(idx + 1)}>
                    Next <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                ) : (
                  <Button variant="outline" onClick={() => setTab("quiz")}>
                    Take the quiz <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </Card>
        </div>
      )}
    </>
  );
}
