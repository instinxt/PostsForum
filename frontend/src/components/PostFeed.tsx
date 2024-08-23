import { dummyPosts } from "../data/dummyPosts";
import { BlogPost } from "./BlogPost";
export const PostFeed = () => {
	return (
		<div className="flex-[0.6] flex-col mr-4 pt-5 pb-5">
			<div className="flex justify-center">
				<button className="flex justify-center items-center bg-green-400 px-8 py-2 rounded-lg font-bold hover:bg-slate-400">
					Generate Post
				</button>
			</div>
			<div className="flex flex-col items-center m-3">
				{dummyPosts.map((post, index) => (
					<BlogPost key={index} post={post} />
				))}
			</div>
		</div>
	);
};
