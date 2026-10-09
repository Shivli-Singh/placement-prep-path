import { FolderGit2, Briefcase, Code2, GraduationCap, FileCheck2 } from "lucide-react";

export type ChecklistStatus = "not_started" | "in_progress" | "completed";

export interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  tip?: string;
  example?: string;
  sectionId: "projects" | "experience" | "skills" | "education" | "ats";
}

export interface SectionDefinition {
  id: "projects" | "experience" | "skills" | "education" | "ats";
  title: string;
  shortTitle: string;
  icon: typeof FolderGit2;
  overview: string;
  recruiterInsight: string;
  items: ChecklistItem[];
}

export const RESUME_SECTIONS: SectionDefinition[] = [
  {
    id: "projects",
    title: "Projects",
    shortTitle: "Projects",
    icon: FolderGit2,
    overview:
      "Showcase 2-3 substantive software projects that demonstrate end-to-end technical mastery, architecture choices, and real utility.",
    recruiterInsight:
      "Interviewers spend 80% of technical screening time probing your projects. Avoid basic tutorial clones (e.g. standard to-do apps); highlight custom features and scale.",
    items: [
      {
        id: "proj-xyz-formula",
        sectionId: "projects",
        title: "Quantifiable Impact (XYZ Formula)",
        description:
          "Frame each project bullet using Google's XYZ formula: 'Accomplished [X] as measured by [Y], by doing [Z]'.",
        tip: "Include concrete numbers: latency reduction, user count, test coverage, or queries optimized.",
        example:
          "Engineered a real-time collaborative code editor supporting 50+ concurrent users with OT algorithms, reducing synchronization latency by 42%.",
      },
      {
        id: "proj-live-links",
        sectionId: "projects",
        title: "Live Deployment & GitHub Repositories",
        description:
          "Provide working, clickable links to deployed web apps and clean public GitHub repositories with informative README files.",
        tip: "Verify every link opens without SSL warnings or 404s. Ensure README includes setup steps and architecture diagrams.",
        example: "GitHub: github.com/username/project-name | Live Demo: project-name.vercel.app",
      },
      {
        id: "proj-tech-stack",
        sectionId: "projects",
        title: "Explicit Tech Stack Breakdown",
        description:
          "List the precise languages, frameworks, databases, and DevOps tools utilized in each project.",
        tip: "Avoid vague phrases like 'Used web technologies'. Specify React, TypeScript, Node.js, PostgreSQL, Docker, Redis.",
        example: "Stack: React 19, TypeScript, PostgreSQL, Prisma, Tailwind CSS, Jest, Docker",
      },
      {
        id: "proj-problem-solution",
        sectionId: "projects",
        title: "Clear Problem & Architectural Decisions",
        description:
          "Describe the core technical challenge and why you chose your specific architecture or database model.",
        tip: "Be prepared to explain trade-offs (e.g. why SQL vs NoSQL, or client vs server caching) in the first interview round.",
        example:
          "Designed normalized PostgreSQL schemas with B-tree indexing to process 10,000+ placement records within 120ms.",
      },
    ],
  },
  {
    id: "experience",
    title: "Experience",
    shortTitle: "Experience",
    icon: Briefcase,
    overview:
      "Document internships, open-source contributions, research fellowships, or student technical club leadership.",
    recruiterInsight:
      "Freshers without commercial internships should showcase freelance contracts, open-source PRs, or lead engineering roles in campus tech festivals.",
    items: [
      {
        id: "exp-action-verbs",
        sectionId: "experience",
        title: "Strong Action Verbs at Sentence Start",
        description:
          "Begin every bullet with strong, past-tense power verbs. Avoid weak phrasing like 'Responsible for' or 'Helped with'.",
        tip: "Use verbs like Architected, Optimized, Spearheaded, Refactored, Accelerated, Streamlined, Automated.",
        example:
          "Refactored legacy REST APIs into modular micro-endpoints, reducing server payload size by 30%.",
      },
      {
        id: "exp-reverse-chrono",
        sectionId: "experience",
        title: "Reverse Chronological Timeline",
        description:
          "Order positions starting with your most recent engagement. Clearly list company name, role title, location, and dates.",
        tip: "Use standard date format: 'June 2025 - August 2025' or 'May 2025 - Present'.",
        example:
          "Software Engineering Intern | AcroCorp Technologies, Bengaluru | May 2025 – July 2025",
      },
      {
        id: "exp-team-collaboration",
        sectionId: "experience",
        title: "Team Collaboration & Development Workflow",
        description:
          "Highlight how you interacted within team workflows: code reviews, agile sprints, Jira, CI/CD pipelines, and pull requests.",
        tip: "Demonstrates that you can integrate smoothly into an engineering organization on day one.",
        example:
          "Collaborated in a 6-person Agile squad, participating in bi-weekly sprint planning and authoring 14 reviewed PRs.",
      },
      {
        id: "exp-tangible-deliverables",
        sectionId: "experience",
        title: "Tangible Deliverables & Business Value",
        description:
          "Articulate the actual outcome delivered for clients, users, or internal team velocity.",
        tip: "Focus on the 'So What?': did it save time, reduce bugs, onboard users, or cut operational costs?",
        example:
          "Automated manual CSV intake scripts using Python, saving the operations team 6 hours of repetitive work weekly.",
      },
    ],
  },
  {
    id: "skills",
    title: "Technical Skills",
    shortTitle: "Skills",
    icon: Code2,
    overview:
      "Catalog your programming languages, developer tools, database systems, and core computer science fundamentals.",
    recruiterInsight:
      "Only write skills you can live-code in during an interview. Listing 20 languages you touched once triggers tough scrutiny from senior engineers.",
    items: [
      {
        id: "skills-categorized-groups",
        sectionId: "skills",
        title: "Categorized Technical Buckets",
        description:
          "Organize skills into logical groups: Languages, Frameworks & Libraries, Databases, Cloud & DevOps, and Developer Tools.",
        tip: "Clean groupings allow recruiters to evaluate ATS keywords in under 5 seconds.",
        example:
          "Languages: C++, Python, TypeScript, SQL\nFrameworks: React, Node.js, Express, Next.js\nDatabases: PostgreSQL, MongoDB, Redis\nTools: Git, Docker, Postman, Linux, Vite",
      },
      {
        id: "skills-core-cs",
        sectionId: "skills",
        title: "Core CS Fundamentals Included",
        description:
          "Prominently include foundational engineering topics: Data Structures & Algorithms, OOP, DBMS, OS, and Computer Networks.",
        tip: "Campus placement coding rounds heavily emphasize standard algorithms and database normalization.",
        example:
          "Core Fundamentals: Data Structures & Algorithms, Object-Oriented Design, Operating Systems, DBMS, System Design Basics",
      },
      {
        id: "skills-defendable-depth",
        sectionId: "skills",
        title: "Truthful Proficiency & Defense Readiness",
        description:
          "Ensure every language and tool listed is something you are comfortable debugging or writing on a whiteboard.",
        tip: "If you haven't touched Java in 2 years, either review it thoroughly or remove it from the top list.",
        example:
          "Self-test: Can you write a binary search or SQL JOIN query in this language without Google?",
      },
      {
        id: "skills-no-soft-skills-clutter",
        sectionId: "skills",
        title: "No Fluffy Soft-Skill Keyword Stacking",
        description:
          "Do not waste valuable resume real estate on empty claims like 'Hardworking', 'Quick Learner', or 'Team Player'.",
        tip: "Soft skills must be demonstrated through your achievements in project and club leadership bullets, not listed as keywords.",
        example:
          "Remove: 'Leadership, Punctual, Good Communicator' -> Replace with technical competencies.",
      },
    ],
  },
  {
    id: "education",
    title: "Education & Contact",
    shortTitle: "Education",
    icon: GraduationCap,
    overview:
      "Present your academic credentials, university degree, GPA, and clean clickable contact channels.",
    recruiterInsight:
      "Place your header right at the top: Name in large font, with email, phone, LinkedIn, and GitHub. No physical address or photo required for tech roles.",
    items: [
      {
        id: "edu-contact-header",
        sectionId: "education",
        title: "Clean Header & Professional Contact Channels",
        description:
          "Include full name, university email, phone number, city/state, LinkedIn profile, and active GitHub link.",
        tip: "Use customized LinkedIn and GitHub vanity URLs (e.g. linkedin.com/in/yourname) rather than raw alphanumeric strings.",
        example:
          "Ananya Sharma | Bengaluru, India | ananya.sharma@student.edu | +91 98765 43210 | linkedin.com/in/ananya | github.com/ananya",
      },
      {
        id: "edu-credentials",
        sectionId: "education",
        title: "Degree, University & Academic Standing",
        description:
          "List your Bachelor's degree, branch/major, college name, CGPA or percentage, and anticipated graduation month & year.",
        tip: "If your CGPA is above 7.5 or in the top tier, include it. If required by campus placement cell, state official percentage.",
        example:
          "B.Tech in Computer Science & Engineering | National Institute of Technology | CGPA: 8.7 / 10 | 2022 – 2026",
      },
      {
        id: "edu-coursework",
        sectionId: "education",
        title: "Relevant Coursework & Academic Honors",
        description:
          "Optionally list key university courses relevant to software development (Distributed Systems, Compiler Design, Machine Learning).",
        tip: "Include notable hackathon rankings, Dean's List honors, or competitive programming ratings (e.g. LeetCode / CodeChef).",
        example:
          "Achievements: Top 5% in College Hackathon 2025; LeetCode Knight (Rating 1850+); Finalist in Smart India Hackathon",
      },
    ],
  },
  {
    id: "ats",
    title: "ATS & Formatting Review",
    shortTitle: "ATS Review",
    icon: FileCheck2,
    overview:
      "Verify that your resume passes automated Applicant Tracking Systems (ATS) and human recruiter 6-second scans.",
    recruiterInsight:
      "Recruiters scan resumes in 6 to 8 seconds. Clean typography, single-column flow, and consistent margins prevent automatic rejection.",
    items: [
      {
        id: "ats-single-page",
        sectionId: "ats",
        title: "Strict Single Page Discipline",
        description:
          "Keep the document to exactly one single page for undergraduate and fresher campus placements.",
        tip: "Adjust margins (0.5 to 0.75 in) and line heights slightly if needed. Never allow a lone 3-line overflow on page 2.",
        example: "Target: 1 full page (approx. 400-500 words), zero trailing second page.",
      },
      {
        id: "ats-single-column",
        sectionId: "ats",
        title: "ATS-Friendly Single Column Format",
        description:
          "Use a standard top-to-bottom single-column hierarchy. Avoid multi-column magazine layouts, tables, or floating text boxes.",
        tip: "Parser software often misreads multi-column tables, merging contact info with project descriptions.",
        example:
          "Hierarchy: Header -> Education -> Technical Skills -> Experience -> Projects -> Achievements",
      },
      {
        id: "ats-consistent-styling",
        sectionId: "ats",
        title: "Consistent Typography, Margins & PDF Export",
        description:
          "Use standard fonts (10-11pt body text, 14-16pt headings), consistent bullet point styles, and export as searchable PDF.",
        tip: "Test searchability by pressing Ctrl+F in your exported PDF and searching for key skills.",
        example:
          "Font: Manrope, Arial, or Calibri; 0.5in margins; PDF format named 'Firstname_Lastname_Resume.pdf'.",
      },
    ],
  },
];

export const DEFAULT_RESUME_STATUS_MAP: Record<string, ChecklistStatus> = {
  "proj-xyz-formula": "in_progress",
  "proj-live-links": "completed",
  "proj-tech-stack": "completed",
  "proj-problem-solution": "not_started",
  "exp-action-verbs": "in_progress",
  "exp-reverse-chrono": "completed",
  "exp-team-collaboration": "not_started",
  "exp-tangible-deliverables": "not_started",
  "skills-categorized-groups": "completed",
  "skills-core-cs": "completed",
  "skills-defendable-depth": "in_progress",
  "skills-no-soft-skills-clutter": "completed",
  "edu-contact-header": "completed",
  "edu-credentials": "completed",
  "edu-coursework": "not_started",
  "ats-single-page": "in_progress",
  "ats-single-column": "completed",
  "ats-consistent-styling": "in_progress",
};
