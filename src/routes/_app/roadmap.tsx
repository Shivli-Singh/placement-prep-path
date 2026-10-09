import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { Check } from "lucide-react";
import { Card, Bar, Level, PageHeader } from "@/components/ui-kit";
import { roadmap } from "@/lib/data";
import { useLocal, defaultRoadmap } from "@/lib/store";
import { useAuth } from "@/lib/auth-context";
import { fetchRemoteRoadmapProgress, syncRemoteRoadmapTask } from "@/lib/supabase";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/roadmap")({
  head: () => ({
    meta: [
      { title: "Placement Roadmap – PlacePrep" },
      { name: "description", content: "Beginner to advanced placement roadmap." },
      { property: "og:title", content: "Placement Roadmap – PlacePrep" },
      { property: "og:description", content: "Beginner to advanced placement roadmap." },
    ],
  }),
  component: Roadmap,
});

function Roadmap() {
  const { user } = useAuth();
  const [done, setDone, ready] = useLocal<string[]>("pp-roadmap", defaultRoadmap);

  useEffect(() => {
    if (user && ready) {
      fetchRemoteRoadmapProgress(user.id).then((remote) => {
        if (remote && remote.length > 0) {
          const merged = Array.from(new Set([...done, ...remote]));
          setDone(merged);
        } else if (done.length > 0) {
          done.forEach((id) => syncRemoteRoadmapTask(user.id, id, true));
        }
      });
    }
  }, [user, ready]); // eslint-disable-line react-hooks/exhaustive-deps

  const toggle = (id: string) => {
    const isNowDone = !done.includes(id);
    setDone(isNowDone ? [...done, id] : done.filter((d) => d !== id));
    if (user) {
      syncRemoteRoadmapTask(user.id, id, isNowDone);
    }
  };
  const all = roadmap.flatMap((s) => s.milestones.flatMap((m) => m.tasks));

  return (
    <>
      <PageHeader title="Placement Roadmap" sub="Tick off tasks as you finish them.">
        <div className="w-48 text-sm">
          <span className="font-semibold">
            {done.length}/{all.length}
          </span>{" "}
          tasks done
          <Bar value={(done.length / all.length) * 100} className="mt-1" />
        </div>
      </PageHeader>
      <div className="space-y-6">
        {roadmap.map((s) => {
          const tasks = s.milestones.flatMap((m) => m.tasks);
          const n = tasks.filter((t) => done.includes(t.id)).length;
          return (
            <Card key={s.stage}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <Level level={s.stage} />
                  <span className="text-sm text-muted-foreground">{s.subtitle}</span>
                </div>
                <span className="text-sm font-semibold">
                  {n === tasks.length ? "✅ Stage complete" : `${n}/${tasks.length} complete`}
                </span>
              </div>
              <div className="mt-4 grid gap-4 md:grid-cols-3">
                {s.milestones.map((m) => (
                  <div key={m.name} className="rounded-lg bg-muted p-4">
                    <p className="font-semibold">{m.name}</p>
                    <ul className="mt-3 space-y-2">
                      {m.tasks.map((t) => {
                        const on = done.includes(t.id);
                        return (
                          <li key={t.id}>
                            <button
                              onClick={() => toggle(t.id)}
                              className="flex w-full items-start gap-2 text-left text-sm"
                            >
                              <span
                                className={cn(
                                  "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border",
                                  on
                                    ? "border-primary bg-primary text-primary-foreground"
                                    : "bg-card",
                                )}
                              >
                                {on && <Check className="h-3.5 w-3.5" />}
                              </span>
                              <span className={cn(on && "text-muted-foreground line-through")}>
                                {t.title}
                              </span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </div>
            </Card>
          );
        })}
      </div>
    </>
  );
}
