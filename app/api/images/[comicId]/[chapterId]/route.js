import { NextResponse } from "next/server";
import axios from "axios";
import * as cheerio from "cheerio";

export async function GET(request, { params }) {
  try {
    const { comicId, chapterId } = await params;

    const response = await fetch(
      `https://mangapark.net/title/${comicId}/${chapterId}`,
      {
        headers: {
          accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
          "accept-language": "en-US,en;q=0.9",
          "cache-control": "no-cache",
          priority: "u=0, i",
          "sec-ch-ua": '"Chromium";v="143", "Not A(Brand";v="24"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"macOS"',
          "user-agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36",
        },
        next: { revalidate: 86400 },
      },
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch images: ${response.status}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    const scriptContent = $('script[type="qwik/json"]').html();

    if (!scriptContent) {
      return NextResponse.json({ images: [] });
    }

    const regex = /"https:\/\/s[^"]+"/g;
    const matches = scriptContent.match(regex);

    let images = [];
    if (matches) {
      images = matches
        .map((match) => {
          let url = match.slice(1, -1);
          url = url.replace(/https:\/\/s\d+\./, "https://s00.");

          return url;
        })
        .filter((url) => !url.includes("shonenjumpplus.com"));
    }

    return NextResponse.json({ images });
  } catch (error) {
    console.error("Images API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
