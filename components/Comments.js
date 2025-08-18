import {
  HeartIcon as HeartIconOutline,
  ChatIcon,
  DotsHorizontalIcon,
  ShareIcon,
  ChartBarIcon,
} from "@heroicons/react/outline";
import { HeartIcon as HeartIconFilled } from "@heroicons/react/solid";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  deleteDoc,
} from "@firebase/firestore";
import Moment from "react-moment";

function Comments({ comment, postId }) {
  const { data: session } = useSession();
  const [likes, setLikes] = useState([]);
  const [liked, setLiked] = useState(false);

  // Fetch likes for this comment
  useEffect(() => {
    if (!postId || !comment?.id) return;
    const likesRef = collection(
      db,
      "posts",
      postId,
      "comments",
      comment.id,
      "likes"
    );
    const unsubscribe = onSnapshot(likesRef, (snapshot) => {
      setLikes(snapshot.docs);
    });
    return () => unsubscribe();
  }, [postId, comment?.id]);

  // Check if current user liked this comment
  useEffect(() => {
    if (!session?.user?.email) return;
    setLiked(likes.some((like) => like.id === session.user.email));
  }, [likes, session?.user?.email]);

  // Like/unlike comment
  const likeComment = async () => {
    if (!session?.user?.email || !postId || !comment?.id) return;
    const likeRef = doc(
      db,
      "posts",
      postId,
      "comments",
      comment.id,
      "likes",
      session.user.email
    );

    if (liked) {
      await deleteDoc(likeRef);
    } else {
      await setDoc(likeRef, { username: session.user.name });
    }
  };

  return (
    <div className="p-3 flex border-b border-gray-700">
      <img
        src={comment?.userImg}
        alt=""
        className="h-11 w-11 rounded-full mr-4"
      />
      <div className="flex flex-col w-full space-y-2">
        <div className="flex justify-between">
          <div className="text-[#63767d]">
            <div className="inline-block group">
              <h4 className="font-bold text-[#d9d9d9] text-[15px] sm:text-base inline-block group-hover:underline">
                {comment?.username}
              </h4>
              <span className="ml-1.5 text-sm sm:text-[15px]">
                @{comment?.tag}
              </span>
            </div>{" "}
            ·{" "}
            <span className="hover:underline text-sm sm:text-[15px]">
              <Moment fromNow>{comment?.timestamp?.toDate()}</Moment>
            </span>
            <p className="text-[#d9d9d9] mt-0.5 text-[15px] sm:text-base">
              {comment?.comment}
            </p>
          </div>
          <div className="icon group flex-shrink-0">
            <DotsHorizontalIcon className="h-5 text-[#6e767d] group-hover:text-[#1d9bf0]" />
          </div>
        </div>

        <div className="flex justify-between w-10/12 text-[#6e767d]">
          {/* Comment Like */}
          <div
            className="flex items-center space-x-1 group"
            onClick={likeComment}
          >
            <div className="icon group-hover:bg-pink-600/10">
              {liked ? (
                <HeartIconFilled className="h-5 text-pink-600" />
              ) : (
                <HeartIconOutline className="h-5 group-hover:text-pink-600" />
              )}
            </div>
            {likes.length > 0 && (
              <span
                className={`text-sm ${
                  liked ? "text-pink-600" : "group-hover:text-pink-600"
                }`}
              >
                {likes.length}
              </span>
            )}
          </div>

          {/* Other icons */}
          <div className="icon group">
            <ChatIcon className="h-5 group-hover:text-[#1d9bf0]" />
          </div>
          <div className="icon group">
            <ShareIcon className="h-5 group-hover:text-[#1d9bf0]" />
          </div>
          <div className="icon group">
            <ChartBarIcon className="h-5 group-hover:text-[#1d9bf0]" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Comments;
