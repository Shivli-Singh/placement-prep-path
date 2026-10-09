import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Card, PageHeader } from "@/components/ui-kit";
import { ResumeChecklist } from "@/components/ResumeChecklist";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type Profile } from "@/lib/store";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/_app/profile")({
  head: () => ({
    meta: [
      { title: "My Profile – PlacePrep" },
      { name: "description", content: "Update your student profile." },
      { property: "og:title", content: "My Profile – PlacePrep" },
      { property: "og:description", content: "Update your student profile." },
    ],
  }),
  component: ProfilePage,
});

const schema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(80),
  email: z.string().trim().email("Enter a valid email").max(255),
  college: z.string().trim().min(2, "College is required").max(120),
  branch: z.string().trim().min(2, "Branch is required").max(80),
  year: z.string().trim().min(1, "Year is required"),
});

const fields: { key: keyof Profile; label: string }[] = [
  { key: "name", label: "Full name" },
  { key: "email", label: "Email" },
  { key: "college", label: "College" },
  { key: "branch", label: "Branch" },
];

function ProfilePage() {
  const { profile, updateProfile } = useAuth();
  const [form, setForm] = useState(profile);
  const [errors, setErrors] = useState<Partial<Record<keyof Profile, string>>>({});

  useEffect(() => {
    setForm(profile);
  }, [profile]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const r = schema.safeParse(form);
    if (!r.success) {
      const errs: typeof errors = {};
      r.error.issues.forEach((i) => (errs[i.path[0] as keyof Profile] = i.message));
      setErrors(errs);
      return;
    }
    setErrors({});
    await updateProfile(r.data);
    toast.success("Profile updated & synchronized");
  };

  const initials = profile.name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <>
      <PageHeader title="My Profile" sub="Keep your details up to date." />
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-hero font-display text-2xl font-bold text-navy-foreground">
            {initials}
          </div>
          <h2 className="mt-3 text-lg font-semibold">{profile.name}</h2>
          <p className="text-sm text-muted-foreground">{profile.branch}</p>
          <p className="text-sm text-muted-foreground">{profile.college}</p>
          <span className="mt-3 inline-block rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
            {profile.year}
          </span>
        </Card>
        <Card className="lg:col-span-2">
          <form onSubmit={save} className="grid gap-4 sm:grid-cols-2" noValidate>
            {fields.map((f) => (
              <div key={f.key} className="space-y-1.5">
                <Label htmlFor={f.key}>{f.label}</Label>
                <Input
                  id={f.key}
                  value={form[f.key]}
                  onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                />
                {errors[f.key] && <p className="text-xs text-destructive">{errors[f.key]}</p>}
              </div>
            ))}
            <div className="space-y-1.5">
              <Label htmlFor="year">Year of study</Label>
              <select
                id="year"
                value={form.year}
                onChange={(e) => setForm({ ...form, year: e.target.value })}
                className="h-9 w-full rounded-md border bg-card px-3 text-sm"
              >
                {["1st Year", "2nd Year", "3rd Year", "4th Year"].map((y) => (
                  <option key={y}>{y}</option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <Button type="submit">Save changes</Button>
            </div>
          </form>
        </Card>
      </div>

      <div className="mt-8">
        <ResumeChecklist />
      </div>
    </>
  );
}
