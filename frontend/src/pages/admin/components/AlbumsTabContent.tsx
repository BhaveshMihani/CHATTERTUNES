import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Library, Search } from "lucide-react";
import { useState } from "react";
import AlbumsTable from "./AlbumsTable";
import AddAlbumDialog from "./AddAlbumDialog";

const AlbumsTabContent = () => {
	const [searchTerm, setSearchTerm] = useState("");

	return (
		<Card className='bg-slate-950 border-zinc-700/50'>
			<CardHeader>
				<div className='flex items-center justify-between'>
					<div>
						<CardTitle className='flex items-center gap-2'>
							<Library className='h-5 w-5 text-violet-500' />
							Albums Library
						</CardTitle>
						<CardDescription>Manage your album collection</CardDescription>
					</div>
					<div className="flex items-center gap-2">
						<div className="relative">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400" />
							<input
								type="text"
								placeholder="Search albums..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="pl-10 pr-3 py-1 text-sm bg-zinc-800 text-zinc-100 border border-zinc-700 rounded-2xl"
							/>
						</div>
						<AddAlbumDialog />
					</div>
				</div>
			</CardHeader>

			<CardContent>
				<AlbumsTable searchTerm={searchTerm} />
			</CardContent>
		</Card>
	);
};
export default AlbumsTabContent;
