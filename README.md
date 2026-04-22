 Blog Project – Full Stack Application

A full-stack blog application built using modern web technologies, allowing users to create, view, and manage blog posts through a clean frontend interface and a scalable backend API.

This project demonstrates real-world full-stack development with proper separation of concerns, database integration, and modern tooling.

 Features

Create, read, update, and delete blog posts (CRUD)

RESTful API architecture

Type-safe backend using TypeScript

Database integration using Prisma ORM

Clean and responsive frontend built with Vite

Scalable project structure (frontend & backend separated)

 Tech Stack
Frontend

Vite

HTML

CSS

TypeScript

Backend

Node.js

Express.js

TypeScript

Prisma ORM

Database

MySQL

Tools & Utilities

Git & GitHub

VS Code

ESLint

️ Setup Instructions
1️⃣ Clone the repository
git clone https://github.com/nagratana/blog-project.git
cd blog-project

 Backend Setup (blog-api)
cd blog-api
npm install

Configure environment variables

Create a .env file inside blog-api:

DATABASE_URL="mysql://username:password@localhost:3306/blog_db"

Run Prisma
npx prisma generate
npx prisma migrate dev

Start backend server
npm run dev


Backend will run on:

http://localhost:3000

 Frontend Setup (blog-frontend)
cd blog-frontend
npm install
npm run dev


Frontend will run on:

http://localhost:5173

 Future Enhancements

User authentication (JWT)

Role-based access (Admin/User)

Blog comments and likes

Image upload support

Deployment (Render / Railway / Vercel)

 Project Purpose

This project was developed as a college mini project to gain hands-on experience in:

Full-stack web development

REST API design

Database modeling using Prisma

Frontend–backend integration

Git & GitHub workflows

 Author

Nagratana
CSE – Data Science
India 

GitHub: https://github.com/nagratana

 If you like this project, don’t forget to star the repo!
