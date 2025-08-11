---

# Ed-Tech Platform

A full-stack **Ed-Tech** platform built with **Next.js** and **TypeScript** on the frontend, and a **GraphQL API** backend.
The platform allows users to browse, enroll in, and track online courses with a seamless and responsive interface.

---

## 🚀 Features

* **User Authentication** – Login functionality for students and admins.
* **Course Management** – View, enroll, and track courses.
* **Dashboard** – Personalized user dashboard for enrolled courses.
* **GraphQL API Integration** – Efficient and flexible data fetching.
* **Dynamic Routing** – Handles course details and enrollment pages.

---

## 📂 Project Structure

```
src/
│
├── app/
│   ├── course-data/[id]       # Dynamic course data pages (via GraphQL queries)
│   ├── course-enrolled        # Enrolled course listing
│   ├── dashboard              # User dashboard
│   ├── enrolled               # List of enrolled courses
│   ├── login                  # Authentication pages
│   ├── favicon.ico            # App icon
│   ├── globals.css            # Global styles
│   ├── layout.tsx             # Root layout component
│   └── page.tsx               # Home page
│
├── lib/                       # Helper functions / GraphQL utilities
│
├── pages/api/                 # API routes (serverless GraphQL integrations)
│
├── context.tsx                # Context API setup
├── eslint.config.mjs          # ESLint configuration
├── next.config.ts             # Next.js configuration
├── package.json               # Dependencies and scripts
├── postcss.config.mjs         # PostCSS configuration
├── README.md                  # Project documentation
└── tsconfig.json              # TypeScript configuration
```

---

## 🛠️ Tech Stack

* **Next.js** – React framework for SSR & SSG.
* **TypeScript** – Strongly typed JavaScript.
* **GraphQL** – Backend API query language.
* **Apollo Client** – For consuming GraphQL APIs in the frontend.
* **PostCSS** – CSS transformations.
* **ESLint** – Code linting.
* **Context API** – State management.

---

## 📦 Installation & Setup

1. Clone the repository:

   ```bash
   git clone <repo-url>
   cd <repo-folder>
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Run the development server:

   ```bash
   npm run dev
   ```

4. Open the app:

   ```
   http://localhost:3000
   ```

---

## 🔑 Sample Credentials

For testing purposes:

```
Admin: admin@1 / admin123
User:  user@1  / user123
Test:  test@123 / test123
```

---
