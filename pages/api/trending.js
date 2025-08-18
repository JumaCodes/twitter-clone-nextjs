export default async function handler(req, res) {
  try {
    const url = `https://gnews.io/api/v4/top-headlines?token=${process.env.GNEWS_API_KEY}&lang=en`;
    const response = await fetch(url);

    const text = await response.text(); // get raw response
    let data;
    try {
      data = JSON.parse(text); // attempt to parse JSON
    } catch (err) {
      console.error("Failed to parse JSON from GNews:", text);
      throw err; // re-throw to hit outer catch
    }

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
    res.status(500).json({ trendingResults: [] });
  }
}
