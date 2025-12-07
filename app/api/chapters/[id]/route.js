import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(request, { params }) {
  try {
    const { id } = await params;

    const data = JSON.stringify({
      query: `query get_comicChapterList($comicId: ID!) {
    get_comicChapterList(comicId: $comicId){
      id
      data {
        
  id comicId

  isFinal
  
  volume
  serial

  dname
  title

  urlPath

  sfw_result

      }
      # sser_read
      # sser_read_serial
    }
  }`,
      variables: {
        comicId: id,
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
      throw new Error(`Failed to fetch chapters: ${response.status}`);
    }

    const responseData = await response.json();
    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Chapters API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
