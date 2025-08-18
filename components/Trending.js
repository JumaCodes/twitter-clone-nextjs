function Trending({ result }) {
  return (
    <div className="hover:bg-white hover:bg-opacity-[0.03] px-4 py-2 cursor-pointer transition duration-200 ease-out">
      <h4 className="font-bold">{result.title}</h4>
      <p className="text-gray-500 text-sm">{result.source}</p>
    </div>
  );
}

export default Trending;
