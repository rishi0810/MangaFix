"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [directId, setDirectId] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Debounced Search Effect
  useEffect(() => {
    // If query is empty, clear results and stop
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const delayDebounceFn = setTimeout(() => {
      performSearch(searchQuery);
    }, 500); // 500ms delay

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const performSearch = async (query) => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const response = await axios.post("/api/search", { query: query });
      // The Response structure based on backend:
      // data: { get_searchComic: { items: [ { id, data: { id, name, urlCover600, authors } } ] } }
      const items = response.data?.data?.get_searchComic?.items || [];
      setSearchResults(items);
    } catch (error) {
      console.error("Search failed", error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Immediate search on manual submit
    if (searchQuery.trim()) {
      performSearch(searchQuery);
    }
  };

  const handleGoToComic = (item) => {
    // Pass details via query params
    const params = new URLSearchParams();
    params.set("name", item.data.name);
    // Add prefix if missing, though it might be added in rendering
    params.set("cover", `https://mangapark.net${item.data.urlCover600}`);
    if (item.data.authors && item.data.authors.length > 0) {
      params.set("author", item.data.authors[0]);
    }

    router.push(`/comic/${item.data.id}?${params.toString()}`);
  };

  const handleDirectIdSubmit = (e) => {
    e.preventDefault();
    if (directId.trim()) {
      router.push(`/comic/${directId.trim()}`);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
      {/* Hero Section */}
      <div className="w-full relative h-[45vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/image.webp"
            alt="Reading Calm"
            fill
            priority
            className="object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[hsl(var(--background))]/10 via-[hsl(var(--background))]/20 to-[hsl(var(--background))]"></div>
        </div>

        <div className="relative z-10 text-center space-y-4 px-4 mt-12">
          <h1 className="text-6xl md:text-7xl font-serif font-medium tracking-tight text-[hsl(var(--foreground))] drop-shadow-sm">
            MangaFix
          </h1>
          <p className="text-[hsl(var(--foreground))] text-xl max-w-lg mx-auto font-light leading-relaxed drop-shadow-sm">
            A sanctuary for manga. <br />
            Immerse yourself in a world of calm reading.
          </p>
        </div>
      </div>

      <div className="w-full max-w-5xl flex flex-col items-center gap-10 relative z-20 px-6 -mt-12 mb-20">
        {/* Main Search (Floating Card) */}
        <form
          onSubmit={handleSearch}
          className="w-full max-w-lg px-4 space-y-8 z-30 transition-all duration-500 delay-300 transform translate-y-0 opacity-100"
        >
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-600 rounded-xl blur opacity-25 group-hover:opacity-40 transition-opacity duration-500 z-0"></div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Find a manga to get lost in..."
              className="w-full bg-[hsl(var(--background))] border-none text-[hsl(var(--foreground))] px-6 md:px-8 py-4 md:py-5 rounded-xl text-sm md:text-base focus:outline-none focus:ring-1 focus:ring-[hsl(var(--primary))] transition-all font-serif placeholder:italic placeholder:text-[hsl(var(--muted-foreground))] shadow-lg relative z-10"
            />
            <button
              type="submit"
              className="absolute right-2 top-2 bottom-2 bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] px-4 md:px-6 rounded-lg font-medium hover:opacity-90 transition-opacity text-sm md:text-base z-20"
            >
              Explore
            </button>
          </div>

          <p className="text-center font-serif italic text-[hsl(var(--muted-foreground))] text-sm md:text-base opacity-80">
            A fast and legacy fix for MangaPark
          </p>
        </form>

        {/* Results Grid */}
        {searchResults.length > 0 && (
          <div className="w-full mt-4 grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-12">
            {searchResults.map((item) => (
              <div
                key={item.id}
                onClick={() => handleGoToComic(item)}
                className="group cursor-pointer flex flex-col gap-3"
              >
                <div className="aspect-[2/3] relative overflow-hidden rounded-sm shadow-md bg-[hsl(var(--muted))] transition-shadow duration-500 group-hover:shadow-2xl group-hover:shadow-[hsl(var(--primary))]/10">
                  <Image
                    src={`/api/proxy-image?url=${encodeURIComponent(`https://mangapark.net${item.data.urlCover600}`)}`}
                    alt={item.data.name}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover transition-transform duration-1000 group-hover:scale-105"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500"></div>
                </div>
                <div className="space-y-1">
                  <h3 className="font-serif font-bold text-lg leading-snug text-[hsl(var(--foreground))] group-hover:text-[hsl(var(--primary))] transition-colors line-clamp-2">
                    {item.data.name}
                  </h3>
                  <p className="text-[hsl(var(--muted-foreground))] text-sm italic truncate relative pl-3 before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1.5 before:h-[1px] before:bg-[hsl(var(--primary))]">
                    {item.data.authors[0]}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
