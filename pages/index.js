import Head from "next/head";
import Feed from "../components/Feed";
import Sidebar from "../components/Sidebar";
import { getProviders, getSession, useSession } from "next-auth/react";
import Login from "../components/Login";
import Modal from "../components/Modal";
import { useRecoilState } from "recoil";
import { modalState } from "@/atoms/modalAtom";
import { postIdState } from "@/atoms/postIdAtom";
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

export async function getServerSideProps(context) {
  // Determine base URL based on environment
  const baseUrl =
    process.env.NODE_ENV === "development"
      ? process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
      : process.env.PRODUCTION_BASE_URL || "https://twitter-clone-nextjs-snowy.vercel.app"; // no trailing slash

  let trendingResults = [];
  let followResults = [];

  // --- Fetch Trending News ---
  try {
    const trendingUrl = `${baseUrl}/api/trending`;
    console.log("Fetching trending news from:", trendingUrl);

    const trendingRes = await fetch(trendingUrl);
    if (!trendingRes.ok) throw new Error(`HTTP error! status: ${trendingRes.status}`);

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
    trendingResults = []; // fallback
  }

  // --- Fetch Follow Suggestions ---
  try {
    const followUrl = `${baseUrl}/api/follow`;
    console.log("Fetching follow suggestions from:", followUrl);

    const followRes = await fetch(followUrl);
    if (!followRes.ok) throw new Error(`HTTP error! status: ${followRes.status}`);

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
    followResults = []; // fallback
  }

  // --- Fetch auth providers and session ---
  let providers = {};
  let session = null;
  try {
    providers = await getProviders();
    session = await getSession(context);
  } catch (error) {
    console.error("❌ Failed to fetch auth providers or session:", error);
  }

  return {
    props: {
      trendingResults,
      followResults,
      providers,
      session,
    },
  };
}
