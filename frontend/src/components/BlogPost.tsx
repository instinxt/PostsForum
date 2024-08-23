import { Post } from "../types";
import { FaRegHeart } from "react-icons/fa";
import { FaRegBookmark } from "react-icons/fa6";
import { IoIosStats } from "react-icons/io";

export const BlogPost: React.FC<{ key: number; post: Post }> = ({ post }) => {
	const publishTime = () => {
		const time = new Date(post.timestamp);

		// Extracting day, month, and year
		const day = time.getDate(); // Day of the month
		const monthIndex = time.getMonth(); // Month is zero-indexed
		const year = time.getFullYear(); // Full year

		// Array of month names
		const monthNames = [
			"January",
			"February",
			"March",
			"April",
			"May",
			"June",
			"July",
			"August",
			"September",
			"October",
			"November",
			"December",
		];

		// Formatting the date in day month year format
		const formattedTime = `${day} ${monthNames[monthIndex]} ${year}`;

		return formattedTime;
	};
	return (
		<div className="flex flex-col w-full mt-5 p-5 border-2 border-slate-400">
			<div className="flex flex-col">
				<h1 className="font-bold text-lg">{post.title}</h1>
				<p className="text-slate-400 font-bold">{post.context}</p>
				<div className="flex flex-wrap w-full">
					{post.tags.map((tag, index) => (
						<span
							className="bg-slate-200 mr-2 mt-2 px-4 py-1 rounded-xl text-sm"
							key={index}
						>
							{tag}
						</span>
					))}
				</div>
				<p className="text-sm font-bold mt-2">
					Published : {`${publishTime()}`}
				</p>
				<p className="text-sm font-bold">{post.location}</p>
			</div>
			<hr className="border-2 mt-2 -ml-5 -mr-5" />
			<div className="mt-5 mb-5">{post.message}</div>
			<hr className="border-2 mt-2 -ml-5 -mr-5" />
			<div className="font-semibold text-blue-500 mt-2">
				{"Links : "}
				<a
					href={post.externalLinks[0]}
					target="_blank"
					rel="noopener noreferrer"
					className="underline"
				>
					{post.externalLinks[0]}
				</a>
			</div>
			<div className="flex justify-start items-center mt-5">
				<span className="flex flex-col justify-center items-center pr-2 py-2 mr-2 my-2 cursor-pointer">
					<FaRegHeart />
					{post.numLikes}
				</span>
				<span className="flex flex-col justify-center items-center pr-2 py-2 mr-2 my-2 cursor-pointer">
					<FaRegBookmark />
					{post.numBookmarks}
				</span>
				<span className="flex flex-col justify-center items-center pr-2 py-2 mr-2 my-2 cursor-pointer">
					<IoIosStats />
					{post.numViews}
				</span>
			</div>
		</div>
	);
};
