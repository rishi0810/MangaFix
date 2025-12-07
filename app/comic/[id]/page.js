"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import axios from "axios";
import Image from "next/image";

export default function MangaInfo() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const id = params.id;
  const paramName = searchParams.get("name");
  const paramCover = searchParams.get("cover");
  const paramAuthor = searchParams.get("author");

  const [mangaDetails, setMangaDetails] = useState({
    name: paramName || "Loading...",
    cover: paramCover || null,
    author: paramAuthor || "Unknown Author",
  });

  const [synopsis, setSynopsis] = useState("Loading synopsis...");
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storageKey = `manga_${id}_details`;

    if (paramName) {
      const details = {
        name: paramName || id,
        cover: paramCover,
        author: paramAuthor || "Unknown Author",
      };
      setMangaDetails(details);
      sessionStorage.setItem(storageKey, JSON.stringify(details));
    } else {
      const saved = sessionStorage.getItem(storageKey);
      if (saved) {
        setMangaDetails(JSON.parse(saved));
      }
    }
  }, [id, paramName, paramCover, paramAuthor]);

  const { name, cover, author } = mangaDetails;

  const dataFetchedRef = useRef(false);

  useEffect(() => {
    const sysStorageKey = `manga_${id}_synopsis`;
    const chapStorageKey = `manga_${id}_chapters`;

    const fetchData = async () => {
      const cachedSynopsis = sessionStorage.getItem(sysStorageKey);
      const cachedChapters = sessionStorage.getItem(chapStorageKey);

      let synopsisLoaded = false;
      let chaptersLoaded = false;

      if (cachedSynopsis) {
        setSynopsis(cachedSynopsis);
        synopsisLoaded = true;
      }

      if (cachedChapters) {
        const parsed = JSON.parse(cachedChapters);
        parsed.sort((a, b) => b.data.serial - a.data.serial);
        setChapters(parsed);
        chaptersLoaded = true;

        if (synopsisLoaded) setLoading(false);
      }

      if (!synopsisLoaded || !chaptersLoaded) {
        if (dataFetchedRef.current === id) return;
        dataFetchedRef.current = id;

        try {
          if (!synopsisLoaded) setLoading(true);

          const promises = [];

          if (!synopsisLoaded) {
            promises.push(
              axios.get(`/api/comic/${id}`).then((res) => {
                const syn = res.data.synopsis || "No synopsis available.";
                setSynopsis(syn);
                sessionStorage.setItem(sysStorageKey, syn);
              }),
            );
          }

          if (!chaptersLoaded) {
            promises.push(
              axios.post(`/api/chapters/${id}`).then((res) => {
                let list = res.data?.data?.get_comicChapterList || [];
                list.sort((a, b) => b.data.serial - a.data.serial);
                setChapters(list);
                sessionStorage.setItem(chapStorageKey, JSON.stringify(list));
              }),
            );
          }

          await Promise.all(promises);
        } catch (error) {
          console.error("Failed to fetch manga info", error);
          if (!synopsisLoaded) setSynopsis("Failed to load info.");
          dataFetchedRef.current = null;
        } finally {
          setLoading(false);
        }
      }
    };

    if (id) {
      fetchData();
    }

    // return () => {
    //   dataFetchedRef.current = null;
    // };
  }, [id]);

  const handleRead = (chapterId) => {
    router.push(`/read/${id}/${chapterId}`);
  };

  return (
    <div className="h-auto md:h-[calc(100vh-4rem)] w-full flex flex-col md:flex-row bg-[hsl(var(--background))] text-[hsl(var(--foreground))] overflow-y-auto md:overflow-hidden">
      <div className="w-full md:w-[45%] md:h-full flex flex-col p-6 md:p-12 md:overflow-y-auto md:border-r border-[hsl(var(--border))] custom-scrollbar">
        <div className="flex flex-row gap-6 md:gap-8 items-start">
          <div className="w-32 md:w-48 shrink-0 aspect-[2/3] bg-[hsl(var(--muted))] rounded-md shadow-lg overflow-hidden relative">
            {cover ? (
              <Image
                src={cover}
                alt={name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 128px, 192px"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[hsl(var(--muted-foreground))] text-xs">
                No Cover
              </div>
            )}
          </div>

          <div className="flex-1 space-y-2 md:space-y-4 pt-1 md:pt-2">
            <div>
              <h1 className="text-xl md:text-3xl font-serif font-bold text-[hsl(var(--foreground))] leading-tight line-clamp-3 md:line-clamp-none">
                {name}
              </h1>
              <p className="text-[hsl(var(--primary))] font-medium mt-1 text-sm md:text-base">
                {author}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 md:mt-8 space-y-2">
          <h3 className="text-xs md:text-sm uppercase tracking-widest text-[hsl(var(--muted-foreground))] font-bold">
            Synopsis
          </h3>
          <div className="text-sm md:text-base leading-relaxed text-[hsl(var(--foreground))] opacity-90">
            {synopsis}
          </div>
        </div>
      </div>

      <div className="flex-1 w-full md:h-full flex flex-col bg-[hsl(var(--card))] border-t md:border-t-0 md:border-l border-[hsl(var(--border))] min-h-[500px]">
        <div className="p-4 md:p-6 border-b border-[hsl(var(--border))] flex items-center justify-between sticky top-[64px] md:top-0 bg-[hsl(var(--card))] z-10 shadow-sm md:shadow-none">
          <h2 className="text-lg md:text-xl font-bold flex items-center gap-2">
            Chapters{" "}
            <span className="text-[hsl(var(--muted-foreground))] text-sm font-normal">
              ({chapters.length})
            </span>
          </h2>
          <div className="text-xs text-[hsl(var(--muted-foreground))]">
            {loading ? "Fetching..." : "Select a chapter"}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2 md:p-4 space-y-2 custom-scrollbar">
          {loading ? (
            <div className="flex flex-col gap-2 opacity-50">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-16 bg-[hsl(var(--muted))] rounded animate-pulse"
                />
              ))}
            </div>
          ) : chapters.length > 0 ? (
            chapters.map((chapter) => (
              <div
                key={chapter.id}
                onClick={() => handleRead(chapter.data.id)}
                className="group flex items-center justify-between px-4 md:px-6 py-3 md:py-4 rounded-lg hover:bg-[hsl(var(--muted))] cursor-pointer transition-colors border border-transparent hover:border-[hsl(var(--border))]"
              >
                <div className="flex flex-col">
                  <span className="font-medium text-sm md:text-base text-[hsl(var(--foreground))] group-hover:text-[hsl(var(--primary))] transition-colors line-clamp-1">
                    {chapter.data.title ||
                      chapter.data.dname ||
                      `Chapter ${chapter.data.serial}`}
                  </span>
                  <span className="text-xs text-[hsl(var(--muted-foreground))]">
                    Serial: {chapter.data.serial}
                  </span>
                </div>
                <span className="text-[10px] md:text-xs px-2 md:px-3 py-1 rounded-full bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] group-hover:bg-[hsl(var(--primary))] group-hover:text-[hsl(var(--background))] transition-colors shrink-0 ml-2">
                  Read
                </span>
              </div>
            ))
          ) : (
            <div className="text-center p-10 text-[hsl(var(--muted-foreground))]">
              No chapters found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
