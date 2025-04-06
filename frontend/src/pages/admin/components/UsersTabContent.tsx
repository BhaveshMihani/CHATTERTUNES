import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { LucideUsers2, Search } from 'lucide-react'
import UsersTable from './UsersTable'
import { useState } from "react";
import AddUserDialog from './AddUserDialog';

const UsersTabContent = () => {
	const [searchTerm, setSearchTerm] = useState("");

	return (
		<Card className='bg-slate-950 border-zinc-700/50'>
			<CardHeader>
				<div className='flex items-center justify-between'>
					<div>
						<CardTitle className='flex items-center gap-2'>
							<LucideUsers2 className='h-5 w-5 text-blue-500' />
							User List
						</CardTitle>
						<CardDescription>Manage your users List</CardDescription>
					</div>
					<div className="flex items-center gap-2">
						<div className="relative">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400" />
							<input
								type="text"
								placeholder="Search users..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="pl-10 pr-3 py-1 text-sm bg-zinc-800 text-zinc-100 border border-zinc-700 rounded-2xl"
							/>
						</div>
						<AddUserDialog /> 
					</div>
				</div>
			</CardHeader>

			<CardContent>
				<UsersTable searchTerm={searchTerm} />
			</CardContent>
		</Card>
	);
};

export default UsersTabContent;