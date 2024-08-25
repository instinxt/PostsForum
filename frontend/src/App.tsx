import { BlogPost } from "./components/BlogPost";
import { FaSearch } from "react-icons/fa";
import { dummyPosts } from "./data/dummyPosts";
import { getRandomPost } from "./utils";
import { createPost, fetchPosts, getPostCount, getQueueSize } from "./api";
import { useEffect, useState } from "react";
import { Post } from "./types";
import { Bounce, Slide, toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
	const [postCount, setPostCount] = useState<number>(0);
	const [failedPosts, setFailedPosts] = useState<number>(0);
	const [successPosts, setSuccessPosts] = useState<number>(0);
	const [dbPostsCount, setDbPostsCount] = useState<number>(0);
	const [queueSize, setQueueSize] = useState<number>(0);
	const [searchText, setSearchText] = useState<string>("");
	const [posts, setPosts] = useState<Post[]>([]);
	const [isFetching, setIsFetching] = useState(true); // Track if we should be fetching

	const generatePost = async () => {
		const Post = getRandomPost(dummyPosts);
		try {
			await createPost(Post);
			setSuccessPosts((prevCount) => prevCount + 1);

			// Set new Post in the feed
			const currentPosts = [...posts];
			currentPosts.unshift(Post);
			setPosts(currentPosts);
			setPostCount(currentPosts!.length);
		} catch (err) {
			setFailedPosts((prevCount) => prevCount + 1);
			toast.error("Failed to create Post", {
				position: "top-right",
				autoClose: 5000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				theme: "dark",
				transition: Bounce,
			});
			console.error("Failed to create Post...", err);
		}
	};

	const resetStats = () => {
		setPostCount(0);
		setFailedPosts(0);
		setSuccessPosts(0);
	};

	const handleSearch = async () => {
		// Warn for empty text search
		if (!searchText) {
			toast.warn("Please enter text", {
				position: "top-right",
				autoClose: 5000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				theme: "dark",
				transition: Bounce,
			});
			return;
		}

		try {
			toast.info("Searching the universe....", {
				position: "top-center",
				autoClose: 1000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				theme: "colored",
				transition: Bounce,
			});
			const searchPosts = await fetchPosts(searchText);
			if (!searchPosts) {
				toast.error("No results found... NADA", {
					position: "top-right",
					autoClose: 5000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					progress: undefined,
					theme: "dark",
					transition: Slide,
				});
				return;
			}
			setPosts(searchPosts!);
			setPostCount(searchPosts!.length);
		} catch (err) {
			console.log("Error in Search", err);
		}
	};

	const getDbAndQueueStats = async (): Promise<Record<string, number>> => {
		let dbRecords, queueCount;
		try {
			dbRecords = await getPostCount();
		} catch (err) {
			dbRecords = -1;
			console.error("Failed to get DB records count!", err);
		}

		try {
			queueCount = await getQueueSize();
		} catch (err) {
			queueCount = -1;
			console.error("Failed to get DB records count!", err);
		}

		return { dbRecords, queueCount };
	};

	useEffect(() => {
		const interval = setInterval(async () => {
			if (!isFetching) return; // Exit if we're not fetching

			const { dbRecords, queueCount } = await getDbAndQueueStats();

			// Check if both values indicate the server is down
			if (dbRecords === -1 && queueCount === -1) {
				console.log("Server is down. Stopping fetch calls.");
				setIsFetching(false); // Stop fetching
				clearInterval(interval); // Clear the interval
				return;
			}

			// Update state if values have changed
			if (dbPostsCount !== dbRecords) {
				setDbPostsCount(dbRecords);
			}

			if (queueSize !== queueCount) {
				setQueueSize(queueCount);
			}
		}, 500);

		return () => clearInterval(interval);
	}, [dbPostsCount, queueSize, isFetching]);

	return (
		<div className="flex flex-col font-mono w-full h-full items-center justify-start p-8">
			<ToastContainer />
			{/* Search Bar */}
			<div className="flex justify-center items-center border-2 border-slate-400 w-[90%]">
				<input
					type="text"
					placeholder="Search away...."
					value={searchText}
					onChange={(e) => setSearchText(e.target.value)}
					className="flex p-2 items-center border-2 bg-gray-100 text-black font-semibold w-96"
				/>
				<button
					onClick={handleSearch}
					className="flex justify-center items-center rounded-lg p-3 bg-pink-300  m-2"
				>
					<FaSearch />
				</button>
			</div>
			<div className="flex w-[90%] justify-center p-4">
				{/* Post Stats */}
				<div className="sticky top-4 flex-[0.2] flex-col items-center justify-start w-full h-fit mr-4 ml-4">
					<div className="flex flex-col justify-center gap-y-2 p-2 border-2 border-slate-400">
						<h1 className="font-bold text-lg">Post Count : {postCount}</h1>
						<hr className="border-1 border-gray-400 -mx-2" />
						<h1 className="font-bold text-2xl">Post Stats</h1>
						<hr className="border-1 border-gray-400 -mx-2" />
						<p className="font-semibold text-green-600 text-lg">
							Successful : {successPosts}
						</p>
						<p className="font-semibold text-red-600 text-lg">
							Failed : {failedPosts}
						</p>
						<p className="font-semibold text-yellow-600 text-lg">
							Total : {`${successPosts + failedPosts}`}
						</p>
					</div>
					<div className="flex justify-center pt-5">
						<button
							onClick={resetStats}
							className="flex justify-center items-center bg-red-400 px-8 py-2 rounded-lg font-bold hover:bg-black hover:text-white"
						>
							Reset
						</button>
					</div>
				</div>

				{/* Post Feed */}

				<div className="flex-[0.6] flex-col mr-4 pt-5 pb-5">
					<div className="flex justify-center">
						<button
							onClick={generatePost}
							className="flex justify-center items-center bg-green-400 px-8 py-2 rounded-lg font-bold hover:bg-slate-400"
						>
							Generate Post
						</button>
					</div>
					<div className="flex flex-col items-center m-3">
						{posts.map((post, index) => (
							<BlogPost key={index} post={post} />
						))}
					</div>
				</div>

				{/* Database Post Stats */}
				<div className="sticky top-4 flex flex-col h-[100px] mr-8 p-5 pr-8 border-2 border-slate-400">
					<p className="font-semibold text-lg">Queue Size : {queueSize}</p>
					<p className="font-semibold text-lg">Posts in DB : {dbPostsCount}</p>
				</div>
			</div>
		</div>
	);
}

export default App;
