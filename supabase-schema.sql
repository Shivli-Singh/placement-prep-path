-- ==============================================================================
-- Placement Training LMS: Supabase Schema & Row Level Security (RLS) Policies
-- ==============================================================================
-- Run this script in your Supabase SQL Editor:
-- Dashboard -> SQL Editor -> New Query -> Paste & Run
-- ==============================================================================

-- 1. Create profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  college TEXT NOT NULL DEFAULT '',
  branch TEXT NOT NULL DEFAULT '',
  year TEXT NOT NULL DEFAULT '3rd Year',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Auto-create profile trigger on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, college, branch, year)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'college', ''),
    COALESCE(NEW.raw_user_meta_data->>'branch', ''),
    COALESCE(NEW.raw_user_meta_data->>'year', '3rd Year')
  )
  ON CONFLICT (id) DO UPDATE
  SET email = EXCLUDED.email;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- 2. Create practice_questions table (coding questions)
CREATE TABLE IF NOT EXISTS public.practice_questions (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  topic TEXT NOT NULL,
  company TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('Beginner', 'Easy', 'Medium', 'Hard', 'Advanced')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.practice_questions ENABLE ROW LEVEL SECURITY;

-- Anyone authenticated or anonymous can read practice questions
CREATE POLICY "Public read practice questions"
  ON public.practice_questions FOR SELECT
  TO public
  USING (true);

-- Authenticated users can insert/seed questions
CREATE POLICY "Authenticated users can insert practice questions"
  ON public.practice_questions FOR INSERT
  TO authenticated
  WITH CHECK (true);


-- 3. Create quiz_questions table (MCQs for aptitude & technical quiz)
CREATE TABLE IF NOT EXISTS public.quiz_questions (
  id TEXT PRIMARY KEY,
  q TEXT NOT NULL,
  options JSONB NOT NULL,
  answer INT NOT NULL,
  topic TEXT NOT NULL,
  explain TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read quiz questions"
  ON public.quiz_questions FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert quiz questions"
  ON public.quiz_questions FOR INSERT
  TO authenticated
  WITH CHECK (true);


-- 4. Create quiz_attempts table (stores student scores and history)
CREATE TABLE IF NOT EXISTS public.quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  score INT NOT NULL,
  total INT NOT NULL,
  topic TEXT NOT NULL DEFAULT 'All',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own quiz attempts"
  ON public.quiz_attempts FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own quiz attempts"
  ON public.quiz_attempts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);


-- 5. Create student_lesson_progress table (tracks completed lessons)
CREATE TABLE IF NOT EXISTS public.student_lesson_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id TEXT NOT NULL,
  course_id TEXT NOT NULL DEFAULT '',
  completed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, lesson_id)
);

ALTER TABLE public.student_lesson_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own lesson progress"
  ON public.student_lesson_progress FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own lesson progress"
  ON public.student_lesson_progress FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own lesson progress"
  ON public.student_lesson_progress FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);


-- 6. Create student_roadmap_progress table
CREATE TABLE IF NOT EXISTS public.student_roadmap_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  task_id TEXT NOT NULL,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, task_id)
);

ALTER TABLE public.student_roadmap_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own roadmap tasks"
  ON public.student_roadmap_progress FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own roadmap tasks"
  ON public.student_roadmap_progress FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own roadmap tasks"
  ON public.student_roadmap_progress FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);


-- 7. Create student_resume_checklist table
CREATE TABLE IF NOT EXISTS public.student_resume_checklist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  item_id TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('not_started', 'in_progress', 'completed')),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, item_id)
);

ALTER TABLE public.student_resume_checklist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own resume checklist"
  ON public.student_resume_checklist FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert/update their own resume checklist"
  ON public.student_resume_checklist FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);


-- ==============================================================================
-- Initial Seed Data: Practice & Quiz Questions
-- ==============================================================================

INSERT INTO public.practice_questions (id, title, topic, company, difficulty)
VALUES
  ('pq-1', 'Two Sum', 'Arrays', 'Amazon, Google', 'Easy'),
  ('pq-2', 'Longest Substring Without Repeating Characters', 'Strings', 'Microsoft, Meta', 'Medium'),
  ('pq-3', 'Reverse Linked List', 'Linked Lists', 'Adobe, TCS Digital', 'Easy'),
  ('pq-4', 'Binary Tree Level Order Traversal', 'Trees', 'Amazon, Infosys', 'Medium'),
  ('pq-5', 'Coin Change (Min coins)', 'Dynamic Programming', 'Google, Flipkart', 'Medium'),
  ('pq-6', 'Course Schedule (Detect Cycle)', 'Graphs', 'Uber, Atlassian', 'Hard'),
  ('pq-7', 'Valid Parentheses', 'Stacks', 'TCS, Wipro, Infosys', 'Easy'),
  ('pq-8', 'Merge K Sorted Lists', 'Heaps', 'Amazon, Microsoft', 'Hard'),
  ('pq-9', 'Search in Rotated Sorted Array', 'Binary Search', 'Walmart, Adobe', 'Medium'),
  ('pq-10', 'Number of Islands', 'Graphs', 'Amazon, Bloomberg', 'Medium')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.quiz_questions (id, q, options, answer, topic, explain)
VALUES
  (
    'qq-1',
    'A train running at 54 km/hr crosses a pole in 20 seconds. What is the length of the train?',
    '["250 m", "300 m", "350 m", "400 m"]'::jsonb,
    1,
    'Quantitative',
    'Speed = 54 * (5/18) = 15 m/s. Length = Speed * Time = 15 * 20 = 300 m.'
  ),
  (
    'qq-2',
    'If A:B = 2:3 and B:C = 4:5, what is A:C?',
    '["8:15", "6:15", "8:10", "2:5"]'::jsonb,
    0,
    'Quantitative',
    'A:B:C = (2*4) : (3*4) : (3*5) = 8:12:15. So A:C = 8:15.'
  ),
  (
    'qq-3',
    'Find the missing number in the series: 3, 7, 15, 31, ?',
    '["47", "55", "63", "67"]'::jsonb,
    2,
    'Logical',
    'Pattern is n * 2 + 1: 3*2+1=7, 7*2+1=15, 15*2+1=31, 31*2+1=63.'
  ),
  (
    'qq-4',
    'Choose the antonym of CANDID:',
    '["Deceitful", "Frank", "Honest", "Straightforward"]'::jsonb,
    0,
    'Verbal',
    'Candid means frank, open, and sincere. The antonym is deceitful.'
  ),
  (
    'qq-5',
    'Which data structure uses LIFO (Last In First Out)?',
    '["Queue", "Stack", "Array", "Linked List"]'::jsonb,
    1,
    'Technical',
    'A Stack operates on the LIFO principle, where elements added last are removed first.'
  ),
  (
    'qq-6',
    'What is the worst-case time complexity of QuickSort?',
    '["O(n log n)", "O(n)", "O(n²)", "O(log n)"]'::jsonb,
    2,
    'Technical',
    'QuickSort degrades to O(n²) when the pivot chosen is always the smallest or largest element.'
  ),
  (
    'qq-7',
    'In SQL, which clause is used to filter groups created by GROUP BY?',
    '["WHERE", "HAVING", "FILTER", "ORDER BY"]'::jsonb,
    1,
    'Technical',
    'The HAVING clause is evaluated after grouping to filter grouped rows; WHERE filters before grouping.'
  ),
  (
    'qq-8',
    'Which normal form eliminates partial dependency on a composite primary key?',
    '["1NF", "2NF", "3NF", "BCNF"]'::jsonb,
    1,
    'Technical',
    '2NF requires the table to be in 1NF and have no non-prime attribute dependent on a subset of any candidate key.'
  )
ON CONFLICT (id) DO NOTHING;
