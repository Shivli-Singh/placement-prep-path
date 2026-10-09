import { useEffect, useState } from "react";

// Demo storage in the browser. Replace with database calls once the backend is connected.
export function useLocal<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) setValue(JSON.parse(raw));
    } catch {
      // Ignore JSON parse or localStorage access errors
    }
    setReady(true);
  }, [key]);
  const update = (v: T) => {
    setValue(v);
    localStorage.setItem(key, JSON.stringify(v));
  };
  return [value, update, ready] as const;
}

export type Profile = {
  name: string;
  email: string;
  college: string;
  branch: string;
  year: string;
};
export const defaultProfile: Profile = {
  name: "Ananya Sharma",
  email: "ananya.sharma@student.edu",
  college: "PES University, Bengaluru",
  branch: "Computer Science & Engineering",
  year: "3rd Year",
};

export type Attempt = { date: string; score: number; total: number };
export const defaultRoadmap = ["b1", "b2", "b3", "b5", "i1"];
