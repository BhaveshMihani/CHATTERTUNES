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
import { Upload } from "lucide-react"; // Import Upload icon
import { useRef, useState } from "react";

interface UpdateUser {
  _id: string;
  fullName: string;
  imageUrl: string;
}

const UpdateUserDialog = ({ user, children }: { user: UpdateUser, children: React.ReactNode }) => {
  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [updatedUser, setUpdatedUser] = useState<UpdateUser>({
    _id: user._id,
    fullName: user.fullName,
    imageUrl: user.imageUrl,
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      const formData = new FormData();

      formData.append("id", updatedUser._id);
      formData.append("fullName", updatedUser.fullName);
      formData.append("event.type", "user.updated"); 

      if (imageFile) {
        formData.append("imageFile", imageFile);
      } else {
        formData.append("imageUrl", updatedUser.imageUrl);
      }

      const response = await fetch('/api/auth/callback', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to update user');
      }
    } catch (error: any) {
      console.error("Error updating user:", error);
    } finally {
      setIsLoading(false);
      setUserDialogOpen(false);
    }
  };

  return (
    <Dialog open={userDialogOpen} onOpenChange={setUserDialogOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>

      <DialogContent className='bg-zinc-900 border-zinc-700 max-h-[80vh] overflow-auto'>
        <DialogHeader>
          <DialogTitle>Update User</DialogTitle>
          <DialogDescription>Update the user details</DialogDescription>
        </DialogHeader>

        <div className='space-y-4 py-4'>
          <input
            type='file'
            ref={imageInputRef}
            className='hidden'
            accept='image/*'
            onChange={(e) => setImageFile(e.target.files![0])}
          />

          {/* image upload area */}
          <div
            className='flex items-center justify-center p-6 border-2 border-dashed border-zinc-700 rounded-lg cursor-pointer'
            onClick={() => imageInputRef.current?.click()}
          >
            <div className='text-center'>
              {imageFile ? (
                <div className='space-y-2'>
                  <div className='text-sm text-cyan-500'>Image selected:</div>
                  <div className='text-xs text-zinc-400'>{imageFile.name.slice(0, 20)}</div>
                </div>
              ) : (
                <>
                  <div className='p-3 bg-zinc-800 rounded-full inline-block mb-2'>
                    <Upload className='h-6 w-6 text-zinc-400' />
                  </div>
                  <div className='text-sm text-zinc-400 mb-2'>Upload profile picture</div>
                  <Button variant='outline' size='sm' className='text-xs'>
                    Choose File
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* other fields */}
          <div className='space-y-2'>
            <label className='text-sm font-medium'>Full Name</label>
            <Input
              value={updatedUser.fullName}
              onChange={(e) => setUpdatedUser({ ...updatedUser, fullName: e.target.value })}
              className='bg-zinc-800 border-zinc-700'
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant='outline' onClick={() => setUserDialogOpen(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "Updating..." : "Update User"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateUserDialog;
