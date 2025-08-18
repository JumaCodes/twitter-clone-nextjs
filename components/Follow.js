import Image from "next/image";

function Follow({ result }) {
  return (
    <div className="hover:bg-white hover:bg-opacity-[0.03] px-4 py-2 cursor-pointer transition duration-200 ease-out flex items-center">
      <Image
  src={result.image || "/default-profile.png"}
  width={60}
  height={60}
  alt={result.name || "User"}
  className="rounded-full p-2 object-cover"
/>


      <div className="ml-4 leading-5 group">
        <h4 className="font-bold group-hover:underline">{result.name}</h4>
        <h5 className="text-gray-500 text-[15px]">@{result.tag}</h5>
      </div>
      <button className="ml-auto bg-white text-black rounded-full font-bold text-sm py-1.5 px-3.5">
        Follow
      </button>
    </div>
  );
}

export default Follow;
