import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
} from "@firebase/firestore";
import {
  ChartBarIcon,
  ChatIcon,
  DotsHorizontalIcon,
  HeartIcon,
  ShareIcon,
  TrashIcon,
} from "@heroicons/react/outline";
import { HeartIcon as HeartIconFilled } from "@heroicons/react/solid";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Moment from "react-moment";
import { useRecoilState } from "recoil";
import { modalState } from "@/atoms/modalAtom";
import { postIdState } from "@/atoms/postIdAtom";

import { db } from "../firebase";

function Post({ id, post, postPage }) {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useRecoilState(modalState);
  const [postId, setPostId] = useRecoilState(postIdState);
  const [comments, setComments] = useState([]);
  const [likes, setLikes] = useState([]);
  const [liked, setLiked] = useState(false);
  const router = useRouter();

  // Fetch comments
  useEffect(() => {
    if (!id) return;
    const commentsQuery = query(
      collection(db, "posts", id, "comments"),
      orderBy("timestamp", "desc")
    );
    const unsubscribe = onSnapshot(commentsQuery, (snapshot) => {
      setComments(snapshot.docs);
    });
    return () => unsubscribe();
  }, [id]);

  // Fetch likes
  useEffect(() => {
    if (!id) return;
    const likesRef = collection(db, "posts", id, "likes");
    const unsubscribe = onSnapshot(likesRef, (snapshot) =>
      setLikes(snapshot.docs)
    );
    return () => unsubscribe();
  }, [id]);

  // Check if liked by current user
  useEffect(() => {
    if (!session?.user?.email) return;
    setLiked(likes.some((like) => like.id === session.user.email));
  }, [likes, session?.user?.email]);

  // Like / Unlike a post
  const likePost = async () => {
    if (!session?.user?.email) return;
    const likeRef = doc(db, "posts", id, "likes", session.user.email);

    if (liked) {
      await deleteDoc(likeRef);
    } else {
      await setDoc(likeRef, { username: session.user.name });
    }
  };

  return (
    <div
      className="p-3 flex cursor-pointer border-b border-gray-700"
      onClick={() => !postPage && router.push(`/${id}`)} // Only navigate if not on post page
    >
      {!postPage && (
        <img
          src={post?.userImg}
          alt="Profile Pic"
          className="h-11 w-11 rounded-full mr-4"
        />
      )}

      <div className="flex flex-col space-y-2 w-full">
        <div className={`flex ${!postPage ? "justify-between" : ""}`}>
          {postPage && (
            <img
              src={post?.userImg}
              alt="Profile Pic"
              className="h-11 w-11 rounded-full mr-4"
            />
          )}

          <div className="text-[#6e757d]">
            <div className="inline-block group">
              <h4 className="font-bold text-[15px] sm:text-base text-[#d9d9d9] group-hover:underline">
                {post?.username}
              </h4>
              <span className="text-sm sm:text-[15px]">@{post?.tag}</span>
            </div>{" "}
            ·{" "}
            <span className="hover:underline text-sm sm:text-[15px]">
              {post?.timestamp && (
                <Moment fromNow>{post.timestamp.toDate()}</Moment>
              )}
            </span>
            {!postPage && (
              <p className="text-[#d9d9d9] text-[15px] sm:text-base mt-0.5">
                {post?.text}
              </p>
            )}
          </div>

          <div className="icon group flex-shrink-0 ml-auto">
            <DotsHorizontalIcon className="h-5 text-[#6e767d] group-hover:text-[#1d9bf0]" />
          </div>
        </div>

        {postPage && (
          <p className="text-[#d9d9d9] text-[15px] sm:text-base mt-0.5">
            {post?.text}
          </p>
        )}

        {post?.image && (
          <img
            src={post.image}
            alt=""
            className="rounded-2xl max-h-[700px] object-cover mr-2"
          />
        )}

        {/* Action buttons */}
        <div
          className={`text-[#6e767d] flex justify-between w-10/12 ${
            postPage ? "mx-[70px]" : ""
          }`}
        >
          {/* Comment */}
          <div
            className="flex items-center space-x-1 group"
            onClick={(e) => {
              e.stopPropagation();
              setPostId(id);
              setIsOpen(true);
            }}
          >
            <div className="icon group-hover:bg-[#1d9bf0] group-hover:bg-opacity-10">
              <ChatIcon className="h-5 group-hover:text-[#1d9bf0]" />
            </div>
            {comments.length > 0 && (
              <span className="group-hover:text-[#1d9bf0] text-sm">
                {comments.length}
              </span>
            )}
          </div>

          {/* Delete */}
          {session?.user?.email === post?.email && (
            <div
              className="flex items-center space-x-1 group"
              onClick={(e) => {
                e.stopPropagation();
                deleteDoc(doc(db, "posts", id));
                router.push("/");
              }}
            >
              <div className="icon group-hover:bg-red-600/10">
                <TrashIcon className="h-5 group-hover:text-red-600" />
              </div>
            </div>
          )}

          {/* Like */}
          <div
            className="flex items-center space-x-1 group"
            onClick={(e) => {
              e.stopPropagation();
              likePost();
            }}
          >
            <div className="icon group-hover:bg-pink-600/10">
              {liked ? (
                <HeartIconFilled className="h-5 text-pink-600" />
              ) : (
                <HeartIcon className="h-5 group-hover:text-pink-600" />
              )}
            </div>
            {likes.length > 0 && (
              <span
                className={`group-hover:text-pink-600 text-sm ${
                  liked ? "text-pink-600" : ""
                }`}
              >
                {likes.length}
              </span>
            )}
          </div>

          {/* Share */}
          <div className="icon group">
            <ShareIcon className="h-5 group-hover:text-[#1d9bf0]" />
          </div>

          {/* Analytics */}
          <div className="icon group">
            <ChartBarIcon className="h-5 group-hover:text-[#1d9bf0]" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Post;
