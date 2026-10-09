import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Quiz } from "@/components/Quiz";
import { Card, Level, PageHeader } from "@/components/ui-kit";
import {
  codingQuestions as defaultCodingQuestions,
  quizQuestions as defaultQuizQuestions,
} from "@/lib/data";
import { fetchRemotePracticeQuestions, fetchRemoteQuizQuestions } from "@/lib/supabase";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/practice")({
  head: () => ({
    meta: [
      { title: "Practice Center – PlacePrep" },
      { name: "description", content: "Coding questions and aptitude quizzes." },
      { property: "og:title", content: "Practice Center – PlacePrep" },
      { property: "og:description", content: "Coding questions and aptitude quizzes." },
    ],
  }),
  component: Practice,
});

function Chip({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1 text-sm",
        active ? "border-primary bg-primary text-primary-foreground" : "bg-card hover:bg-secondary",
      )}
    >
      {children}
    </button>
  );
}

function Practice() {
  const [codingQuestions, setCodingQuestions] = useState(defaultCodingQuestions);
  const [diff, setDiff] = useState("All");
  const [topic, setTopic] = useState("All");

  useEffect(() => {
    fetchRemotePracticeQuestions().then((remote) => {
      if (remote && remote.length > 0) {
        setCodingQuestions(remote);
      }
    });
  }, []);

  const topics = ["All", ...new Set(codingQuestions.map((q) => q.topic))];
  const list = codingQuestions.filter(
    (q) => (diff === "All" || q.difficulty === diff) && (topic === "All" || q.topic === topic),
  );

  return (
    <>
      <PageHeader title="Practice Center" sub="Sharpen your coding and aptitude skills." />
      <QuizSection />
      <h2 className="mb-3 mt-10 text-xl font-bold">Coding questions</h2>
      <div className="mb-3 flex flex-wrap gap-2">
        {["All", "Easy", "Medium", "Hard"].map((d) => (
          <Chip key={d} active={diff === d} onClick={() => setDiff(d)}>
            {d}
          </Chip>
        ))}
      </div>
      <div className="mb-4 flex flex-wrap gap-2">
        {topics.map((t) => (
          <Chip key={t} active={topic === t} onClick={() => setTopic(t)}>
            {t}
          </Chip>
        ))}
      </div>
      <Card className="p-0">
        {list.length === 0 ? (
          <p className="p-8 text-center text-muted-foreground">
            No questions match these filters. Try another topic.
          </p>
        ) : (
          <ul className="divide-y">
            {list.map((q) => (
              <li key={q.title} className="flex flex-wrap items-center justify-between gap-2 p-4">
                <div>
                  <p className="font-medium">{q.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {q.topic} · Asked at {q.company}
                  </p>
                </div>
                <Level level={q.difficulty} />
              </li>
            ))}
          </ul>
        )}
      </Card>
    </>
  );
}

function QuizSection() {
  const [quizQuestions, setQuizQuestions] = useState(defaultQuizQuestions);
  const [topic, setTopic] = useState("All");

  useEffect(() => {
    fetchRemoteQuizQuestions().then((remote) => {
      if (remote && remote.length > 0) {
        setQuizQuestions(remote);
      }
    });
  }, []);

  const qs = useMemo(
    () => quizQuestions.filter((q) => topic === "All" || q.topic === topic),
    [quizQuestions, topic],
  );
  return (
    <Card>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-bold">Aptitude & technical quiz</h2>
        <div className="flex flex-wrap gap-2">
          {["All", "Quantitative", "Logical", "Verbal", "Technical"].map((t) => (
            <Chip key={t} active={topic === t} onClick={() => setTopic(t)}>
              {t}
            </Chip>
          ))}
        </div>
      </div>
      <Quiz key={topic} questions={qs} />
    </Card>
  );
}
