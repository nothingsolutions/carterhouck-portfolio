import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { path?: string[] } }
) {
  // Only allow in development mode
  if (process.env.NODE_ENV === "production") {
    return new NextResponse("CMS only available in development", { status: 403 });
  }

  const path = params.path?.join("/") || "index.html";
  const tinaUrl = `http://localhost:4001/admin/${path}`;

  try {
    const response = await fetch(tinaUrl, {
      headers: {
        "Accept": request.headers.get("Accept") || "*/*",
      },
    });

    if (!response.ok) {
      return new NextResponse(
        `TinaCMS server not responding. Make sure 'npm run cms:dev' is running.`,
        { status: 503 }
      );
    }

    const content = await response.text();
    const contentType = response.headers.get("content-type") || "text/html";

    return new NextResponse(content, {
      headers: {
        "Content-Type": contentType,
      },
    });
  } catch (error) {
    return new NextResponse(
      `Cannot connect to TinaCMS server at ${tinaUrl}. Make sure 'npm run cms:dev' is running in another terminal.`,
      { status: 503 }
    );
  }
}

