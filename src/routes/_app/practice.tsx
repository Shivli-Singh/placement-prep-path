import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { CheckCircle2, XCircle, RotateCcw } from "lucide-react";
import { Card, Level, PageHeader, Bar } from "@/components/ui-kit";
import { Button } from "@/components/ui/button";
import { codingQuestions, quizQuestions } from "@/lib/data";
import { useLocal, type Attempt } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/practice")({
  head: () => ({ meta: [{ title: "Practice Center – PlacePrep" }, { name: "description", content: "Coding questions and aptitude quizzes." }, { property: "og:title", content: "Practice Center – PlacePrep" }, { property: "og:description", content: "Coding questions and aptitude quizzes." }] }),
  component: Practice,
});

function Chip({ active, children, onClick }: { active: boolean; children: string; onClick: () => void }) {
  return <button onClick={onClick} className={cn("rounded-full border px-3 py-1 text-sm", active ? "border-primary bg-primary text-primary-foreground" : "bg-card hover:bg-secondary")}>{children}</button>;
}

function Practice() {
  const [diff, setDiff] = useState("All");
  const [topic, setTopic] = useState("All");
  const topics = ["All", ...new Set(codingQuestions.map((q) => q.topic))];
  const list = codingQuestions.filter((q) => (diff === "All" || q.difficulty === diff) && (topic === "All" || q.topic === topic));

  return (
    <>
      <PageHeader title="Practice Center" sub="Sharpen your coding and aptitude skills." />
      <Quiz />
      <h2 className="mb-3 mt-10 text-xl font-bold">Coding questions</h2>
      <div className="mb-3 flex flex-wrap gap-2">{["All", "Easy", "Medium", "Hard"].map((d) => <Chip key={d} active={diff === d} onClick={() => setDiff(d)}>{d}</Chip>)}</div>
      <div className="mb-4 flex flex-wrap gap-2">{topics.map((t) => <Chip key={t} active={topic === t} onClick={() => setTopic(t)}>{t}</Chip>)}</div>
      <Card className="p-0">
        {list.length === 0 ? <p className="p-8 text-center text-muted-foreground">No questions match these filters. Try another topic.</p> :
          <ul className="divide-y">{list.map((q) => (
            <li key={q.title} className="flex flex-wrap items-center justify-between gap-2 p-4">
              <div><p className="font-medium">{q.title}</p><p className="text-xs text-muted-foreground">{q.topic} · Asked at {q.company}</p></div>
              <Level level={q.difficulty} />
            </li>))}</ul>}
      </Card>
    </>
  );
}

function Quiz() {
  const [topic, setTopic] = useState("All");
  const qs = useMemo(() => quizQuestions.filter((q) => topic === "All" || q.topic === topic), [topic]);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [attempts, setAttempts] = useLocal<Attempt[]>("pp-attempts", []);
  const score = qs.reduce((s, q, i) => s + (answers[i] === q.answer ? 1 : 0), 0);
  const allAnswered = Object.keys(answers).length === qs.length;

  const reset = () => { setAnswers({}); setSubmitted(false); };
  const submit = () => {
    setSubmitted(true);
    setAttempts([...attempts, { date: new Date().toISOString(), score, total: qs.length }]);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Card>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-bold">Aptitude & technical quiz</h2>
        <div className="flex flex-wrap gap-2">{["All", "Quantitative", "Logical", "Verbal", "Technical"].map((t) => <Chip key={t} active={topic === t} onClick={() => { setTopic(t); reset(); }}>{t}</Chip>)}</div>
      </div>
      {submitted && (
        <div className="mt-4 rounded-lg bg-accent p-4">
          <p className="font-display text-2xl font-bold">You scored {score}/{qs.length} ({Math.round((score / qs.length) * 100)}%)</p>
          <Bar value={(score / qs.length) * 100} className="mt-2" />
          <p className="mt-2 text-sm text-muted-foreground">{score === qs.length ? "Perfect! You're placement-ready on this topic." : "Review the explanations below and try again."}</p>
        </div>
      )}
      <ol className="mt-5 space-y-6">
        {qs.map((q, i) => (
          <li key={q.q}>
            <p className="font-medium">{i + 1}. {q.q} <span className="ml-1 text-xs text-muted-foreground">({q.topic})</span></p>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              {q.options.map((o, j) => {
                const picked = answers[i] === j;
                const correct = submitted && j === q.answer;
                const wrong = submitted && picked && j !== q.answer;
                return (
                  <button key={o} disabled={submitted} onClick={() => setAnswers({ ...answers, [i]: j })}
                    className={cn("flex items-center justify-between rounded-lg border px-4 py-2.5 text-left text-sm transition",
                      picked && !submitted && "border-primary bg-accent",
                      correct && "border-success bg-success/10", wrong && "border-destructive bg-destructive/10",
                      !submitted && "hover:border-primary")}>
                    {o}{correct && <CheckCircle2 className="h-4 w-4 text-success" />}{wrong && <XCircle className="h-4 w-4 text-destructive" />}
                  </button>
                );
              })}
            </div>
            {submitted && <p className="mt-2 text-xs text-muted-foreground">💡 {q.explain}</p>}
          </li>
        ))}
      </ol>
      <div className="mt-6 flex items-center gap-3">
        {!submitted ? (
          <>
            <Button onClick={submit} disabled={!allAnswered}>Submit quiz</Button>
            {!allAnswered && <span className="text-sm text-muted-foreground">Answer all {qs.length} questions to submit ({Object.keys(answers).length} done)</span>}
          </>
        ) : <Button variant="outline" onClick={reset}><RotateCcw className="mr-1 h-4 w-4" /> Try again</Button>}
      </div>
    </Card>
  );
}
