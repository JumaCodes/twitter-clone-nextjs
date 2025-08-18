import Head from "next/head";
import Feed from "../components/Feed";
import Sidebar from "../components/Sidebar";
import { getProviders, getSession, useSession } from "next-auth/react";
import Login from "../components/Login";
import Modal from "../components/Modal";
import { useRecoilState } from "recoil";
import { modalState } from "@/atoms/modalAtom";
import Widgets from "../components/Widgets";
import { useState } from "react";

export default function Home({ trendingResults, followResults, providers }) {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useRecoilState(modalState);
  const [currentPostId, setCurrentPostId] = useState(null); // track which post is opened

  const openModal = (postId) => {
    setCurrentPostId(postId);
    setIsOpen(true);
  };

  if (!session) return <Login providers={providers} />;

  return (
    <div>
      <Head>
        <title>Twitter</title>
        <meta name="description" content="Twitter clone built with Next.js" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="bg-black min-h-screen flex max-w-[1500px] mx-auto">
        <Sidebar />
        <Feed openModal={openModal} /> {/* pass openModal to Feed */}
        <Widgets
          trendingResults={trendingResults}
          followResults={followResults}
        />
        {isOpen && <Modal postId={currentPostId} />}
      </main>
    </div>
  );
}

// Server-side fetching
export async function getServerSideProps(context) {
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
  const host = context.req.headers.host;
  const baseUrl = `${protocol}://${host}`;

  let trendingResults = [];
  let followResults = [];

  // Fetch Trending News
  try {
    const trendingRes = await fetch(`${baseUrl}/api/trending`);
    const trendingData = await trendingRes.json();

    trendingResults = Array.isArray(trendingData.trendingResults)
      ? trendingData.trendingResults.map((item) => ({
          title: item.title || "No Title",
          source: item.source || "Unknown Source",
          image: item.img || null,
        }))
      : [];
  } catch (error) {
    console.error("❌ Failed to fetch trending news:", error);
  }

  // Fetch Follow Suggestions
  try {
    const followRes = await fetch(`${baseUrl}/api/follow`);
    const followData = await followRes.json();

    followResults = Array.isArray(followData.followResults)
      ? followData.followResults.map((item) => ({
          name: item.name || "Unknown",
          tag: item.tag || "unknown",
          image: item.image || "/default-profile.png",
        }))
      : [];
  } catch (error) {
    console.error("❌ Failed to fetch follow suggestions:", error);
  }

  const providers = await getProviders();
  const session = await getSession(context);

  return {
    props: {
      trendingResults,
      followResults,
      providers,
      session,
    },
  };
}
