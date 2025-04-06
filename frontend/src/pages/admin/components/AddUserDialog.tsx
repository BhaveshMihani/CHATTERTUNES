import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { axiosInstance } from "@/lib/axios";
import { Plus, Upload } from "lucide-react";
import { useState, useRef } from "react";
import toast from "react-hot-toast";

const AddUserDialog = () => {
	const [userDialogOpen, setUserDialogOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [imageFile, setImageFile] = useState<File | null>(null);

	const [newUser, setNewUser] = useState({
		fullName: "",
		email: "",
		clerkId: "",
		imageUrl: "",
	});

	const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setImageFile(file);
			setNewUser((prevUser) => ({ ...prevUser, imageUrl: URL.createObjectURL(file) }));
		}
	};

	const handleSubmit = async () => {
		setIsLoading(true);

		try {
			if (!newUser.fullName || !newUser.email || !newUser.clerkId) {
				return toast.error("Please fill in all required fields");
			}

			await axiosInstance.post("/auth/callback", {
				type: "user.created",
				data: {
					id: newUser.clerkId,
					email_addresses: [{ email_address: newUser.email }],
					first_name: newUser.fullName.split(" ")[0],
					last_name: newUser.fullName.split(" ").slice(1).join(" "),
					image_url: newUser.imageUrl,
				},
			});

			setNewUser({
				fullName: "",
				email: "",
				clerkId: "",
				imageUrl: "",
			});
			setImageFile(null);
			setUserDialogOpen(false);
			toast.success("User added successfully");
		} catch (error: any) {
			toast.error("Failed to add user: " + error.message);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Dialog open={userDialogOpen} onOpenChange={setUserDialogOpen}>
			<DialogTrigger asChild>
				<Button className='bg-blue-500 hover:bg-blue-600 text-black'>
					<Plus className='mr-2 h-4 w-4' />
					Add User
				</Button>
			</DialogTrigger>
			<DialogContent className='bg-zinc-900 border-zinc-700'>
				<DialogHeader>
					<DialogTitle>Add New User</DialogTitle>
					<DialogDescription>Add a new user to the database</DialogDescription>
				</DialogHeader>
				<div className='space-y-4 py-4'>
					<div className='space-y-2'>
						<label className='text-sm font-medium'>Full Name</label>
						<Input
							value={newUser.fullName}
							onChange={(e) => setNewUser({ ...newUser, fullName: e.target.value })}
							className='bg-zinc-800 border-zinc-700'
							placeholder='Enter full name'
						/>
					</div>
					<div className='space-y-2'>
						<label className='text-sm font-medium'>Email</label>
						<Input
							type='email'
							value={newUser.email}
							onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
							className='bg-zinc-800 border-zinc-700'
							placeholder='Enter email address'
						/>
					</div>
					<div className='space-y-2'>
						<label className='text-sm font-medium'>Clerk ID</label>
						<Input
							value={newUser.clerkId}
							onChange={(e) => setNewUser({ ...newUser, clerkId: e.target.value })}
							className='bg-zinc-800 border-zinc-700'
							placeholder='Enter Clerk ID'
						/>
					</div>
					<div>
						<input
							type='file'
							ref={fileInputRef}
							onChange={handleImageSelect}
							accept='image/*'
							className='hidden'
						/>
						<div
							className='flex items-center justify-center p-6 border-2 border-dashed border-zinc-700 rounded-lg cursor-pointer'
							onClick={() => fileInputRef.current?.click()}
						>
							<div className='text-center'>
								<div className='p-3 bg-zinc-800 rounded-full inline-block mb-2'>
									<Upload className='h-6 w-6 text-zinc-400' />
								</div>
								<div className='text-sm text-zinc-400 mb-2'>
									{imageFile ? imageFile.name : "Upload user image"}
								</div>
								<Button variant='outline' size='sm' className='text-xs'>
									Choose File
								</Button>
							</div>
						</div>
					</div>
				</div>
				<DialogFooter>
					<Button variant='outline' onClick={() => setUserDialogOpen(false)} disabled={isLoading}>
						Cancel
					</Button>
					<Button
						onClick={handleSubmit}
						className='bg-blue-500 hover:bg-blue-600'
						disabled={isLoading || !newUser.fullName || !newUser.email || !newUser.clerkId}
					>
						{isLoading ? "Adding..." : "Add User"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default AddUserDialog;