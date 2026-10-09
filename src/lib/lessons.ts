import type { Mcq } from "./data";

export type Lesson = { id: string; title: string; minutes: number; body: string[]; tip: string };
type Content = { lessons: Lesson[]; questions: Mcq[] };

const L = (id: string, title: string, minutes: number, body: string[], tip: string): Lesson => ({
  id,
  title,
  minutes,
  body,
  tip,
});

export const courseContent: Record<string, Content> = {
  aptitude: {
    lessons: [
      L(
        "apt-1",
        "Percentages made easy",
        15,
        [
          "A percentage is a fraction of 100. To find x% of y, compute (x × y) / 100.",
          "Percentage change = (New − Old) / Old × 100. An increase of 20% followed by a decrease of 20% gives a net 4% loss, not zero.",
        ],
        "Memorise fraction equivalents: 1/8 = 12.5%, 1/6 = 16.66%, 1/3 = 33.33%.",
      ),
      L(
        "apt-2",
        "Profit, loss and discount",
        20,
        [
          "Profit % = (SP − CP) / CP × 100. Loss % uses the same formula with CP − SP.",
          "Discount is always calculated on the marked price, not the cost price.",
        ],
        "When two successive discounts a% and b% are given, net = a + b − ab/100.",
      ),
      L(
        "apt-3",
        "Time, speed and distance",
        20,
        [
          "Distance = Speed × Time. Convert km/h to m/s by multiplying by 5/18.",
          "When two objects move towards each other, add their speeds (relative speed).",
        ],
        "A train crossing a pole covers its own length; crossing a platform covers both lengths.",
      ),
      L(
        "apt-4",
        "Number series",
        15,
        [
          "Look at the differences between terms first. If they aren't constant, check the second differences.",
          "Common patterns: squares, cubes, primes, alternating series, and ×2 +1 patterns.",
        ],
        "Write differences under the series — most patterns appear within 30 seconds.",
      ),
      L(
        "apt-5",
        "Coding–decoding",
        15,
        [
          "Letters are often shifted by a fixed number. Write A=1 … Z=26 to spot the shift.",
          "Some codes reverse the word or use opposite letters (A↔Z, B↔Y).",
        ],
        "Opposite letter pairs sum to 27: A(1)+Z(26), B(2)+Y(25).",
      ),
      L(
        "apt-6",
        "Syllogisms & blood relations",
        20,
        [
          "For syllogisms, draw Venn diagrams for each statement and check every possible case.",
          "For blood relations, draw a family tree using + for male and − for female.",
        ],
        "'Some' never implies 'All'. Only conclude what must be true in every diagram.",
      ),
    ],
    questions: [
      {
        topic: "Aptitude",
        q: "What is 15% of 240?",
        options: ["32", "36", "38", "40"],
        answer: 1,
        explain: "240 × 15 / 100 = 36.",
      },
      {
        topic: "Aptitude",
        q: "A price rises by 10% and then falls by 10%. Net change?",
        options: ["0%", "1% gain", "1% loss", "2% loss"],
        answer: 2,
        explain: "10 − 10 − (10×10)/100 = −1%.",
      },
      {
        topic: "Aptitude",
        q: "Convert 72 km/h to m/s.",
        options: ["15", "20", "25", "18"],
        answer: 1,
        explain: "72 × 5/18 = 20 m/s.",
      },
      {
        topic: "Aptitude",
        q: "Next term: 1, 4, 9, 16, 25, ?",
        options: ["30", "36", "35", "49"],
        answer: 1,
        explain: "Perfect squares: 6² = 36.",
      },
      {
        topic: "Aptitude",
        q: "A's mother is B's sister. B is A's ___?",
        options: ["Uncle/Aunt", "Brother", "Father", "Cousin"],
        answer: 0,
        explain: "Your mother's sibling is your uncle or aunt.",
      },
    ],
  },
  dsa: {
    lessons: [
      L(
        "dsa-1",
        "Big-O notation",
        20,
        [
          "Big-O describes how runtime grows with input size n. Drop constants: O(2n) is O(n).",
          "Common orders: O(1) < O(log n) < O(n) < O(n log n) < O(n²) < O(2ⁿ).",
        ],
        "Nested loops over the same array usually mean O(n²).",
      ),
      L(
        "dsa-2",
        "Arrays & two pointers",
        25,
        [
          "Arrays give O(1) access by index but O(n) insertion in the middle.",
          "Two pointers: start one at each end of a sorted array and move them inward to find pairs.",
        ],
        "Two Sum on a sorted array is a classic two-pointer problem.",
      ),
      L(
        "dsa-3",
        "Hashing",
        20,
        [
          "A hash map stores key → value pairs with average O(1) lookup.",
          "Use it to count frequencies, detect duplicates and remember seen elements.",
        ],
        "If brute force is O(n²), ask: can a hash map make it O(n)?",
      ),
      L(
        "dsa-4",
        "Linked lists",
        25,
        [
          "Each node stores data and a pointer to the next node. Insertion at head is O(1).",
          "Fast & slow pointers detect cycles and find the middle node.",
        ],
        "Always handle the empty list and single-node cases.",
      ),
      L(
        "dsa-5",
        "Stacks & queues",
        20,
        [
          "Stack = LIFO (push/pop). Used for undo, parentheses matching and DFS.",
          "Queue = FIFO (enqueue/dequeue). Used for BFS and scheduling.",
        ],
        "Valid Parentheses is solved with a stack in O(n).",
      ),
      L(
        "dsa-6",
        "Trees & binary search trees",
        30,
        [
          "A binary tree node has up to two children. Traversals: inorder, preorder, postorder, level order.",
          "In a BST, left < root < right, so search takes O(log n) when balanced.",
        ],
        "Inorder traversal of a BST gives sorted output.",
      ),
      L(
        "dsa-7",
        "Graphs: BFS & DFS",
        30,
        [
          "Graphs are stored as adjacency lists. BFS uses a queue; DFS uses recursion or a stack.",
          "BFS finds the shortest path in unweighted graphs.",
        ],
        "'Number of Islands' = count DFS calls on a grid.",
      ),
      L(
        "dsa-8",
        "Intro to dynamic programming",
        30,
        [
          "DP solves problems by storing answers to overlapping subproblems.",
          "Steps: define state, write recurrence, set base cases, choose top-down or bottom-up.",
        ],
        "Start with Fibonacci, then Climbing Stairs, then Coin Change.",
      ),
    ],
    questions: [
      {
        topic: "DSA",
        q: "Time complexity of accessing arr[i]?",
        options: ["O(1)", "O(n)", "O(log n)", "O(n²)"],
        answer: 0,
        explain: "Arrays allow direct index access.",
      },
      {
        topic: "DSA",
        q: "Which structure is used for BFS?",
        options: ["Stack", "Queue", "Heap", "Array"],
        answer: 1,
        explain: "BFS visits nodes level by level using a queue.",
      },
      {
        topic: "DSA",
        q: "Inorder traversal of a BST gives…",
        options: ["Random order", "Reverse order", "Sorted order", "Level order"],
        answer: 2,
        explain: "Left → root → right yields ascending order.",
      },
      {
        topic: "DSA",
        q: "Best way to detect a cycle in a linked list?",
        options: ["Sorting", "Fast & slow pointers", "Binary search", "Recursion only"],
        answer: 1,
        explain: "Floyd's algorithm: pointers meet if there is a cycle.",
      },
      {
        topic: "DSA",
        q: "Average lookup time in a hash map?",
        options: ["O(n)", "O(log n)", "O(1)", "O(n log n)"],
        answer: 2,
        explain: "Hashing gives constant average lookup.",
      },
    ],
  },
  programming: {
    lessons: [
      L(
        "prg-1",
        "Variables & data types",
        15,
        [
          "Variables store values. Common types: int, float, char, boolean, string.",
          "In C and Java you declare the type; in Python it's inferred.",
        ],
        "Know the size of int (4 bytes) and char (1 byte in C, 2 in Java).",
      ),
      L(
        "prg-2",
        "Conditions & loops",
        20,
        [
          "if / else if / else choose between paths. for, while and do-while repeat code.",
          "do-while always runs at least once.",
        ],
        "Pattern-printing questions test nested loops — practise 10 of them.",
      ),
      L(
        "prg-3",
        "Functions & recursion",
        20,
        [
          "Functions break code into reusable blocks. Recursion is a function calling itself.",
          "Every recursion needs a base case, or it causes a stack overflow.",
        ],
        "Factorial and Fibonacci are the most asked recursion examples.",
      ),
      L(
        "prg-4",
        "Arrays & strings",
        20,
        [
          "Arrays hold fixed-size elements of one type. Strings are character sequences.",
          "In Java, Strings are immutable; use StringBuilder for repeated changes.",
        ],
        "Practise: reverse a string, check palindrome, count vowels.",
      ),
      L(
        "prg-5",
        "OOP: the four pillars",
        25,
        [
          "Encapsulation, Abstraction, Inheritance and Polymorphism.",
          "Overloading = same name, different parameters (compile time). Overriding = subclass redefines a method (run time).",
        ],
        "Be ready with a real-life example for each pillar.",
      ),
    ],
    questions: [
      {
        topic: "Programming",
        q: "Which loop always executes at least once?",
        options: ["for", "while", "do-while", "foreach"],
        answer: 2,
        explain: "do-while checks the condition after the body.",
      },
      {
        topic: "Programming",
        q: "Missing base case in recursion causes…",
        options: ["Syntax error", "Stack overflow", "Faster code", "Nothing"],
        answer: 1,
        explain: "Calls never stop, exhausting the call stack.",
      },
      {
        topic: "Programming",
        q: "Method overriding is an example of…",
        options: [
          "Encapsulation",
          "Compile-time polymorphism",
          "Run-time polymorphism",
          "Abstraction",
        ],
        answer: 2,
        explain: "The method chosen is decided at run time.",
      },
      {
        topic: "Programming",
        q: "In Java, String objects are…",
        options: ["Mutable", "Immutable", "Primitive", "Arrays"],
        answer: 1,
        explain: "Changes create new String objects.",
      },
    ],
  },
  technical: {
    lessons: [
      L(
        "tec-1",
        "DBMS: keys & normalization",
        25,
        [
          "Primary key uniquely identifies a row; foreign key links to another table.",
          "1NF: atomic values. 2NF: no partial dependency. 3NF: no transitive dependency.",
        ],
        "Explain normalization with a Student–Course example.",
      ),
      L(
        "tec-2",
        "SQL queries you must know",
        25,
        [
          "SELECT, WHERE, GROUP BY, HAVING, ORDER BY and JOINs.",
          "INNER JOIN returns matching rows; LEFT JOIN keeps all rows from the left table.",
        ],
        "Practise: second highest salary, and counting employees per department.",
      ),
      L(
        "tec-3",
        "Operating systems basics",
        25,
        [
          "Process = program in execution; thread = lightweight unit inside a process.",
          "Deadlock needs four conditions: mutual exclusion, hold & wait, no preemption, circular wait.",
        ],
        "Know FCFS, SJF and Round Robin scheduling.",
      ),
      L(
        "tec-4",
        "Computer networks",
        25,
        [
          "OSI has 7 layers: Physical, Data Link, Network, Transport, Session, Presentation, Application.",
          "TCP is reliable and connection-oriented; UDP is fast and connectionless.",
        ],
        "Be ready to explain what happens when you type a URL in a browser.",
      ),
      L(
        "tec-5",
        "Explaining your projects",
        20,
        [
          "Use the STAR format: Situation, Task, Action, Result.",
          "Know your tech stack, your role, a challenge you faced and how you solved it.",
        ],
        "Interviewers dig deep into projects — never list one you can't explain.",
      ),
    ],
    questions: [
      {
        topic: "Technical",
        q: "Which normal form removes transitive dependency?",
        options: ["1NF", "2NF", "3NF", "BCNF"],
        answer: 2,
        explain: "3NF removes transitive dependencies.",
      },
      {
        topic: "Technical",
        q: "Which protocol is connectionless?",
        options: ["TCP", "UDP", "HTTP", "FTP"],
        answer: 1,
        explain: "UDP sends without establishing a connection.",
      },
      {
        topic: "Technical",
        q: "How many layers in the OSI model?",
        options: ["4", "5", "7", "8"],
        answer: 2,
        explain: "Physical up to Application = 7 layers.",
      },
      {
        topic: "Technical",
        q: "Which is NOT a deadlock condition?",
        options: ["Mutual exclusion", "Circular wait", "Preemption", "Hold and wait"],
        answer: 2,
        explain: "The condition is *no* preemption.",
      },
      {
        topic: "Technical",
        q: "Which JOIN keeps all rows from the left table?",
        options: ["INNER", "LEFT", "RIGHT", "CROSS"],
        answer: 1,
        explain: "LEFT JOIN fills missing matches with NULL.",
      },
    ],
  },
  hr: {
    lessons: [
      L(
        "hr-1",
        "Tell me about yourself",
        15,
        [
          "Structure: present (studies), past (projects/achievements), future (why this role).",
          "Keep it to 60–90 seconds. Don't repeat your entire resume.",
        ],
        "Practise out loud and record yourself once.",
      ),
      L(
        "hr-2",
        "Strengths & weaknesses",
        15,
        [
          "Give a strength with a proof: 'I'm consistent — I solved 200 DSA problems in 4 months.'",
          "Pick a real weakness and show how you're improving it.",
        ],
        "Avoid fake weaknesses like 'I work too hard'.",
      ),
      L(
        "hr-3",
        "Why should we hire you?",
        10,
        [
          "Connect your skills to the job description.",
          "Mention one technical skill, one soft skill and your eagerness to learn.",
        ],
        "Research the company's products before the interview.",
      ),
      L(
        "hr-4",
        "Situational questions",
        15,
        [
          "Use STAR: describe the Situation, Task, Action you took and the Result.",
          "Common: team conflict, missed deadline, leading a group.",
        ],
        "Prepare 3 short stories from college you can adapt.",
      ),
    ],
    questions: [
      {
        topic: "HR",
        q: "Ideal length for 'Tell me about yourself'?",
        options: ["10 seconds", "60–90 seconds", "5 minutes", "As long as possible"],
        answer: 1,
        explain: "Short, structured and confident.",
      },
      {
        topic: "HR",
        q: "STAR stands for Situation, Task, Action and…",
        options: ["Review", "Result", "Reason", "Role"],
        answer: 1,
        explain: "End with the measurable result.",
      },
      {
        topic: "HR",
        q: "Best way to answer 'What is your weakness?'",
        options: [
          "Say you have none",
          "Share a real one and how you're improving",
          "Criticise your college",
          "Change the topic",
        ],
        answer: 1,
        explain: "Honesty plus a growth plan builds trust.",
      },
    ],
  },
  communication: {
    lessons: [
      L(
        "com-1",
        "Group discussion basics",
        20,
        [
          "Start, summarise or add a new angle — all three earn points.",
          "Listen actively; refer to others' points by name.",
        ],
        "Quality beats quantity: 3–4 strong points are enough.",
      ),
      L(
        "com-2",
        "Professional email writing",
        15,
        [
          "Clear subject line, polite greeting, short paragraphs, a clear request and a sign-off.",
          "Avoid slang and emojis in formal emails.",
        ],
        "Re-read every email once before sending.",
      ),
      L(
        "com-3",
        "Body language & confidence",
        15,
        [
          "Sit upright, maintain eye contact and keep a natural smile.",
          "Avoid crossing arms or fidgeting.",
        ],
        "In online interviews, look at the camera, not the screen.",
      ),
      L(
        "com-4",
        "Speaking clearly",
        15,
        [
          "Speak slowly and pause instead of saying 'um'.",
          "Structure answers: point, reason, example, point.",
        ],
        "Read an English newspaper aloud for 10 minutes a day.",
      ),
    ],
    questions: [
      {
        topic: "Communication",
        q: "A good way to stand out in a GD is to…",
        options: ["Interrupt others", "Summarise the discussion", "Stay silent", "Speak loudest"],
        answer: 1,
        explain: "Summarising shows listening and leadership.",
      },
      {
        topic: "Communication",
        q: "In an online interview, you should look at…",
        options: ["Your notes", "The camera", "Your own video", "The keyboard"],
        answer: 1,
        explain: "Looking at the camera creates eye contact.",
      },
      {
        topic: "Communication",
        q: "Which is unprofessional in a formal email?",
        options: ["Clear subject", "Polite greeting", "Emojis and slang", "Sign-off"],
        answer: 2,
        explain: "Keep formal emails clean and professional.",
      },
    ],
  },
};

export const defaultDoneLessons = [
  "apt-1",
  "apt-2",
  "apt-3",
  "apt-4",
  "dsa-1",
  "dsa-2",
  "prg-1",
  "prg-2",
  "prg-3",
  "prg-4",
  "tec-1",
  "hr-1",
  "com-1",
];
