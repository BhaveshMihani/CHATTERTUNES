import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { useMusicStore } from "@/stores/useMusicStore";
import { Calendar, Pencil, Trash } from "lucide-react"; // Import Pencil and Trash icons
import { useEffect } from "react";
import UpdateUserDialog from "./UpdateUserDialog";

interface UsersTableProps {
  searchTerm: string;
}

const UsersTable = ({ searchTerm }: UsersTableProps) => {
  const { users, isLoading, error, fetchUsers } = useMusicStore();

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleDelete = async (userId: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      try {
        const response = await fetch(`/auth/callback`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: "user.deleted",
            data: { id: userId },
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to delete user");
        }

        alert("User deleted successfully");
        fetchUsers(); // Refresh the user list
      } catch (error) {
        console.error("Error deleting user:", error);
        alert("Failed to delete user");
      }
    }
  };

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
          <TableHead className="text-right">Edit</TableHead>
          <TableHead className="text-right">Delete</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users
          .filter((user) =>
            user.fullName.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .slice() // Create a shallow copy to avoid mutating the original array
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          ) // Sort by createdAt in descending order
          .map((user) => (
            <TableRow key={user._id} className="hover:bg-zinc-800/50">
              <TableCell>
                <img
                  src={user.imageUrl}
                  alt={user.fullName}
                  className="w-10 h-10 rounded object-cover"
                />
              </TableCell>
              <TableCell className="font-medium">{user.fullName}</TableCell>
              <TableCell>
                <span className="inline-flex items-center gap-1 text-zinc-400">
                  <Calendar className="h-4 w-4" />
                  {new Date(user.createdAt).toLocaleDateString("en-GB")}
                </span>
              </TableCell>
              <TableCell >
                <div className="flex gap-2 justify-end">
                <UpdateUserDialog user={user}>
                  <button className="btn btn-outline btn-sm">
                    <Pencil className="size-4" />
                  </button>
                </UpdateUserDialog>
                </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex gap-2 justify-end">
                <button
                  className="btn btn-outline btn-sm text-red-500"
                  onClick={() => handleDelete(user._id)}
                  >
                  <Trash className="h-4 w-4" />
                </button>
                  </div>
                </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
};

export default UsersTable;
