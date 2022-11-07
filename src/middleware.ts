import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  if (req.nextUrl.pathname === "/") {
    return;
  }

  const res = await fetch(`${req.nextUrl.origin}/api/get-url`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      slug: req.nextUrl.pathname.split("/").pop(),
    }),
  });

  const data = await res.json();

  if (data?.url) {
    return NextResponse.redirect(data.url);
  }

  return NextResponse.redirect(req.nextUrl.origin);
}

export const config = {
  matcher: ["/((?!api|b|_next/static|favicon.ico|assets).*)"],
};
