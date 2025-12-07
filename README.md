<div align="center">
  <img src="public/logo.webp" alt="MangaFix Logo" width="128" height="128">
</div>

# MangaFix

A minimalist, high-performance manga reader designed as a legacy fix for MangaPark. Experience calm reading with aggressive caching and a distraction-free interface.

<div align="center"> 
<img src="https://img.shields.io/badge/next%20js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next JS"/>
<img src="https://img.shields.io/badge/Tailwind%20CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS"/>
<img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel"/>
</div>

## 📖 About

MangaFix is built to provide a superior reading experience by stripping away bloat and focusing on speed. It acts as a specialized frontend for manga content, utilizing advanced caching strategies to minimize latency and server load. This is directly accessing mangapark servers to fix the issue of server not returning images due to poorly maintained s10 servers.

## ✨ Features

- **⚡ Blazing Fast Performance**: 
  - Aggressive server-side caching (Next.js Data Cache) for chapters and images.
  - Client-side session caching for instant page transitions.
  - Eager image loading in the reader for stutter-free scrolling.

- **🎨 Minimalist Aesthetics**:
  - "Calm Reading" design philosophy.
  - Automatic Day/Night mode based on system preference, with manual toggle.
  - Responsive layout that adapts perfectly to Mobile and Desktop.

- **🔍 Smart Search**:
  - Debounced "Search-as-you-type" functionality.
  - Cached search results for popular queries.
  - Clean floating search interface.

- **📱 Optimized Reader**:
  - Vertical scroll reader designed for continuity.
  - Smart chapter navigation with preload hints.
  - Distraction-free full-width reading mode.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **State Management**: React Hooks + SessionStorage
- **Data Fetching**: Native Fetch API with Caching
- **Deployment**: [Vercel](https://vercel.com/)

## 🚀 Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## ⚙️ Configuration

The project uses `next.config.mjs` to handle image optimization for remote domains. Ensure you have the correct remote patterns set up if you are pointing to different image caching servers.
