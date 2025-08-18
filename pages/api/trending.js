export default async function handler(req, res) {
  // Make sure API key exists
  if (!process.env.GNEWS_API_KEY) {
    return res.status(500).json({ trendingResults: [], error: "GNEWS_API_KEY not set" });
  }

  try {
    const url = `https://gnews.io/api/v4/top-headlines?token=${process.env.GNEWS_API_KEY}&lang=en`;

    const response = await fetch(url);

    // Check if we got HTML (likely SSO / error page)
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const text = await response.text();
      console.error("❌ Non-JSON response from GNews:", text.slice(0, 500));
      return res.status(500).json({ trendingResults: [], error: "Invalid response from GNews" });
    }

    const data = await response.json();

    const trendingResults = Array.isArray(data.articles)
      ? data.articles.map((article) => ({
          title: article.title || "No Title",
          source: article.source?.name || "Unknown Source",
          img: article.image || null,
        }))
      : [];

    res.status(200).json({ trendingResults });
  } catch (error) {
    console.error("❌ Failed to fetch trending news:", error);
    res.status(500).json({ trendingResults: [], error: error.message });
  }
}
