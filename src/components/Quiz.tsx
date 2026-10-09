import { useState } from "react";
import { CheckCircle2, XCircle, RotateCcw } from "lucide-react";
import { Bar } from "@/components/ui-kit";
import { Button } from "@/components/ui/button";
import type { Mcq } from "@/lib/data";
import { useLocal, type Attempt } from "@/lib/store";
import { useAuth } from "@/lib/auth-context";
import { recordQuizAttempt } from "@/lib/supabase";
import { recordFirebaseQuizAttempt } from "@/lib/firebase";
import { cn } from "@/lib/utils";

export function Quiz({ questions }: { questions: Mcq[] }) {
  const qs = questions;
  const { user, firebaseUser } = useAuth();
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [attempts, setAttempts] = useLocal<Attempt[]>("pp-attempts", []);
  const score = qs.reduce((s, q, i) => s + (answers[i] === q.answer ? 1 : 0), 0);
  const allAnswered = Object.keys(answers).length === qs.length;

  const reset = () => {
    setAnswers({});
    setSubmitted(false);
  };
  const submit = () => {
    setSubmitted(true);
    setAttempts([...attempts, { date: new Date().toISOString(), score, total: qs.length }]);
    if (user) {
      recordQuizAttempt(user.id, score, qs.length, qs[0]?.topic ?? "All");
    }
    if (firebaseUser) {
      recordFirebaseQuizAttempt(firebaseUser.uid, score, qs.length, qs[0]?.topic ?? "All").catch(
        (err) => console.warn("Firebase quiz record error:", err),
      );
    }
  };

  return (
    <div key={qs.map((q) => q.q).join()}>
      {submitted && (
        <div className="mt-4 rounded-lg bg-accent p-4">
          <p className="font-display text-2xl font-bold">
            You scored {score}/{qs.length} ({Math.round((score / qs.length) * 100)}%)
          </p>
          <Bar value={(score / qs.length) * 100} className="mt-2" />
          <p className="mt-2 text-sm text-muted-foreground">
            {score === qs.length
              ? "Perfect! You're placement-ready on this topic."
              : "Review the explanations below and try again."}
          </p>
        </div>
      )}
      <ol className="mt-5 space-y-6">
        {qs.map((q, i) => (
          <li key={q.q}>
            <p className="font-medium">
              {i + 1}. {q.q} <span className="ml-1 text-xs text-muted-foreground">({q.topic})</span>
            </p>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              {q.options.map((o, j) => {
                const picked = answers[i] === j;
                const correct = submitted && j === q.answer;
                const wrong = submitted && picked && j !== q.answer;
                return (
                  <button
                    key={o}
                    disabled={submitted}
                    onClick={() => setAnswers({ ...answers, [i]: j })}
                    className={cn(
                      "flex items-center justify-between rounded-lg border px-4 py-2.5 text-left text-sm transition",
                      picked && !submitted && "border-primary bg-accent",
                      correct && "border-success bg-success/10",
                      wrong && "border-destructive bg-destructive/10",
                      !submitted && "hover:border-primary",
                    )}
                  >
                    {o}
                    {correct && <CheckCircle2 className="h-4 w-4 text-success" />}
                    {wrong && <XCircle className="h-4 w-4 text-destructive" />}
                  </button>
                );
              })}
            </div>
            {submitted && <p className="mt-2 text-xs text-muted-foreground">💡 {q.explain}</p>}
          </li>
        ))}
      </ol>
      <div className="mt-6 flex flex-wrap items-center gap-3">
        {!submitted ? (
          <>
            <Button onClick={submit} disabled={!allAnswered}>
              Submit quiz
            </Button>
            {!allAnswered && (
              <span className="text-sm text-muted-foreground">
                Answer all {qs.length} questions to submit ({Object.keys(answers).length} done)
              </span>
            )}
          </>
        ) : (
          <Button variant="outline" onClick={reset}>
            <RotateCcw className="mr-1 h-4 w-4" /> Try again
          </Button>
        )}
      </div>
    </div>
  );
}
