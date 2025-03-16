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
import { useMusicStore } from "@/stores/useMusicStore";
import { Upload } from "lucide-react"; // Import Upload icon
import { useRef, useState } from "react";

interface UpdateAlbum {
  _id: string;
  title: string;
  artist: string;
  releaseYear: string;
}

const UpdateAlbumDialog = ({ album, children }: { album: UpdateAlbum, children: React.ReactNode }) => {
  const { updateAlbum } = useMusicStore();
  const [albumDialogOpen, setAlbumDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [updatedAlbum, setUpdatedAlbum] = useState<UpdateAlbum>({
    _id: album._id,
    title: album.title,
    artist: album.artist,
    releaseYear: album.releaseYear,
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      const formData = new FormData();

      formData.append("title", updatedAlbum.title);
      formData.append("artist", updatedAlbum.artist);
      formData.append("releaseYear", updatedAlbum.releaseYear);

      if (imageFile) {
        formData.append("imageFile", imageFile);
      }

      await updateAlbum(updatedAlbum._id, formData);

    } catch (error: any) {
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={albumDialogOpen} onOpenChange={setAlbumDialogOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>

      <DialogContent className='bg-zinc-900 border-zinc-700 max-h-[80vh] overflow-auto'>
        <DialogHeader>
          <DialogTitle>Update Album</DialogTitle>
          <DialogDescription>Update the album details</DialogDescription>
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
                  <div className='text-sm text-zinc-400 mb-2'>Upload artwork</div>
                  <Button variant='outline' size='sm' className='text-xs'>
                    Choose File
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* other fields */}
          <div className='space-y-2'>
            <label className='text-sm font-medium'>Title</label>
            <Input
              value={updatedAlbum.title}
              onChange={(e) => setUpdatedAlbum({ ...updatedAlbum, title: e.target.value })}
              className='bg-zinc-800 border-zinc-700'
            />
          </div>

          <div className='space-y-2'>
            <label className='text-sm font-medium'>Artist</label>
            <Input
              value={updatedAlbum.artist}
              onChange={(e) => setUpdatedAlbum({ ...updatedAlbum, artist: e.target.value })}
              className='bg-zinc-800 border-zinc-700'
            />
          </div>

          <div className='space-y-2'>
            <label className='text-sm font-medium'>Release Year</label>
            <Input
              type='number'
              min='0'
              value={updatedAlbum.releaseYear}
              onChange={(e) => setUpdatedAlbum({ ...updatedAlbum, releaseYear: e.target.value || "0" })}
              className='bg-zinc-800 border-zinc-700'
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant='outline' onClick={() => setAlbumDialogOpen(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "Updating..." : "Update Album"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default UpdateAlbumDialog;
