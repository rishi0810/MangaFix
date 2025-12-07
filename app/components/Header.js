"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter, useParams } from "next/navigation";

export default function Header() {
  const [darkMode, setDarkMode] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();

  useEffect(() => {
    const isDark =
      localStorage.getItem("theme") === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);

    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    if (newMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  let backButton = null;

  const BackIcon = () => (
    <div className="w-10 h-10 rounded-full bg-[hsl(var(--muted))] hover:bg-[hsl(var(--accent))] border border-[hsl(var(--border))] flex items-center justify-center transition-colors shadow-sm group">
      <svg
        viewBox="0 0 52 52"
        className="w-5 h-5 text-[hsl(var(--muted-foreground))] group-hover:text-[hsl(var(--foreground))] transition-colors"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="0"
      >
        <path d="M50,24H6.83L27.41,3.41a2,2,0,0,0,0-2.82,2,2,0,0,0-2.82,0l-24,24a1.79,1.79,0,0,0-.25.31A1.19,1.19,0,0,0,.25,25c0,.07-.07.13-.1.2l-.06.2a.84.84,0,0,0,0,.17,2,2,0,0,0,0,.78.84.84,0,0,0,0,.17l.06.2c0,.07.07.13.1.2a1.19,1.19,0,0,0,.09.15,1.79,1.79,0,0,0,.25.31l24,24a2,2,0,1,0,2.82-2.82L6.83,28H50a2,2,0,0,0,0-4Z" />
      </svg>
    </div>
  );

  if (pathname.startsWith("/comic/")) {
    backButton = (
      <button
        onClick={() => router.push("/")}
        className="focus:outline-none"
        aria-label="Back to Home"
      >
        <BackIcon />
      </button>
    );
  } else if (pathname.startsWith("/read/")) {
    const comicId = params?.comicId;
    if (comicId) {
      backButton = (
        <button
          onClick={() => router.push(`/comic/${comicId}`)}
          className="focus:outline-none"
          aria-label="Back to Manga"
        >
          <BackIcon />
        </button>
      );
    }
  }

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[hsl(var(--background))]/80 backdrop-blur-md border-b border-[hsl(var(--border))] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="w-1/3 flex justify-start">{backButton}</div>

        <div className="w-1/3 flex justify-center">
          <button
            onClick={() => router.push("/")}
            className="text-2xl font-serif font-bold tracking-tight text-[hsl(var(--foreground))] hover:text-[hsl(var(--primary))] transition-colors"
          >
            MangaFix
          </button>
        </div>

        <div className="w-1/3 flex justify-end">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-[hsl(var(--muted))] transition-colors text-[hsl(var(--foreground))]"
            aria-label="Toggle Theme"
          >
            {darkMode ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="4"></circle>
                <path d="M12 2v2"></path>
                <path d="M12 20v2"></path>
                <path d="m4.93 4.93 1.41 1.41"></path>
                <path d="m17.66 17.66 1.41 1.41"></path>
                <path d="M2 12h2"></path>
                <path d="M20 12h2"></path>
                <path d="m6.34 17.66-1.41 1.41"></path>
                <path d="m19.07 4.93-1.41 1.41"></path>
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
              </svg>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
