import { createFileRoute, Link } from "@tanstack/react-router";
import {
  GraduationCap,
  BookOpen,
  Code2,
  Map,
  BarChart3,
  MessagesSquare,
  ListChecks,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PlacePrep – Placement Training LMS for College Students" },
      {
        name: "description",
        content:
          "Learning paths, aptitude and coding practice, roadmaps and progress tracking for campus placements — in one place.",
      },
      { property: "og:title", content: "PlacePrep – Your Campus Placement Journey Starts Here" },
      {
        property: "og:description",
        content: "One centralized platform for campus placement preparation.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

const features = [
  {
    icon: BookOpen,
    title: "Structured learning paths",
    text: "Six guided tracks from aptitude to HR interviews.",
  },
  {
    icon: Code2,
    title: "Coding & aptitude practice",
    text: "Company-tagged problems and timed MCQ quizzes.",
  },
  {
    icon: Map,
    title: "Semester-wise roadmap",
    text: "Know exactly what to do from first year to final year.",
  },
  {
    icon: BarChart3,
    title: "Progress tracking",
    text: "Scores, streaks and module completion at a glance.",
  },
  {
    icon: MessagesSquare,
    title: "Interview preparation",
    text: "Technical and HR question banks with model answers.",
  },
  {
    icon: ListChecks,
    title: "Personal dashboard",
    text: "Recommended next steps and upcoming tasks.",
  },
];

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5">
        <span className="flex items-center gap-2 font-display text-xl font-bold text-navy">
          <GraduationCap className="h-7 w-7 text-primary" /> PlacePrep
        </span>
        <Button asChild>
          <Link to="/dashboard">Get Started</Link>
        </Button>
      </header>

      <section className="mx-auto max-w-6xl px-4 pb-16 pt-10 sm:pt-20">
        <div className="rounded-3xl bg-hero px-6 py-16 text-center text-navy-foreground sm:px-12">
          <p className="mb-4 inline-block rounded-full bg-navy-foreground/10 px-4 py-1 text-sm">
            Placement Training LMS for College Students
          </p>
          <h1 className="mx-auto max-w-3xl text-4xl font-extrabold leading-tight sm:text-6xl">
            Your Campus Placement Journey Starts Here.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg opacity-85">
            Learn, practice and track everything you need for placements — aptitude, coding,
            interviews and soft skills — in one simple dashboard.
          </p>
          <Button asChild size="lg" variant="secondary" className="mt-8 h-12 px-8 text-base">
            <Link to="/dashboard">
              Get Started <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-4 pb-16 md:grid-cols-2">
        <div className="rounded-2xl border bg-card p-8">
          <p className="text-sm font-semibold text-destructive">The problem</p>
          <h2 className="mt-2 text-2xl font-bold">Preparation is scattered everywhere</h2>
          <p className="mt-3 text-muted-foreground">
            Students jump between YouTube, PDFs, coding sites and WhatsApp groups — with no clear
            plan and no way to see if they're actually ready.
          </p>
        </div>
        <div className="rounded-2xl border bg-accent p-8">
          <p className="text-sm font-semibold text-primary">The solution</p>
          <h2 className="mt-2 text-2xl font-bold">One place, one plan</h2>
          <p className="mt-3 text-muted-foreground">
            PlacePrep brings learning paths, practice tests, a step-by-step roadmap and progress
            tracking together so you always know your next step.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20">
        <h2 className="text-center text-3xl font-bold">Everything you need to get placed</h2>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="rounded-xl border bg-card p-6 shadow-card">
              <f.icon className="h-8 w-8 text-primary" />
              <h3 className="mt-4 font-semibold">{f.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="bg-navy py-10 text-navy-foreground">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 text-sm">
          <span className="flex items-center gap-2 font-display font-bold">
            <GraduationCap className="h-5 w-5" /> PlacePrep
          </span>
          <nav className="flex gap-5 opacity-80">
            <Link to="/learning">Learning</Link>
            <Link to="/practice">Practice</Link>
            <Link to="/roadmap">Roadmap</Link>
          </nav>
          <span className="opacity-70">© 2026 PlacePrep · Built for college students</span>
        </div>
      </footer>
    </div>
  );
}
