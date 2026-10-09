# Placement Prep Path

Build a modern, responsive full-stack web application called "PlacePrep – Placement Training LMS for College Students".

PROBLEM:
College students often struggle to prepare for campus placements because learning resources, aptitude practice, coding practice, interview preparation, and progress tracking are scattered across different platforms.

SOLUTION:
Create one centralized platform that helps college students prepare for placements through structured learning paths, practice tests, coding resources, and a personalized dashboard.

DESIGN:

- Modern, professional SaaS dashboard.
- Clean white background with navy blue and indigo accents.
- Responsive design for laptops and mobile devices.
- Sidebar navigation with simple icons.
- Professional typography, attractive cards, progress bars, and charts.
- Use realistic sample content instead of lorem ipsum.
- Keep the interface easy for first-year college students to understand.

PAGES AND FEATURES:

1. LANDING PAGE

- Product name and tagline: "Your Campus Placement Journey Starts Here."
- Explain the problem and solution.
- Highlight key features.
- Add a prominent Get Started button.
- Include a footer.

2. STUDENT DASHBOARD

- Welcome message.
- Display learning progress, completed lessons, practice test scores, and current streak.
- Show recommended activities.
- Display upcoming placement preparation tasks.
- Use clearly labeled sample statistics.

3. LEARNING PATHS

- Aptitude Preparation.
- Data Structures and Algorithms.
- Programming Fundamentals.
- Technical Interview Preparation.
- HR Interview Preparation.
- Communication Skills.
- Display course cards with difficulty, estimated duration, and progress.

4. PRACTICE CENTER

- Show coding questions by difficulty.
- Include aptitude practice questions.
- Provide topic filters and sample questions.
- Add a functional multiple-choice quiz with answer validation and score calculation.

5. PLACEMENT ROADMAP

- Organize preparation into Beginner, Intermediate, and Advanced stages.
- Show milestones and completion status.
- Allow students to mark tasks as completed.

6. PROGRESS PAGE

- Display quiz scores, completed modules, and overall learning progress.
- Use clear charts and progress indicators.

7. STUDENT PROFILE

- Display name, college, branch, and year of study.
- Allow students to update their profile.

TECHNICAL REQUIREMENTS:

- Use React, TypeScript, and Tailwind CSS.
- Use reusable components and a clean project structure.
- Use Supabase for database storage and authentication.
- Connect Supabase using its supported client library and environment variables.
- Never expose secret keys in frontend code.
- Include student authentication with sign-up, login, and logout.
- Store student profiles, courses, learning progress, and quiz attempts in Supabase.
- Use proper database relationships and secure Row Level Security policies.
- Do not pretend that database features work if they are not connected.
- Include useful loading states, empty states, error messages, and form validation.
- Make navigation and buttons functional.
- Create realistic demo data for the initial presentation.

IMPORTANT:
First build the complete responsive frontend with functional navigation and a working sample quiz. Then prepare it for Supabase integration. Keep the implementation beginner-friendly and suitable for a college hackathon demonstration.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/519b8921-6158-5f25-b3e8-e4cfd903d54c).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
