import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useMusicStore } from "@/stores/useMusicStore";
import { Calendar, Music, Trash2, Pencil } from "lucide-react";
import { useEffect } from "react";
import UpdateAlbumDialog from "./UpdateAlbumDialog";

interface AlbumsTableProps {
	searchTerm: string;
}

const AlbumsTable = ({ searchTerm }: AlbumsTableProps) => {
	const { albums, isLoading, error, deleteAlbum, fetchAlbums } = useMusicStore();

	useEffect(() => {
		fetchAlbums();
	}, [fetchAlbums]);

	if (isLoading) {
		return (
			<div className="flex items-center justify-center py-8">
				<div className="text-zinc-400">Loading albums...</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex items-center justify-center py-8">
				<div className="text-red-400">{error}</div>
			</div>
		);
	}

	return (
		<Table>
			<TableHeader>
				<TableRow className='hover:bg-zinc-800/50'>
					<TableHead className='w-[50px]'></TableHead>
					<TableHead>Title</TableHead>
					<TableHead>Artist</TableHead>
					<TableHead>Release Year</TableHead>
					<TableHead>Songs</TableHead>
					<TableHead className='text-right'>Edit</TableHead>
					<TableHead className='text-right'>Delete</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{albums
					.filter((album) =>
						album.title.toLowerCase().includes(searchTerm.toLowerCase())
					)
					.map((album) => (
						<TableRow key={album._id} className='hover:bg-zinc-800/50'>
							<TableCell>
								<img src={album.imageUrl} alt={album.title} className='w-10 h-10 rounded object-cover' />
							</TableCell>
							<TableCell className='font-medium'>{album.title}</TableCell>
							<TableCell>{album.artist}</TableCell>
							<TableCell>
								<span className='inline-flex items-center gap-1 text-zinc-400'>
									<Calendar className='h-4 w-4' />
									{album.releaseYear}
								</span>
							</TableCell>
							<TableCell>
								<span className='inline-flex items-center gap-1 text-zinc-400'>
									<Music className='h-4 w-4' />
									{album.songs.length} songs
								</span>
							</TableCell>
							<TableCell>
								<div className="flex gap-2 justify-end">
									<UpdateAlbumDialog album={{ ...album, releaseYear: album.releaseYear.toString() }}>
										<Button
											variant='ghost'
											size='sm'
											className='text-zinc-400 hover:text-zinc-300 hover:bg-cyan-400/10'
										>
											<Pencil className='h-4 w-4' />
										</Button>
									</UpdateAlbumDialog>
								</div>
							</TableCell>
							<TableCell className='text-right'>
								<div className='flex gap-2 justify-end'>
									<Button
										variant='ghost'
										size='sm'
										onClick={() => deleteAlbum(album._id)}
										className='text-red-400 hover:text-red-300 hover:bg-red-400/10'
									>
										<Trash2 className='h-4 w-4' />
									</Button>
								</div>
							</TableCell>
						</TableRow>
					))}
			</TableBody>
		</Table>
	);
};
export default AlbumsTable;
