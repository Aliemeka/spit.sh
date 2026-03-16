import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "url param required" }, { status: 400 });
  }

  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; spitsh-bot/1.0)" },
      signal: AbortSignal.timeout(5000),
    });

    const html = await res.text();

    const getMeta = (property: string): string | null => {
      const match =
        html.match(new RegExp(`<meta[^>]+property=["']${property}["'][^>]+content=["']([^"']+)["']`, "i")) ||
        html.match(new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+property=["']${property}["']`, "i"));
      return match?.[1] ?? null;
    };

    const getTitle = (): string | null => {
      const match = html.match(/<title[^>]*>([^<]+)<\/title>/i);
      return match?.[1]?.trim() ?? null;
    };

    return NextResponse.json({
      title: getMeta("og:title") ?? getTitle(),
      description: getMeta("og:description"),
      image: getMeta("og:image"),
    });
  } catch {
    return NextResponse.json({ title: null, description: null, image: null });
  }
}
