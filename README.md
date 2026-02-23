```text
+----------------------------------------------------------------------+
|   ____   ___  ____ _____ _____ ___  _     ___ ___      ____  _   _   |
|  |  _ \ / _ \|  _ \_   _|  ___/ _ \| |   |_ _/ _ \    / ___|| | | |  |
|  | |_) | | | | |_) || | | |_ | | | | |    | | | | |   \___ \| | | |  |
|  |  __/| |_| |  _ < | | |  _|| |_| | |___ | | |_| |    ___) | |_| |  |
|  |_|    \___/|_| \_\|_| |_|   \___/|_____|___\___/    |____/ \___/   |
|                                                                      |
|              FullStack Portfolio built for real-world impact         |
+----------------------------------------------------------------------+
```

<p align="center">
  <b>Portfolio GUI Next.js</b><br/>
  Professional portfolio experience with modern animations, 3D background, and production-ready contact flow.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js" alt="Next.js 15"/>
  <img src="https://img.shields.io/badge/React-19-20232A?style=for-the-badge&logo=react" alt="React 19"/>
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript 5"/>
  <img src="https://img.shields.io/badge/Tailwind-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS 4"/>
  <img src="https://img.shields.io/badge/Framer%20Motion-Animations-black?style=for-the-badge&logo=framer" alt="Framer Motion"/>
</p>

<p align="center">
  <a href="https://juanmigueldev.vercel.app/">Live Demo</a> |
  <a href="#quick-start">Quick Start</a> |
  <a href="#project-structure">Project Structure</a> |
  <a href="#author">Author</a>
</p>

---

## About This Repository

This repository contains my personal full-stack portfolio, designed to showcase services, projects, and professional experience through a high-quality, animated, and responsive interface.

It is focused on:

- High-impact visual presentation.
- Clean component architecture.
- Real contact workflow using API routes + SMTP.
- Production deployment readiness.

## Core Highlights

- Next.js 15 with App Router architecture.
- Advanced UI motion with Framer Motion.
- 3D star background using React Three Fiber + Drei.
- Project showcase with featured project, filters, and technology tags.
- Contact form connected to an email pipeline via Nodemailer.
- Responsive design for desktop and mobile.

## Tech Stack

- Framework: `Next.js 15`
- Language: `TypeScript`
- UI: `React 19`, `Tailwind CSS 4`
- Motion: `Framer Motion`
- 3D: `three`, `@react-three/fiber`, `@react-three/drei`, `maath`
- Icons: `lucide-react`, `@heroicons/react`
- Email backend: `Nodemailer`

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables (for local email endpoint)

Create `.env.local`:

```env
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

### 3. Run development server

```bash
npm run dev
```

Open `http://localhost:3000`.

## Scripts

- `npm run dev` -> Starts local development server (Turbopack).
- `npm run build` -> Builds production bundle.
- `npm run start` -> Starts production server.
- `npm run lint` -> Runs ESLint checks.

## Contact API

Local endpoint:

- `POST /api/contact`

Expected JSON body:

- `name`
- `email`
- `subject`
- `type` (`inquiry` | `service`)
- `message`

Important:

- In `src/components/main/Contact.tsx`, the form is currently calling:
  `https://juanmigueldev.vercel.app/api/contact`
- If you want to use local API during development, change it to:
  `/api/contact`

## Project Structure

```txt
src/
  app/
    api/contact/route.ts
    globals.css
    layout.tsx
    page.tsx
  components/
    main/
      About.tsx
      Contact.tsx
      Footer.tsx
      Hero.tsx
      Navbar.tsx
      Projects.tsx
      Services.tsx
      StarBackground.tsx
    sub/
      AnimationProvider.tsx
      HeroContent.tsx
      ProjectCard.tsx
  utils/
    motion.ts
public/
```

## Deployment

Recommended platform: **Vercel**

Steps:

1. Import the repository into Vercel.
2. Configure environment variables (`EMAIL_USER`, `EMAIL_PASS`).
3. Deploy.

## Author

**Juan Miguel Leon Gomez - FullStack Developer**

- Portfolio: `https://juanmigueldev.vercel.app/`
- LinkedIn: `https://www.linkedin.com/in/juanmigueldev/`
- GitHub: `https://github.com/Juanm0331123`
- Email: `juanmiguelleon5@gmail.com`

## License

This is a personal portfolio project intended for professional showcase and reference.
