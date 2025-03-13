import { UserButton } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import DownloadCSV from "./DownloadCsv"; // Import DownloadCSV

const Header = () => {
	return (
		<div className='flex items-center justify-between'>
			<div className='flex items-center gap-3 mb-8'>
				<Link to='/' className='rounded-lg'>
					<img src='/headphone1.png' className='size-12 text-black' />
				</Link>
				<div>
					<h1 className='text-3xl font-bold'>Music Manager</h1>
					<p className='text-zinc-400 mt-1'>Manage your music catalog</p>
				</div>
			</div>
			<div className='flex items-center gap-3'> {/* Added a wrapper div */}
				<DownloadCSV /> {/* Moved DownloadCSV button here */}
				<UserButton />
			</div>
		</div>
	);
};
export default Header;
