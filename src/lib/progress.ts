import { useEffect } from "react";
import { courses as baseCourses } from "./data";
import { courseContent, defaultDoneLessons } from "./lessons";
import { useLocal } from "./store";
import { useAuth } from "./auth-context";
import { fetchRemoteLessonProgress, syncRemoteLessonProgress } from "./supabase";
import { getFirebaseLessonProgress, syncFirebaseLesson } from "./firebase";

export function useLessonProgress() {
  const { user, firebaseUser } = useAuth();
  const [done, setDone, ready] = useLocal<string[]>("pp-lessons", defaultDoneLessons);

  // Sync from Supabase or Firebase on login
  useEffect(() => {
    if (firebaseUser && ready) {
      getFirebaseLessonProgress(firebaseUser.uid)
        .then((remote) => {
          if (remote && remote.length > 0) {
            const merged = Array.from(new Set([...done, ...remote]));
            setDone(merged);
          }
        })
        .catch((err) => console.warn("Firebase lesson sync error:", err));
    }
    if (user && ready) {
      fetchRemoteLessonProgress(user.id).then((remote) => {
        if (remote && remote.length > 0) {
          const merged = Array.from(new Set([...done, ...remote]));
          setDone(merged);
        } else if (done.length > 0) {
          done.forEach((id) => syncRemoteLessonProgress(user.id, id, true));
        }
      });
    }
  }, [user, firebaseUser, ready]); // eslint-disable-line react-hooks/exhaustive-deps

  const toggle = (id: string) => {
    const isNowDone = !done.includes(id);
    setDone(isNowDone ? [...done, id] : done.filter((d) => d !== id));
    if (user) {
      syncRemoteLessonProgress(user.id, id, isNowDone);
    }
    if (firebaseUser) {
      syncFirebaseLesson(firebaseUser.uid, id, isNowDone).catch((err) =>
        console.warn("Firebase lesson toggle error:", err),
      );
    }
  };

  const courses = baseCourses.map((c) => {
    const lessons = courseContent[c.id]!.lessons;
    return {
      ...c,
      lessons: lessons.length,
      done: lessons.filter((l) => done.includes(l.id)).length,
    };
  });
  return { done, toggle, courses, ready };
}
