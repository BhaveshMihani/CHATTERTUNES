import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { useMusicStore } from "@/stores/useMusicStore";
import { Calendar } from "lucide-react"; // Removed TableIcon
import { useEffect } from "react";

const UsersTable = () => {
  const { users, isLoading, error, fetchUsers } = useMusicStore();

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-zinc-400">Loading users...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-red-400">{error}</div>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-zinc-800/50">
          <TableHead className="w-[50px]"></TableHead>
          <TableHead>Full Name</TableHead>
          <TableHead>Created At</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users
          .slice() // Create a shallow copy to avoid mutating the original array
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) // Sort by createdAt in descending order
          .map((user) => (
            <TableRow key={user._id} className="hover:bg-zinc-800/50">
              <TableCell>
          <img src={user.imageUrl} alt={user.fullName} className="w-10 h-10 rounded object-cover" />
              </TableCell>
              <TableCell className="font-medium">{user.fullName}</TableCell>
              <TableCell>
          <span className="inline-flex items-center gap-1 text-zinc-400">
            <Calendar className="h-4 w-4" />
            {new Date(user.createdAt).toLocaleDateString("en-GB")} 
          </span>
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
};

export default UsersTable;
