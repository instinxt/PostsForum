export const PostStats = () => {
	return (
		<div className="sticky top-4 flex-[0.2] flex-col items-center justify-start w-full h-fit mr-4 ml-4 p-5 border-2 border-slate-400">
			<div className="flex flex-col justify-center gap-y-2 p-2 border-2 border-slate-400">
				<h1 className="font-bold text-lg">Post Count : {"200"}</h1>
				<hr className="border-1 border-gray-400" />
				<h1 className="font-bold text-2xl">Post Stats</h1>
				<hr className="border-1 border-gray-400" />
				<p className="font-semibold text-green-600">Successful : {"100"}</p>
				<p className="font-semibold text-red-600">Failed : {"100"}</p>
				<p className="font-semibold text-yellow-600">Total : {"200"}</p>
			</div>
			<div className="flex justify-center pt-5">
				<button className="flex justify-center items-center bg-red-400 px-8 py-2 rounded-lg font-bold hover:bg-black hover:text-white">
					Reset
				</button>
			</div>
		</div>
	);
};
