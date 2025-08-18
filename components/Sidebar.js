import Image from "next/image";
import Link from "next/link";
import { HomeIcon } from "@heroicons/react/solid";
import {
  HashtagIcon,
  BellIcon,
  InboxIcon,
  UserIcon,
  DotsCircleHorizontalIcon,
  DotsHorizontalIcon,
} from "@heroicons/react/outline";
import SidebarLink from "./SidebarLink";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";

function Sidebar() {
  const { data: session } = useSession();

  return (
    <div className="hidden sm:flex flex-col items-center xl:items-start xl:w-[340px] p-2 fixed h-full">
      {/* Logo */}
      <div className="flex items-center justify-center w-14 h-14 hoverAnimation p-0 xl:ml-12">
        <Image
          src="https://www.iconpacks.net/icons/2/free-twitter-logo-icon-2429-thumb.png"
          width={30}
          height={30}
          alt="Twitter Logo"
        />
      </div>

      {/* Sidebar Links */}
      <div className="space-y-2.5 mt-4 mb-2.5 xl:ml-12">
        <SidebarLink text="Home" Icon={HomeIcon} href="/" active />
        <SidebarLink text="Explore" Icon={HashtagIcon} href="/explore" />
        <SidebarLink text="Notifications" Icon={BellIcon} href="/notifications" />
        <SidebarLink text="Messages" Icon={InboxIcon} href="/messages" />
        <SidebarLink text="Profile" Icon={UserIcon} href="/profile" />
        <SidebarLink text="More" Icon={DotsCircleHorizontalIcon} href="/more" />
      </div>

      {/* Tweet button */}
      <button className="hidden xl:inline ml-14 bg-[#1d9bf0] text-white rounded-full py-2 px-16 text-lg font-bold shadow-md hover:bg-[#1a8cd8]">
        Tweet
      </button>

      {/* User Profile + Sign out */}
      {session && (
        <div className="text-[#d9d9d9] flex items-center justify-center mt-auto mb-4 hoverAnimation xl:ml-12 xl:-mr-5">
          <img
            src={session?.user?.image || "/default-avatar.png"}
            alt={session?.user?.name || "User avatar"}
            className="h-10 w-10 rounded-full xl:mr-2.5"
          />
          <div className="hidden xl:inline leading-5">
            <h4 className="font-bold">{session?.user?.name}</h4>
            <p className="text-[#6e767d]">@{session?.user?.tag}</p>
          </div>
          <DotsHorizontalIcon
            className="h-5 hidden xl:inline ml-10 cursor-pointer"
            onClick={signOut}
          />
        </div>
      )}
    </div>
  );
}

export default Sidebar;
