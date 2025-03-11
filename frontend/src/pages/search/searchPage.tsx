import { useState, useEffect } from "react";
import { useMusicStore } from "@/stores/useMusicStore";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Calendar, SearchIcon } from "lucide-react";
import PlayButton from "../home/components/PlayButton";
import Topbar from '@/components/Topbar';
import { ScrollArea } from "@/components/ui/scroll-area";

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const { searchResults, isLoading, error, fetchSearchResults } =
    useMusicStore();

  const handleSearch = () => {
    console.log("Performing search with query:", query);
    fetchSearchResults(query);
  };

  const handleInputChange = (e: any) => {
    const newQuery = e.target.value;
    console.log("Setting query value to:", newQuery);
    setQuery(newQuery);
    handleSearch(); // Trigger search on input change
  };

  // Debugging useEffect to log search results
  useEffect(() => {
    console.log("Search results updated:", searchResults);
  }, [searchResults]);

  return (
    <main className='rounded-md overflow-hidden h-full bg-gradient-to-b from-zinc-800 to-zinc-900'>
        <Topbar />
      <div className="min-h-screen bg-gradient-to-b from-zinc-900 via-zinc-900 to-black text-zinc-100 p-8">
        <div className="flex items-center gap-4">
          <Input
            placeholder="Search for songs, artists, albums..."
            value={query}
            onChange={handleInputChange}
            className="flex-grow bg-zinc-700 text-zinc-300 placeholder-zinc-500"
          />
        </div>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-zinc-400">Loading search results...</div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-red-400">{error}</div>
          </div>
        ) : query === "" ? (
          <div className="flex items-center justify-center min-h-[calc(100vh-100px)]">
            <div className="text-center space-y-8 px-4">
              <div className="flex justify-center animate-pulse">
                <SearchIcon className="h-24 w-24 text-cyan-500" />
              </div>
              <div className="space-y-4">
                <p className="text-neutral-400 max-w-md mx-auto">
                  Start by searching for your favorite songs, artists, or
                  albums...
                </p>
              </div>
            </div>
          </div>
        ) : (
          <ScrollArea className="mt-4 max-h-[calc(100vh-200px)]">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-zinc-800/50">
                  <TableHead className="w-[50px]"></TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Artist</TableHead>
                  <TableHead>Release Date</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {searchResults.length > 0 ? (
                  searchResults.map((result) => (
                    <TableRow
                      key={result._id}
                      className="hover:bg-zinc-800/50 group relative"
                    >
                      <TableCell>
                        <img
                          src={result.imageUrl}
                          alt={result.title}
                          className="size-10 rounded object-cover"
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        {result.title}
                      </TableCell>
                      <TableCell>{result.artist}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center gap-1 text-zinc-400">
                          <Calendar className="h-4 w-4" />{" "}
                          {result.createdAt.split("T")[0]}
                        </span>
                      </TableCell>
                      <TableCell>
                        <PlayButton song={result} />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-zinc-400">
                      No results found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        )}
      </div>
    </main>
  );
};

export default SearchPage;