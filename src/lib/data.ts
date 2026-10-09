export type Difficulty = "Beginner" | "Intermediate" | "Advanced";

export const courses = [
  {
    id: "aptitude",
    title: "Aptitude Preparation",
    desc: "Quantitative, logical reasoning and verbal ability for written rounds.",
    difficulty: "Beginner" as Difficulty,
    hours: 24,
    lessons: 32,
    done: 22,
  },
  {
    id: "dsa",
    title: "Data Structures & Algorithms",
    desc: "Arrays, linked lists, trees, graphs and DP with interview patterns.",
    difficulty: "Advanced" as Difficulty,
    hours: 60,
    lessons: 48,
    done: 14,
  },
  {
    id: "programming",
    title: "Programming Fundamentals",
    desc: "Core C, Java and Python concepts: loops, functions, OOP basics.",
    difficulty: "Beginner" as Difficulty,
    hours: 30,
    lessons: 28,
    done: 25,
  },
  {
    id: "technical",
    title: "Technical Interview Prep",
    desc: "DBMS, OS, Computer Networks and OOP questions asked by recruiters.",
    difficulty: "Intermediate" as Difficulty,
    hours: 36,
    lessons: 30,
    done: 9,
  },
  {
    id: "hr",
    title: "HR Interview Preparation",
    desc: "Tell me about yourself, strengths, situational and salary questions.",
    difficulty: "Beginner" as Difficulty,
    hours: 8,
    lessons: 12,
    done: 4,
  },
  {
    id: "communication",
    title: "Communication Skills",
    desc: "Group discussions, email writing, and confident self-presentation.",
    difficulty: "Intermediate" as Difficulty,
    hours: 12,
    lessons: 16,
    done: 6,
  },
];

export const codingQuestions = [
  { title: "Two Sum", topic: "Arrays", difficulty: "Easy", company: "Amazon" },
  { title: "Reverse a Linked List", topic: "Linked List", difficulty: "Easy", company: "TCS" },
  { title: "Valid Parentheses", topic: "Stack", difficulty: "Easy", company: "Infosys" },
  {
    title: "Longest Substring Without Repeating Characters",
    topic: "Strings",
    difficulty: "Medium",
    company: "Microsoft",
  },
  { title: "Level Order Traversal", topic: "Trees", difficulty: "Medium", company: "Wipro" },
  { title: "Number of Islands", topic: "Graphs", difficulty: "Medium", company: "Google" },
  {
    title: "Coin Change",
    topic: "Dynamic Programming",
    difficulty: "Medium",
    company: "Accenture",
  },
  { title: "Merge K Sorted Lists", topic: "Linked List", difficulty: "Hard", company: "Flipkart" },
  {
    title: "Maximum Subarray (Kadane's)",
    topic: "Arrays",
    difficulty: "Medium",
    company: "Cognizant",
  },
  { title: "Palindrome Check", topic: "Strings", difficulty: "Easy", company: "Capgemini" },
  { title: "Climbing Stairs", topic: "Dynamic Programming", difficulty: "Easy", company: "Zoho" },
  {
    title: "Lowest Common Ancestor in BST",
    topic: "Trees",
    difficulty: "Medium",
    company: "Amazon",
  },
  { title: "Word Ladder", topic: "Graphs", difficulty: "Hard", company: "Google" },
  { title: "Trapping Rain Water", topic: "Arrays", difficulty: "Hard", company: "Adobe" },
];

export type Mcq = { q: string; options: string[]; answer: number; topic: string; explain: string };

export const quizQuestions: Mcq[] = [
  {
    topic: "Quantitative",
    q: "A train 120 m long runs at 54 km/h. How long does it take to cross a pole?",
    options: ["6 s", "8 s", "10 s", "12 s"],
    answer: 1,
    explain: "54 km/h = 15 m/s. 120 / 15 = 8 seconds.",
  },
  {
    topic: "Quantitative",
    q: "If the cost price is ₹400 and selling price is ₹500, what is the profit %?",
    options: ["20%", "25%", "15%", "30%"],
    answer: 1,
    explain: "Profit = 100. 100/400 × 100 = 25%.",
  },
  {
    topic: "Logical",
    q: "Find the next number: 2, 6, 12, 20, 30, ?",
    options: ["40", "42", "44", "36"],
    answer: 1,
    explain: "Differences are 4, 6, 8, 10, 12 → 30 + 12 = 42.",
  },
  {
    topic: "Logical",
    q: "If CAT is coded as DBU, how is DOG coded?",
    options: ["EPH", "EPG", "FPH", "DPH"],
    answer: 0,
    explain: "Each letter shifts by +1: D→E, O→P, G→H.",
  },
  {
    topic: "Verbal",
    q: "Choose the synonym of 'Diligent'.",
    options: ["Lazy", "Hardworking", "Careless", "Clever"],
    answer: 1,
    explain: "Diligent means showing care and effort in work.",
  },
  {
    topic: "Verbal",
    q: "Pick the correctly spelled word.",
    options: ["Accomodate", "Acommodate", "Accommodate", "Acomodate"],
    answer: 2,
    explain: "'Accommodate' has double c and double m.",
  },
  {
    topic: "Technical",
    q: "Which data structure uses FIFO order?",
    options: ["Stack", "Queue", "Tree", "Graph"],
    answer: 1,
    explain: "Queue: First In, First Out.",
  },
  {
    topic: "Technical",
    q: "Time complexity of binary search on a sorted array?",
    options: ["O(n)", "O(n log n)", "O(log n)", "O(1)"],
    answer: 2,
    explain: "The search space halves every step: O(log n).",
  },
  {
    topic: "Quantitative",
    q: "Average of 12, 18, 20 and 30?",
    options: ["18", "20", "22", "19"],
    answer: 1,
    explain: "Sum 80 ÷ 4 = 20.",
  },
  {
    topic: "Quantitative",
    q: "A can finish a job in 10 days, B in 15 days. Together?",
    options: ["5 days", "6 days", "8 days", "12 days"],
    answer: 1,
    explain: "1/10 + 1/15 = 1/6 → 6 days.",
  },
  {
    topic: "Quantitative",
    q: "Simple interest on ₹2,000 at 5% per year for 3 years?",
    options: ["₹200", "₹250", "₹300", "₹350"],
    answer: 2,
    explain: "SI = PRT/100 = 2000×5×3/100 = 300.",
  },
  {
    topic: "Logical",
    q: "Odd one out: 3, 5, 7, 9, 11",
    options: ["3", "7", "9", "11"],
    answer: 2,
    explain: "9 is the only non-prime.",
  },
  {
    topic: "Logical",
    q: "Facing north, you turn right twice. Which way now?",
    options: ["North", "East", "South", "West"],
    answer: 2,
    explain: "North → East → South.",
  },
  {
    topic: "Verbal",
    q: "Antonym of 'Ancient'?",
    options: ["Old", "Modern", "Historic", "Antique"],
    answer: 1,
    explain: "Ancient means very old; modern is the opposite.",
  },
  {
    topic: "Verbal",
    q: "Fill in: She ___ to college every day.",
    options: ["go", "goes", "going", "gone"],
    answer: 1,
    explain: "Third-person singular takes 'goes'.",
  },
  {
    topic: "Technical",
    q: "Which SQL command removes a table completely?",
    options: ["DELETE", "TRUNCATE", "DROP", "REMOVE"],
    answer: 2,
    explain: "DROP deletes the table structure and data.",
  },
  {
    topic: "Technical",
    q: "Which is NOT an OOP pillar?",
    options: ["Inheritance", "Compilation", "Encapsulation", "Polymorphism"],
    answer: 1,
    explain: "The four pillars don't include compilation.",
  },
  {
    topic: "Technical",
    q: "Worst-case time of quicksort?",
    options: ["O(n log n)", "O(n)", "O(n²)", "O(log n)"],
    answer: 2,
    explain: "A bad pivot every time gives O(n²).",
  },
];

export type RoadmapTask = { id: string; title: string };
export const roadmap: {
  stage: Difficulty;
  subtitle: string;
  milestones: { name: string; tasks: RoadmapTask[] }[];
}[] = [
  {
    stage: "Beginner",
    subtitle: "Semester 1–4 · Build foundations",
    milestones: [
      {
        name: "Programming basics",
        tasks: [
          { id: "b1", title: "Learn one language (C / Java / Python)" },
          { id: "b2", title: "Solve 30 basic pattern & loop problems" },
        ],
      },
      {
        name: "Aptitude foundations",
        tasks: [
          { id: "b3", title: "Percentages, ratios and averages" },
          { id: "b4", title: "Take 3 aptitude mock tests" },
        ],
      },
      { name: "Profile setup", tasks: [{ id: "b5", title: "Create a LinkedIn & GitHub profile" }] },
    ],
  },
  {
    stage: "Intermediate",
    subtitle: "Semester 5–6 · Core skills",
    milestones: [
      {
        name: "Data structures",
        tasks: [
          { id: "i1", title: "Arrays, strings and linked lists (50 problems)" },
          { id: "i2", title: "Stacks, queues and hashing" },
        ],
      },
      {
        name: "Core subjects",
        tasks: [
          { id: "i3", title: "Revise DBMS & SQL queries" },
          { id: "i4", title: "Revise OS & Computer Networks" },
        ],
      },
      { name: "Projects", tasks: [{ id: "i5", title: "Build 2 projects and write a resume" }] },
    ],
  },
  {
    stage: "Advanced",
    subtitle: "Semester 7 · Placement ready",
    milestones: [
      {
        name: "Advanced DSA",
        tasks: [
          { id: "a1", title: "Trees, graphs and dynamic programming" },
          { id: "a2", title: "Solve 20 company-tagged problems" },
        ],
      },
      {
        name: "Interviews",
        tasks: [
          { id: "a3", title: "Give 3 mock technical interviews" },
          { id: "a4", title: "Prepare HR answers & a 1-min intro" },
        ],
      },
      { name: "Applications", tasks: [{ id: "a5", title: "Apply to 10 placement drives" }] },
    ],
  },
];

export const sampleQuizHistory = [
  { name: "Week 1", score: 55 },
  { name: "Week 2", score: 62 },
  { name: "Week 3", score: 58 },
  { name: "Week 4", score: 71 },
  { name: "Week 5", score: 76 },
  { name: "Week 6", score: 82 },
];

export const upcomingTasks = [
  { title: "TCS NQT mock test", due: "Tomorrow, 10:00 AM", tag: "Test" },
  { title: "Finish 'Trees' module in DSA", due: "Oct 12", tag: "Learning" },
  { title: "Mock HR interview with peer", due: "Oct 14", tag: "Interview" },
  { title: "Update resume with new project", due: "Oct 16", tag: "Profile" },
];
