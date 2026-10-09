import { useState, useMemo, useEffect } from "react";
import {
  CheckCircle2,
  Clock,
  Circle,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  ChevronRight,
  Info,
} from "lucide-react";
import { toast } from "sonner";
import { useLocal } from "@/lib/store";
import { useAuth } from "@/lib/auth-context";
import { fetchRemoteResumeChecklist, syncRemoteResumeItem } from "@/lib/supabase";
import { getFirebaseResumeChecklist, syncFirebaseResumeItem } from "@/lib/firebase";
import { cn } from "@/lib/utils";
import { Card, Bar } from "@/components/ui-kit";
import {
  RESUME_SECTIONS,
  DEFAULT_RESUME_STATUS_MAP,
  type ChecklistStatus,
  type SectionDefinition,
} from "@/lib/resume-data";

export function ResumeChecklist({ className }: { className?: string }) {
  const { user, firebaseUser } = useAuth();
  const [activeSectionId, setActiveSectionId] = useState<SectionDefinition["id"]>("projects");
  const [statusFilter, setStatusFilter] = useState<"all" | ChecklistStatus>("all");
  const [statuses, setStatuses, ready] = useLocal<Record<string, ChecklistStatus>>(
    "pp-resume-checklist-state",
    DEFAULT_RESUME_STATUS_MAP,
  );
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    if (firebaseUser && ready) {
      getFirebaseResumeChecklist(firebaseUser.uid)
        .then((remote) => {
          if (remote && Object.keys(remote).length > 0) {
            setStatuses({ ...statuses, ...remote });
          }
        })
        .catch((err) => console.warn("Firebase resume sync error:", err));
    }
    if (user && ready) {
      fetchRemoteResumeChecklist(user.id).then((remote) => {
        if (remote && Object.keys(remote).length > 0) {
          setStatuses({ ...statuses, ...remote });
        }
      });
    }
  }, [user, firebaseUser, ready]); // eslint-disable-line react-hooks/exhaustive-deps

  const activeSection = useMemo(
    () => RESUME_SECTIONS.find((s) => s.id === activeSectionId) ?? RESUME_SECTIONS[0]!,
    [activeSectionId],
  );

  const allItems = useMemo(() => RESUME_SECTIONS.flatMap((s) => s.items), []);

  const totalCount = allItems.length;
  const completedCount = useMemo(
    () => allItems.filter((i) => statuses[i.id] === "completed").length,
    [allItems, statuses],
  );
  const inProgressCount = useMemo(
    () => allItems.filter((i) => statuses[i.id] === "in_progress").length,
    [allItems, statuses],
  );
  const percentage = Math.round((completedCount / totalCount) * 100);

  const cycleStatus = (id: string) => {
    const current = statuses[id] ?? "not_started";
    let next: ChecklistStatus;
    if (current === "not_started") next = "in_progress";
    else if (current === "in_progress") next = "completed";
    else next = "not_started";

    const updated = { ...statuses, [id]: next };
    setStatuses(updated);
    if (user) {
      syncRemoteResumeItem(user.id, id, next);
    }
    if (firebaseUser) {
      syncFirebaseResumeItem(firebaseUser.uid, id, next).catch((err) =>
        console.warn("Firebase resume item sync error:", err),
      );
    }

    if (next === "completed") {
      toast.success("Marked as Completed");
    } else if (next === "in_progress") {
      toast.info("Marked as In Progress");
    } else {
      toast("Reset to Not Started");
    }
  };

  const setExplicitStatus = (id: string, newStatus: ChecklistStatus) => {
    setStatuses({ ...statuses, [id]: newStatus });
    if (user) {
      syncRemoteResumeItem(user.id, id, newStatus);
    }
    if (firebaseUser) {
      syncFirebaseResumeItem(firebaseUser.uid, id, newStatus).catch((err) =>
        console.warn("Firebase resume item sync error:", err),
      );
    }
    if (newStatus === "completed") {
      toast.success("Item marked as Completed");
    } else if (newStatus === "in_progress") {
      toast.info("Item marked as In Progress");
    } else {
      toast("Item marked as Not Started");
    }
  };

  const markCurrentSectionAll = (targetStatus: ChecklistStatus) => {
    const updated = { ...statuses };
    activeSection.items.forEach((item) => {
      updated[item.id] = targetStatus;
      if (user) {
        syncRemoteResumeItem(user.id, item.id, targetStatus);
      }
      if (firebaseUser) {
        syncFirebaseResumeItem(firebaseUser.uid, item.id, targetStatus).catch((err) =>
          console.warn("Firebase resume section sync error:", err),
        );
      }
    });
    setStatuses(updated);
    if (targetStatus === "completed") {
      toast.success(`All items in ${activeSection.title} marked complete`);
    } else {
      toast(`Section ${activeSection.title} reset`);
    }
  };

  const copySnippet = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success("Example copied to clipboard");
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  const getSectionStatus = (section: SectionDefinition): ChecklistStatus => {
    const items = section.items;
    const completed = items.filter((i) => statuses[i.id] === "completed").length;
    const inProgress = items.filter((i) => statuses[i.id] === "in_progress").length;
    if (completed === items.length) return "completed";
    if (completed > 0 || inProgress > 0) return "in_progress";
    return "not_started";
  };

  const filteredItems = useMemo(() => {
    if (statusFilter === "all") return activeSection.items;
    return activeSection.items.filter(
      (item) => (statuses[item.id] ?? "not_started") === statusFilter,
    );
  }, [activeSection, statusFilter, statuses]);

  return (
    <Card className={cn("overflow-hidden border bg-card p-0 shadow-card", className)}>
      {/* Component Header & Progress Banner */}
      <div className="border-b bg-gradient-to-r from-card via-card to-accent/20 p-5 sm:p-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>Placement Preparation</span>
              <span aria-hidden="true">·</span>
              <span>Campus Career Readiness</span>
              <span aria-hidden="true">·</span>
              <span>Updated for 2026 Hiring</span>
            </div>
            <h2 className="mt-1 font-display text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              Resume Preparation Checklist
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Step-by-step guidance to build an interview-ready resume across Projects, Experience,
              Skills, and ATS standards.
            </p>
          </div>

          {/* Aggregate Completion Dial / Counter */}
          <div className="flex shrink-0 items-center gap-3 rounded-lg border bg-card/80 p-3 shadow-xs">
            <div className="space-y-1 text-right">
              <div className="flex items-center justify-end gap-1.5 font-display text-lg font-bold tabular-nums text-foreground">
                <span>{percentage}%</span>
                <span className="text-xs font-normal text-muted-foreground">Ready</span>
              </div>
              <div className="text-xs tabular-nums text-muted-foreground">
                {completedCount} of {totalCount} completed
              </div>
            </div>
            <div className="h-10 w-10 shrink-0">
              <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  fill="none"
                  className="stroke-secondary"
                  strokeWidth="3.5"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  fill="none"
                  className="stroke-primary transition-all duration-300"
                  strokeWidth="3.5"
                  strokeDasharray={`${(percentage / 100) * 88} 88`}
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="mt-4 space-y-1.5">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Overall Resume Readiness</span>
            <span className="tabular-nums">
              {completedCount} Completed · {inProgressCount} In Progress ·{" "}
              {totalCount - completedCount - inProgressCount} Pending
            </span>
          </div>
          <Bar value={percentage} className="h-2" />
        </div>
      </div>

      {/* Section Selection Bar */}
      <div className="border-b bg-muted/40 px-3 py-2 sm:px-6">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-none">
          {RESUME_SECTIONS.map((section) => {
            const secStatus = getSectionStatus(section);
            const secDone = section.items.filter((i) => statuses[i.id] === "completed").length;
            const isSelected = activeSectionId === section.id;

            return (
              <button
                key={section.id}
                onClick={() => setActiveSectionId(section.id)}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-medium whitespace-nowrap transition-all shrink-0",
                  isSelected
                    ? "bg-card text-foreground shadow-xs ring-1 ring-border"
                    : "text-muted-foreground hover:bg-card/60 hover:text-foreground",
                )}
              >
                <SectionStatusIcon status={secStatus} className="h-4 w-4" />
                <span className="font-semibold">{section.shortTitle}</span>
                <span className="text-[11px] tabular-nums text-muted-foreground">
                  ({secDone}/{section.items.length})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Section Content Area */}
      <div className="p-5 sm:p-6">
        {/* Active Section Info Header */}
        <div className="rounded-xl border bg-muted/20 p-4 sm:p-5">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-primary/10 p-2.5 text-primary">
                <activeSection.icon className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-base font-semibold text-foreground sm:text-lg">
                    {activeSection.title}
                  </h3>
                  <SectionStatusBadge status={getSectionStatus(activeSection)} />
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">
                  {activeSection.overview}
                </p>
              </div>
            </div>

            {/* Quick Section Actions */}
            <div className="flex items-center gap-2 self-start sm:self-center">
              <button
                onClick={() => markCurrentSectionAll("completed")}
                className="flex items-center gap-1.5 rounded-md border bg-card px-2.5 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                title="Mark all items in this section as completed"
              >
                <Check className="h-3.5 w-3.5 text-success" />
                <span>Mark All Complete</span>
              </button>
              <button
                onClick={() => markCurrentSectionAll("not_started")}
                className="flex items-center gap-1 rounded-md border bg-card px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                title="Reset this section to not started"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only">Reset</span>
              </button>
            </div>
          </div>

          {/* Recruiter Insight Box */}
          <div className="mt-3.5 flex items-start gap-2.5 rounded-lg border border-primary/20 bg-primary/5 p-3 text-xs text-foreground">
            <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <div>
              <span className="font-semibold text-primary">Recruiter Perspective: </span>
              <span className="text-muted-foreground">{activeSection.recruiterInsight}</span>
            </div>
          </div>
        </div>

        {/* Filter Bar & Item Count */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-b pb-3">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <span>Section criteria:</span>
            <span className="font-semibold text-foreground">
              {activeSection.items.filter((i) => statuses[i.id] === "completed").length} of{" "}
              {activeSection.items.length} completed
            </span>
          </div>

          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1 rounded-lg bg-muted p-1">
            <button
              onClick={() => setStatusFilter("all")}
              className={cn(
                "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                statusFilter === "all"
                  ? "bg-card text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              All ({activeSection.items.length})
            </button>
            <button
              onClick={() => setStatusFilter("completed")}
              className={cn(
                "flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                statusFilter === "completed"
                  ? "bg-card text-success shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <CheckCircle2 className="h-3 w-3 text-success" />
              <span>Done</span>
            </button>
            <button
              onClick={() => setStatusFilter("in_progress")}
              className={cn(
                "flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                statusFilter === "in_progress"
                  ? "bg-card text-warning shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Clock className="h-3 w-3 text-warning" />
              <span>In Progress</span>
            </button>
            <button
              onClick={() => setStatusFilter("not_started")}
              className={cn(
                "flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                statusFilter === "not_started"
                  ? "bg-card text-muted-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Circle className="h-3 w-3 text-muted-foreground" />
              <span>Pending</span>
            </button>
          </div>
        </div>

        {/* Checklist Item Cards */}
        <div className="mt-4 space-y-3.5">
          {filteredItems.length === 0 ? (
            <div className="rounded-xl border border-dashed p-8 text-center">
              <p className="text-sm font-medium text-muted-foreground">
                No items match the current "{statusFilter}" filter in this section.
              </p>
              <button
                onClick={() => setStatusFilter("all")}
                className="mt-2 text-xs font-medium text-primary hover:underline"
              >
                Reset filter to show all items
              </button>
            </div>
          ) : (
            filteredItems.map((item) => {
              const currentStatus = statuses[item.id] ?? "not_started";

              return (
                <div
                  key={item.id}
                  className={cn(
                    "group relative rounded-xl border p-4 transition-all duration-150 sm:p-5",
                    currentStatus === "completed"
                      ? "bg-card/60 border-border/80"
                      : currentStatus === "in_progress"
                        ? "bg-card border-warning/30 ring-1 ring-warning/10"
                        : "bg-card border-border hover:border-border/90",
                  )}
                >
                  <div className="flex items-start gap-3.5 sm:gap-4">
                    {/* Primary Interactive Status Toggle Icon */}
                    <button
                      onClick={() => cycleStatus(item.id)}
                      className={cn(
                        "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border transition-all focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none",
                        currentStatus === "completed"
                          ? "border-success/30 bg-success/15 text-success hover:bg-success/20"
                          : currentStatus === "in_progress"
                            ? "border-warning/30 bg-warning/15 text-warning hover:bg-warning/20"
                            : "border-border bg-muted/40 text-muted-foreground hover:border-primary/40 hover:text-foreground",
                      )}
                      aria-label={`Status: ${currentStatus.replace("_", " ")}. Click to toggle.`}
                      title="Click to cycle status: Not Started → In Progress → Completed"
                    >
                      <StatusIcon status={currentStatus} className="h-4 w-4" />
                    </button>

                    {/* Item Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h4
                          onClick={() => cycleStatus(item.id)}
                          className={cn(
                            "cursor-pointer font-display text-sm font-semibold transition-colors sm:text-base",
                            currentStatus === "completed"
                              ? "text-muted-foreground line-through decoration-border"
                              : "text-foreground hover:text-primary",
                          )}
                        >
                          {item.title}
                        </h4>

                        {/* Interactive Status Selector Buttons */}
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setExplicitStatus(item.id, "not_started")}
                            className={cn(
                              "rounded px-2 py-0.5 text-[11px] font-medium transition-colors",
                              currentStatus === "not_started"
                                ? "bg-secondary text-foreground font-semibold"
                                : "text-muted-foreground hover:bg-muted",
                            )}
                          >
                            Pending
                          </button>
                          <button
                            onClick={() => setExplicitStatus(item.id, "in_progress")}
                            className={cn(
                              "rounded px-2 py-0.5 text-[11px] font-medium transition-colors",
                              currentStatus === "in_progress"
                                ? "bg-warning/20 text-foreground font-semibold"
                                : "text-muted-foreground hover:bg-muted",
                            )}
                          >
                            In Progress
                          </button>
                          <button
                            onClick={() => setExplicitStatus(item.id, "completed")}
                            className={cn(
                              "rounded px-2 py-0.5 text-[11px] font-medium transition-colors",
                              currentStatus === "completed"
                                ? "bg-success/20 text-success font-semibold"
                                : "text-muted-foreground hover:bg-muted",
                            )}
                          >
                            Done
                          </button>
                        </div>
                      </div>

                      <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
                        {item.description}
                      </p>

                      {/* Recruiter Advice Tip */}
                      {item.tip && (
                        <div className="mt-2.5 flex items-start gap-1.5 text-xs text-muted-foreground">
                          <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                          <span>
                            <strong className="font-medium text-foreground">
                              Actionable tip:{" "}
                            </strong>
                            {item.tip}
                          </span>
                        </div>
                      )}

                      {/* Code / Text Example Box */}
                      {item.example && (
                        <div className="mt-3 rounded-lg border bg-muted/50 p-3">
                          <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
                            <span className="font-semibold text-foreground">Model Example:</span>
                            <button
                              onClick={() => copySnippet(item.example!, item.id)}
                              className="flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground hover:bg-card hover:text-foreground transition-colors"
                              title="Copy example text to clipboard"
                            >
                              {copiedId === item.id ? (
                                <>
                                  <Check className="h-3 w-3 text-success" />
                                  <span className="text-success">Copied</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="h-3 w-3" />
                                  <span>Copy</span>
                                </>
                              )}
                            </button>
                          </div>
                          <pre className="mt-1.5 overflow-x-auto whitespace-pre-wrap font-sans text-xs text-foreground/90">
                            {item.example}
                          </pre>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Section Navigation Footer */}
        <div className="mt-8 flex flex-col justify-between gap-3 border-t pt-4 sm:flex-row sm:items-center">
          <div className="text-xs text-muted-foreground">
            Current Section:{" "}
            <span className="font-medium text-foreground">{activeSection.title}</span> (
            {activeSection.items.filter((i) => statuses[i.id] === "completed").length}/
            {activeSection.items.length} criteria met)
          </div>

          <div className="flex items-center gap-2">
            {(() => {
              const currentIndex = RESUME_SECTIONS.findIndex((s) => s.id === activeSectionId);
              const nextSection = RESUME_SECTIONS[currentIndex + 1];
              if (!nextSection) {
                return (
                  <button
                    onClick={() => setActiveSectionId(RESUME_SECTIONS[0]!.id)}
                    className="flex items-center gap-1.5 rounded-lg border bg-card px-3 py-1.5 text-xs font-medium text-foreground hover:bg-accent transition-colors"
                  >
                    <span>Back to Projects</span>
                  </button>
                );
              }
              return (
                <button
                  onClick={() => setActiveSectionId(nextSection.id)}
                  className="flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  <span>Next: {nextSection.shortTitle}</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              );
            })()}
          </div>
        </div>
      </div>
    </Card>
  );
}

function StatusIcon({ status, className }: { status: ChecklistStatus; className?: string }) {
  if (status === "completed") {
    return <CheckCircle2 className={cn("text-success", className)} />;
  }
  if (status === "in_progress") {
    return <Clock className={cn("text-warning", className)} />;
  }
  return <Circle className={cn("text-muted-foreground", className)} />;
}

function SectionStatusIcon({ status, className }: { status: ChecklistStatus; className?: string }) {
  if (status === "completed") {
    return <CheckCircle2 className={cn("text-success shrink-0", className)} />;
  }
  if (status === "in_progress") {
    return <Clock className={cn("text-warning shrink-0", className)} />;
  }
  return <Circle className={cn("text-muted-foreground shrink-0", className)} />;
}

function SectionStatusBadge({ status }: { status: ChecklistStatus }) {
  if (status === "completed") {
    return (
      <span className="flex items-center gap-1 rounded-full bg-success/15 px-2 py-0.5 text-[11px] font-semibold text-success">
        <CheckCircle2 className="h-3 w-3" />
        <span>Complete</span>
      </span>
    );
  }
  if (status === "in_progress") {
    return (
      <span className="flex items-center gap-1 rounded-full bg-warning/20 px-2 py-0.5 text-[11px] font-semibold text-foreground">
        <Clock className="h-3 w-3 text-warning" />
        <span>In Progress</span>
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
      <Circle className="h-3 w-3" />
      <span>Pending</span>
    </span>
  );
}
