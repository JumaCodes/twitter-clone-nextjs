export default async function handler(req, res) {
  try {
    const followResults = [
      {
        name: "Elon Musk",
        tag: "elonmusk",
        image: "https://pbs.twimg.com/profile_images/1590968738358079488/IY9Gx6Ok_400x400.jpg",
      },
      {
        name: "Bill Gates",
        tag: "billgates",
        image: "https://www.shutterstock.com/image-photo/paris-france-april-16-2018-600nw-1070620838.jpg",
      },
      {
        name: "Satya Nadella",
        tag: "satyanadella",
        image: "https://www.shutterstock.com/editorial/image-editorial/M4T3Qd17O5T0U1y4MTE5ODc=/satya-nadella-executive-chairman-ceo-microsoft-corporation-440nw-14457596c.jpg",
      },
    ];

    res.status(200).json({ followResults });
  } catch (error) {
    console.error("❌ Failed to fetch follow suggestions:", error);
    res.status(500).json({ followResults: [] });
  }
}
