import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMusicStore } from "@/stores/useMusicStore";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { Clock, Loader2, Pause, Play } from "lucide-react";
import { useParams } from "react-router-dom";

export const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

const getDominantColors = (imageUrl: string): Promise<string[]> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = imageUrl;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (ctx) {
        const width = (canvas.width = img.width);
        const height = (canvas.height = img.height);
        ctx.drawImage(img, 0, 0, width, height);
        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;

        const colorSamples: [number, number, number][] = [];
        const stepSize = Math.floor((width * height) / 1000); // Sample 1000 pixels

        for (let i = 0; i < data.length; i += stepSize * 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          colorSamples.push([r, g, b]);
        }

        const avgColor = colorSamples
          .reduce(
            ([rTotal, gTotal, bTotal], [r, g, b]) => [
              rTotal + r,
              gTotal + g,
              bTotal + b,
            ],
            [0, 0, 0]
          )
          .map((total) => Math.floor(total / colorSamples.length));

        resolve([`rgb(${avgColor[0]}, ${avgColor[1]}, ${avgColor[2]})`]);
      }
    };
  });
};

const AlbumPage: React.FC = () => {
  const { albumId } = useParams<{ albumId: string }>();
  const { fetchAlbumById, currentAlbum, isLoading, error } = useMusicStore();
  const { currentSong, isPlaying, playAlbum, togglePlay } = usePlayerStore();
  const [bgColor, setBgColor] = useState("transparent");

  useEffect(() => {
    if (albumId) fetchAlbumById(albumId);
  }, [fetchAlbumById, albumId]);

  useEffect(() => {
    if (currentAlbum?.imageUrl) {
      getDominantColors(currentAlbum.imageUrl).then((colors) => {
        setBgColor(colors[0]);
      });
    }
  }, [currentAlbum]);

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="size-16 text-blue-500 animate-spin" />
      </div>
    );

  if (error) return <div>Error loading album: {error}</div>;

  const handlePlayAlbum = () => {
    if (!currentAlbum) return;

    const isCurrentAlbumPlaying = currentAlbum.songs.some(
      (song) => song._id === currentSong?._id
    );
    if (isCurrentAlbumPlaying) togglePlay();
    else playAlbum(currentAlbum.songs, 0);
  };

  const handlePlaySong = (index: number) => {
    if (!currentAlbum) return;
    playAlbum(currentAlbum.songs, index);
  };

  return (
      <div className="h-full" style={{ backgroundColor: bgColor }}>
        <ScrollArea className="h-full rounded-md">
          <div className="relative min-h-full">
            <div
              className="absolute inset-0 bg-gradient-to-b from-transparent via-zinc-900/80 to-zinc-900 pointer-events-none"
              aria-hidden="true"
            />
            <div className="relative z-10">
              <div className="flex p-6 gap-6 pb-8">
                <img
                  src={currentAlbum?.imageUrl}
                  alt={currentAlbum?.title}
                  className="w-[240px] h-[240px] shadow-xl rounded"
                />
                <div className="flex flex-col justify-end">
                  <p className="text-sm font-medium">Album</p>
                  <h1 className="text-7xl font-bold my-4">
                    {currentAlbum?.title}
                  </h1>
                  <div className="flex items-center gap-2 text-sm text-zinc-100">
                    <span className="font-medium text-white">
                      {currentAlbum?.artist}
                    </span>
                    <span>• {currentAlbum?.songs.length} songs</span>
                    <span>• {currentAlbum?.releaseYear}</span>
                  </div>
                </div>
              </div>
              <div className="px-6 pb-4 flex items-center gap-6">
                <Button
                  onClick={handlePlayAlbum}
                  size="icon"
                  className="w-14 h-14 rounded-full bg-blue-500 hover:bg-blue-400 hover:scale-105 transition-all"
                >
                  {isPlaying &&
                  currentAlbum?.songs.some(
                    (song) => song._id === currentSong?._id
                  ) ? (
                    <Pause className="h-7 w-7 text-black" fill="black" />
                  ) : (
                    <Play className="h-7 w-7 text-black" fill="black" />
                  )}
                </Button>
              </div>
              <div className="bg-black/20 backdrop-blur-sm">
                <div className="grid grid-cols-[16px_4fr_2fr_1fr] gap-4 px-10 py-2 text-sm text-zinc-400 border-b border-white/5">
                  <div>#</div>
                  <div>Title</div>
                  <div>Released Date</div>
                  <div>
                    <Clock className="h-4 w-4" />
                  </div>
                </div>
                <div className="px-6">
                  <div className="space-y-2 py-4">
                    {currentAlbum?.songs.map((song, index) => {
                      const isCurrentSong = currentSong?._id === song._id;
                      return (
                        <div
                          key={song._id}
                          onClick={() => handlePlaySong(index)}
                          className={`grid grid-cols-[16px_4fr_2fr_1fr] gap-4 px-4 py-2 text-sm text-zinc-400 hover:bg-white/5 rounded-md group cursor-pointer`}
                        >
                          <div className="flex items-center justify-center">
                            {isCurrentSong && isPlaying ? (
                              <div className="size-4 text-blue-500">♫</div>
                            ) : (
                              <span className="group-hover:hidden">
                                {index + 1}
                              </span>
                            )}
                            {!isCurrentSong && (
                              <Play className="h-4 w-4 hidden group-hover:block" />
                            )}
                          </div>
                          <div className="flex items-center gap-3">
                            <img
                              src={song.imageUrl}
                              alt={song.title}
                              className="size-10"
                            />
                            <div>
                              <div className="font-medium text-white">
                                {song.title}
                              </div>
                              <div>{song.artist}</div>
                            </div>
                          </div>
                          <div className="flex items-center">
                            {song.createdAt.split("T")[0]}
                          </div>
                          <div className="flex items-center">
                            {formatDuration(song.duration)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
  );
};

export default AlbumPage;