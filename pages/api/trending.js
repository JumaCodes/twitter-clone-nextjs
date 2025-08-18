export default async function handler(req, res) {
  try {
    const url = `https://gnews.io/api/v4/top-headlines?token=${process.env.GNEWS_API_KEY}&lang=en`;
    const response = await fetch(url);
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
    console.error(error);
    res.status(500).json({ trendingResults: [] });
  }
}
