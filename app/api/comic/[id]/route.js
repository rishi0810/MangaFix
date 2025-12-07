import { NextResponse } from "next/server";
import axios from "axios";
import * as cheerio from "cheerio";

export async function GET(request, { params }) {
  try {
    const { id } = await params;

    const response = await fetch(`https://mangapark.net/title/${id}`, {
      headers: {
        accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        "accept-language": "en-US,en;q=0.9",
        priority: "u=0, i",
        "sec-ch-ua-platform": '"macOS"',
        "user-agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36",
      },
      next: { revalidate: 1800 },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    const element = $('[q\\:key="0a_9"]');
    let synopsis = "";

    if (element.length > 0) {
      synopsis = element.text().trim();
    }

    return NextResponse.json({ synopsis });
  } catch (error) {
    console.error("Comic Info API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
