// app/api/ask/route.ts

export async function POST(request: Request) {
  try {
    const { problem, language = "en" } = await request.json();
    const query = problem;
    const backendUrl = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:8000";

    const res = await fetch(`${backendUrl}/ask`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, language })
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || `Backend returned ${res.status}`);
    }

    const data = await res.json();
    return Response.json(data);

  } catch (error: any) {
    console.error("API proxy error:", error.message);
    return Response.json({ success: false, error: "System failure or backend unreachable." }, { status: 500 });
  }
}
