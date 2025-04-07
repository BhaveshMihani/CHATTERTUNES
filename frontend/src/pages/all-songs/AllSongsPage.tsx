import { useMusicStore } from "@/stores/useMusicStore";
import { useEffect } from "react";
import SectionGridSkeleton from "../home/components/SectionGridSkeleton";
import Topbar from "@/components/Topbar";
import { ScrollArea } from "@/components/ui/scroll-area";
import PlayButton from "../home/components/PlayButton";

const AllSongsPage = () => {
	const { fetchSongs, songs, isLoading } = useMusicStore();

	useEffect(() => {
		fetchSongs();
	}, [songs]);

	return (
		<main className='rounded-md overflow-hidden h-full bg-gradient-to-b from-zinc-800 to-zinc-900'>
			<Topbar />
			<ScrollArea className='h-[calc(100vh-180px)]'>
				<div className='p-4 sm:p-6'>
					<h1 className='text-2xl sm:text-3xl font-bold mb-6'>All Songs</h1>
					{isLoading ? (
						<SectionGridSkeleton />
					) : (
						<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
							{songs.map((song) => (
								<div
									key={song._id}
									className='bg-zinc-800/40 p-4 rounded-md hover:bg-zinc-700/40 transition-all group cursor-pointer'
								>
									<div className='relative mb-4'>
										<div className='aspect-square rounded-md shadow-lg overflow-hidden'>
											<img
												src={song.imageUrl}
												alt={song.title}
												className='w-full h-full object-cover transition-transform duration-300 
												group-hover:scale-105'
											/>
										</div>
										<PlayButton song={song} />
									</div>
									<h3 className='font-medium mb-2 truncate'>{song.title}</h3>
									<p className='text-sm text-zinc-400 truncate'>{song.artist}</p>
								</div>
							))}
						</div>
					)}
				</div>
			</ScrollArea>
		</main>
	);
};

export default AllSongsPage;
