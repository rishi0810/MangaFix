"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import Image from "next/image";

export default function Read() {
  const router = useRouter();
  const params = useParams();
  const { comicId, chapterId } = params;

  const dataFetchedRef = useRef(false);

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chapters, setChapters] = useState([]);

  useEffect(() => {
    const fetchImagesAndNav = async () => {
      if (!comicId || !chapterId) return;

      try {
        setLoading(true);
        setError(null);

        if (dataFetchedRef.current === `${comicId}-${chapterId}`) {
          return;
        }
        dataFetchedRef.current = `${comicId}-${chapterId}`;

        const imgRes = await axios.get(`/api/images/${comicId}/${chapterId}`);
        if (imgRes.data.images) {
          setImages(imgRes.data.images);
        }

        const storageKey = `manga_${comicId}_chapters`;
        const cachedChapters = sessionStorage.getItem(storageKey);

        if (cachedChapters) {
          const parsed = JSON.parse(cachedChapters);
          parsed.sort((a, b) => b.data.serial - a.data.serial);
          setChapters(parsed);
        } else {
          const chapRes = await axios.post(`/api/chapters/${comicId}`);
          let chapterList = chapRes.data?.data?.get_comicChapterList || [];
          chapterList.sort((a, b) => b.data.serial - a.data.serial);
          setChapters(chapterList);
          sessionStorage.setItem(storageKey, JSON.stringify(chapterList));
        }
      } catch (err) {
        console.error("Error loading chapter", err);
        setError("Failed to load images.");
        dataFetchedRef.current = null;
      } finally {
        setLoading(false);
      }
    };

    fetchImagesAndNav();
  }, [comicId, chapterId]);

  const currentChapterIndex = chapters.findIndex(
    (c) => c.data.id === chapterId,
  );
  const nextChapter =
    currentChapterIndex > 0 ? chapters[currentChapterIndex - 1] : null;
  const prevChapter =
    currentChapterIndex < chapters.length - 1
      ? chapters[currentChapterIndex + 1]
      : null;

  const handleNav = (targetChapter) => {
    if (targetChapter) {
      setImages([]);

      router.push(`/read/${comicId}/${targetChapter.data.id}`);
    }
  };

  const currentChapterData = chapters[currentChapterIndex]?.data;

  const [showChapterMenu, setShowChapterMenu] = useState(false);

  return (
    <div className="min-h-screen bg-[hsl(var(--background))] flex flex-col items-center">
      <div className="w-full h-16"></div>

      <div className="w-full max-w-3xl pt-8 pb-32 min-h-screen bg-[hsl(var(--card))] shadow-2xl px-2 md:px-0">
        {loading && (
          <div className="flex h-64 items-center justify-center text-[hsl(var(--muted-foreground))] animate-pulse">
            Loading Pages...
          </div>
        )}

        {error && (
          <div className="flex h-64 items-center justify-center text-red-400">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-2">
          {images.map((img, idx) => (
            <div key={idx} className="relative w-full">
              <Image
                src={img}
                alt={`Page ${idx + 1}`}
                width={800}
                height={1200}
                className="w-full h-auto block rounded-sm"
                style={{ width: "100%", height: "auto" }}
                priority={idx < 4}
                loading="eager"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-xl z-50">
        {showChapterMenu && (
          <div className="absolute bottom-full left-0 w-full mb-4 bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-xl shadow-2xl max-h-[60vh] overflow-hidden flex flex-col animate-in slide-in-from-bottom-5 duration-200">
            <div className="p-4 border-b border-[hsl(var(--border))] bg-[hsl(var(--muted))] flex justify-between items-center">
              <h3 className="font-bold text-[hsl(var(--foreground))]">
                Select Chapter
              </h3>
              <button
                onClick={() => setShowChapterMenu(false)}
                className="text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
              >
                ✕
              </button>
            </div>
            <div className="overflow-y-auto p-2 custom-scrollbar">
              {chapters.map((ch) => (
                <button
                  key={ch.id}
                  onClick={() => {
                    handleNav(ch);
                    setShowChapterMenu(false);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-lg text-sm transition-colors ${ch.data.id === chapterId ? "bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] font-bold" : "hover:bg-[hsl(var(--muted))] text-[hsl(var(--foreground))]"}`}
                >
                  {ch.data.title ||
                    ch.data.dname ||
                    `Chapter ${ch.data.serial}`}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="bg-[hsl(var(--background))]/95 backdrop-blur-xl border border-[hsl(var(--border))] p-2 rounded-2xl shadow-xl flex items-center justify-between gap-2">
          <button
            onClick={() => handleNav(prevChapter)}
            disabled={!prevChapter}
            className="flex-1 px-4 py-3 rounded-xl font-medium transition-colors text-sm hover:bg-[hsl(var(--muted))] disabled:opacity-30 text-[hsl(var(--foreground))]"
          >
            ← Prev
          </button>

          <button
            onClick={() => setShowChapterMenu(!showChapterMenu)}
            className="flex-[2] bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]/90 text-[hsl(var(--primary-foreground))] px-4 py-3 rounded-xl font-bold transition-colors shadow-lg text-sm truncate"
          >
            {currentChapterData
              ? `Chapter ${currentChapterData.serial}`
              : "Chapter List"}
          </button>

          <button
            onClick={() => handleNav(nextChapter)}
            disabled={!nextChapter}
            className="flex-1 px-4 py-3 rounded-xl font-medium transition-colors text-sm hover:bg-[hsl(var(--muted))] disabled:opacity-30 text-[hsl(var(--foreground))]"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}
