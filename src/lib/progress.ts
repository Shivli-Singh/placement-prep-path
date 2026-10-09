import { courses as baseCourses } from "./data";
import { courseContent, defaultDoneLessons } from "./lessons";
import { useLocal } from "./store";

export function useLessonProgress() {
  const [done, setDone, ready] = useLocal<string[]>("pp-lessons", defaultDoneLessons);
  const toggle = (id: string) => setDone(done.includes(id) ? done.filter((d) => d !== id) : [...done, id]);
  const courses = baseCourses.map((c) => {
    const lessons = courseContent[c.id].lessons;
    return { ...c, lessons: lessons.length, done: lessons.filter((l) => done.includes(l.id)).length };
  });
  return { done, toggle, courses, ready };
}
