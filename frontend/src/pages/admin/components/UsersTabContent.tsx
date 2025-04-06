import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { LucideUsers2 } from 'lucide-react'
import UsersTable from './UsersTable'

const UsersTabContent = () => {
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
					{/* <AddUserDialog /> */}
				</div>
			</CardHeader>

			<CardContent>
				<UsersTable />
			</CardContent>
		</Card>
  )
}

export default UsersTabContent