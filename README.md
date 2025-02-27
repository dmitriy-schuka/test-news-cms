# Test News CMS

A news management system with RSS import. Built with Remix, Vite, Prisma, and Docker.

## Installation & Setup

### 1. Install Dependencies
```sh
npm install
```

### 2. Run in Development Mode

```sh
npm run dev
```

### 3. Run in Docker

```sh
docker build -t my_app .
docker run -p 8000:8000 my_appl
```

Or start with automatic database migrations and cron jobs:

```sh
npm run start:all
```

### Scripts
npm run build — Build the project

npm run dev — Start the local development server

npm run dev:docker — Start the server on 0.0.0.0:8000 (for Docker)

npm run start — Run the production server

npm run typecheck — TypeScript type checking

npm run lint — Lint the code

npm run lint:fix — Fix linting errors

npm run db:migrate — Run database migrations

npm run db:seed — Seed the database with initial data

npm run cron — Run scheduled cron jobs

### Initial Data
When running npm run db:seed, the following data is created:

- Administrator

  email: admin@gmail.com
  
  default password: admin
  
- Test RSS Source
  
  url: https://feeds.bbci.co.uk/news/rss.xml


### Project Structure
prisma/ — Database schema and migrations

app/ — Main application code

app/cron/ — Scheduled tasks

prisma/seed.ts — Initial data seeding script