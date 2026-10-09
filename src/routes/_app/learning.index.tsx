import { createFileRoute, Link } from "@tanstack/react-router";
import { Clock, BookOpen } from "lucide-react";
import { Card, Bar, Level, PageHeader } from "@/components/ui-kit";
import { Button } from "@/components/ui/button";
import { useLessonProgress } from "@/lib/progress";

export const Route = createFileRoute("/_app/learning/")({
  head: () => ({
    meta: [
      { title: "Learning Paths – PlacePrep" },
      { name: "description", content: "Six structured placement learning paths." },
      { property: "og:title", content: "Learning Paths – PlacePrep" },
      { property: "og:description", content: "Six structured placement learning paths." },
    ],
  }),
  component: Learning,
});

function Learning() {
  const { courses } = useLessonProgress();
  return (
    <>
      <PageHeader title="Learning Paths" sub="Pick a path and continue where you left off." />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map((c) => {
          const pct = Math.round((c.done / c.lessons) * 100);
          return (
            <Card key={c.id} className="flex flex-col">
              <div className="flex items-center justify-between">
                <Level level={c.difficulty} />
                <span className="text-sm font-semibold text-primary">{pct}%</span>
              </div>
              <h3 className="mt-3 text-lg font-semibold">{c.title}</h3>
              <p className="mt-1 flex-1 text-sm text-muted-foreground">{c.desc}</p>
              <div className="mt-4 flex gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {c.hours} hours
                </span>
                <span className="flex items-center gap-1">
                  <BookOpen className="h-3.5 w-3.5" />
                  {c.lessons} lessons
                </span>
              </div>
              <Bar value={pct} className="mt-3" />
              <Button asChild className="mt-4" variant={pct > 0 ? "default" : "outline"}>
                <Link to="/learning/$courseId" params={{ courseId: c.id }}>
                  {pct === 100 ? "Review" : pct > 0 ? "Continue" : "Start"}
                </Link>
              </Button>
            </Card>
          );
        })}
      </div>
    </>
  );
}
