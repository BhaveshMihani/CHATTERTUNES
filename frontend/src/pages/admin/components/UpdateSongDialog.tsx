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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMusicStore } from "@/stores/useMusicStore";
import {  Upload } from "lucide-react"; // Import Pencil icon
import { useRef, useState } from "react";
import { MultiSelect } from "@/components/ui/multi-select"; // Import MultiSelect component

interface UpdateSong {
  _id: string;
  title: string;
  artist: string;
  albumId: string;
  duration: string;
  Genres: string[]; // Added Genres
}

const UpdateSongDialog = ({ song, children }: { song: UpdateSong, children: React.ReactNode }) => {
  const { albums, updateSong } = useMusicStore();
  const [songDialogOpen, setSongDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [updatedSong, setUpdatedSong] = useState<UpdateSong>({
    _id: song._id,
    title: song.title,
    artist: song.artist,
    albumId: song.albumId || "",
    duration: song.duration.toString(),
    Genres: song.Genres || [], // Added Genres
  });

  const [files, setFiles] = useState<{ audio: File | null; image: File | null }>({
    audio: null,
    image: null,
  });

  const audioInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      const formData = new FormData();

      formData.append("title", updatedSong.title);
      formData.append("artist", updatedSong.artist);
      formData.append("duration", updatedSong.duration);
      if (updatedSong.albumId && updatedSong.albumId !== "none") {
        formData.append("albumId", updatedSong.albumId);
      }
      formData.append("Genres", updatedSong.Genres.join(',')); // Added Genres

      if (files.audio) {
        formData.append("audioFile", files.audio);
      }
      if (files.image) {
        formData.append("imageFile", files.image);
      }

      await updateSong(updatedSong._id, formData);

    } catch (error: any) {
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={songDialogOpen} onOpenChange={setSongDialogOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>

      <DialogContent className='bg-zinc-900 border-zinc-700 max-h-[80vh] overflow-auto'>
        <DialogHeader>
          <DialogTitle>Update Song</DialogTitle>
          <DialogDescription>Update the song details</DialogDescription>
        </DialogHeader>

        <div className='space-y-4 py-4'>
          <input
            type='file'
            accept='audio/*'
            ref={audioInputRef}
            hidden
            onChange={(e) => setFiles((prev) => ({ ...prev, audio: e.target.files![0] }))}
          />

          <input
            type='file'
            ref={imageInputRef}
            className='hidden'
            accept='image/*'
            onChange={(e) => setFiles((prev) => ({ ...prev, image: e.target.files![0] }))}
          />

          {/* image upload area */}
          <div
            className='flex items-center justify-center p-6 border-2 border-dashed border-zinc-700 rounded-lg cursor-pointer'
            onClick={() => imageInputRef.current?.click()}
          >
            <div className='text-center'>
              {files.image ? (
                <div className='space-y-2'>
                  <div className='text-sm text-cyan-500'>Image selected:</div>
                  <div className='text-xs text-zinc-400'>{files.image.name.slice(0, 20)}</div>
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

          {/* Audio upload */}
          <div className='space-y-2'>
            <label className='text-sm font-medium'>Audio File</label>
            <div className='flex items-center gap-2'>
              <Button variant='outline' onClick={() => audioInputRef.current?.click()} className='w-full'>
                {files.audio ? files.audio.name.slice(0, 20) : "Choose Audio File"}
              </Button>
            </div>
          </div>

          {/* other fields */}
          <div className='space-y-2'>
            <label className='text-sm font-medium'>Title</label>
            <Input
              value={updatedSong.title}
              onChange={(e) => setUpdatedSong({ ...updatedSong, title: e.target.value })}
              className='bg-zinc-800 border-zinc-700'
            />
          </div>

          <div className='space-y-2'>
            <label className='text-sm font-medium'>Artist</label>
            <Input
              value={updatedSong.artist}
              onChange={(e) => setUpdatedSong({ ...updatedSong, artist: e.target.value })}
              className='bg-zinc-800 border-zinc-700'
            />
          </div>

          <div className='space-y-2'>
            <label className='text-sm font-medium'>Duration (seconds)</label>
            <Input
              type='number'
              min='0'
              value={updatedSong.duration}
              onChange={(e) => setUpdatedSong({ ...updatedSong, duration: e.target.value || "0" })}
              className='bg-zinc-800 border-zinc-700'
            />
          </div>

          <div className='space-y-2'>
            <label className='text-sm font-medium'>Album (Optional)</label>
            <Select
              value={updatedSong.albumId}
              onValueChange={(value) => setUpdatedSong({ ...updatedSong, albumId: value })}
            >
              <SelectTrigger className='bg-zinc-800 border-zinc-700'>
                <SelectValue placeholder='Select album' />
              </SelectTrigger>
              <SelectContent className='bg-zinc-800 border-zinc-700'>
                <SelectItem value='none'>No Album (Single)</SelectItem>
                {albums.map((album) => (
                  <SelectItem key={album._id} value={album._id}>
                    {album.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Genres selection */}
          <div className='space-y-2'>
            <label className='text-sm font-medium'>Genres</label>
            <MultiSelect
              options={["Calm", "Exciting", "Melancholic", "Uplifting", "Funky", "Relaxed", "Groovy", "Festive", "Soulful", "Ambient"]}
              selected={updatedSong.Genres}
              onChange={(Genres) => setUpdatedSong({ ...updatedSong, Genres })}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant='outline' onClick={() => setSongDialogOpen(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "Updating..." : "Update Song"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default UpdateSongDialog;