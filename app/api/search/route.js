import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(request) {
  try {
    const body = await request.json();
    const { query } = body;

    const data = JSON.stringify({
      query: `query get_searchComic($select: SearchComic_Select) {
    get_searchComic(
      select: $select
    ) {
      reqWord
      items {
        id data {
          id name
          urlCover600
          authors
        }

      }
    }
  }`,
      variables: {
        select: {
          word: query,
          size: 10,
          page: 1,
          sortby: "field_score",
        },
      },
    });

    const response = await fetch("https://mangapark.net/apo/", {
      method: "POST",
      headers: {
        accept: "*/*",
        "accept-language": "en-US,en;q=0.9",
        "cache-control": "no-cache",
        "content-type": "application/json",
        priority: "u=1, i",
        "sec-ch-ua": '"Chromium";v="143", "Not A(Brand";v="24"',
        "user-agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36",
      },
      body: data,
      next: { revalidate: 1800 },
    });

    if (!response.ok) {
      throw new Error(`Failed to search: ${response.status}`);
    }

    const responseData = await response.json();
    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Search API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
