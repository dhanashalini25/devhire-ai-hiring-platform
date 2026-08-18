# DevHire — AI-Powered Hiring Platform

DevHire is a full-stack hiring platform that connects candidates and recruiters through a modern job-search and application workflow.

The platform allows candidates to create profiles, discover jobs, apply for positions, and track their applications. Recruiters can create and manage jobs, view candidate applications, and update application statuses.

---

## 🚀 Features

### 👨‍💻 Candidate

- Candidate registration and login
- JWT-based authentication
- Candidate profile management
- Skills and experience information
- Resume information
- Browse available jobs
- Search jobs
- Apply for jobs
- Prevent duplicate applications
- View submitted applications
- Track application status
- View shortlisted applications

### 🧑‍💼 Recruiter

- Recruiter registration and login
- JWT-based authentication
- Recruiter profile
- Create jobs
- Manage job listings
- View applications for recruiter-owned jobs
- View candidate information
- Review candidate applications
- Update application status
- Shortlist candidates

### 🔐 Authentication

- JWT authentication
- Role-based authorization
- Candidate-only routes
- Recruiter-only routes
- Protected API endpoints

---

## 🛠️ Tech Stack

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS

### Backend

- Node.js
- Express.js
- TypeScript
- Prisma ORM

### Database

- PostgreSQL

### Authentication

- JSON Web Tokens (JWT)

### Development Tools

- Git
- GitHub
- VS Code
- npm

---

## 🏗️ Project Structure

```text
devhire-ai-hiring-platform/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── server.ts
│   │   └── ...
│   │
│   ├── prisma/
│   │   └── schema.prisma
│   │
│   ├── package.json
│   └── ...
│
├── frontend/
│   ├── app/
│   │   ├── login/
│   │   ├── candidate/
│   │   │   └── dashboard/
│   │   ├── ...
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   │
│   ├── package.json
│   └── ...
│
└── README.md
