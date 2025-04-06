import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Music, Search } from "lucide-react";
import SongsTable from "./SongsTable";
import AddSongDialog from "./AddSongDialog";
import { useState } from "react";

const SongsTabContent = () => {
	const [searchTerm, setSearchTerm] = useState("");

	return (
		<Card>
			<CardHeader>
				<div className='flex items-center justify-between'>
					<div>
						<CardTitle className='flex items-center gap-2'>
							<Music className='size-5 text-cyan-500' />
							Songs Library
						</CardTitle>
						<CardDescription>Manage your music tracks</CardDescription>
					</div>
					<div className="flex items-center gap-2">
						<div className="relative">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400" />
							<input
								type="text"
								placeholder="Search songs..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="pl-10 pr-3 py-1 text-sm bg-zinc-800 text-zinc-100 border border-zinc-700 rounded-2xl"
							/>
						</div>
						<AddSongDialog />
					</div>
				</div>
			</CardHeader>
			<CardContent>
				<SongsTable searchTerm={searchTerm} />
			</CardContent>
		</Card>
	);
};
export default SongsTabContent;
