import Link from "next/link";

function SidebarLink({ text, Icon, active, href = "#" }) {
  return (
    <Link href={href} className="group">
      <div
        className={`text-[#d9d9d9] flex items-center justify-center xl:justify-start text-xl space-x-3 hoverAnimation ${
          active ? "font-bold text-white" : "font-light"
        }`}
      >
        <Icon className="h-7" />
        <span className="hidden xl:inline">{text}</span>
      </div>
    </Link>
  );
}

export default SidebarLink;
