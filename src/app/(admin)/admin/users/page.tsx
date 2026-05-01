"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { formatDate } from "@/lib/utils";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

async function fetchUsers(): Promise<User[]> {
  const res = await fetch("/api/admin/users");
  if (!res.ok) throw new Error("Failed");
  return res.json();
}

export default function AdminUsersPage() {
  const queryClient = useQueryClient();

  const { data: users, isLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: fetchUsers,
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ userId, isActive }: { userId: string; isActive: boolean }) => {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive }),
      });
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("User updated");
    },
    onError: () => toast.error("Failed to update user"),
  });

  if (isLoading) {
    return <div className="flex justify-center py-20"><LoadingSpinner /></div>;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading text-3xl tracking-wide text-sidebar-foreground">Users</h1>
        <p className="text-sidebar-foreground/60 text-sm mt-1">{users?.length ?? 0} registered users</p>
      </div>

      <div className="bg-sidebar-accent/20 rounded-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-sidebar-border text-xs tracking-widest text-sidebar-foreground/40">
              <th className="text-left px-4 py-3">USER</th>
              <th className="text-left px-4 py-3 hidden md:table-cell">JOINED</th>
              <th className="text-left px-4 py-3">ROLE</th>
              <th className="text-right px-4 py-3">ACTIVE</th>
            </tr>
          </thead>
          <tbody>
            {users?.map((user) => (
              <tr key={user.id} className="border-b border-sidebar-border/50 hover:bg-sidebar-accent/10">
                <td className="px-4 py-3">
                  <div>
                    <p className="text-sm text-sidebar-foreground font-medium">{user.name}</p>
                    <p className="text-xs text-sidebar-foreground/40">{user.email}</p>
                  </div>
                </td>
                <td className="px-4 py-3 hidden md:table-cell">
                  <span className="text-xs text-sidebar-foreground/60">{formatDate(user.createdAt)}</span>
                </td>
                <td className="px-4 py-3">
                  <Badge variant={user.role === "ADMIN" ? "default" : "secondary"} className="text-[10px]">
                    {user.role}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-right">
                  <Switch
                    checked={user.isActive}
                    onCheckedChange={(checked) => toggleMutation.mutate({ userId: user.id, isActive: checked })}
                    disabled={toggleMutation.isPending}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!users || users.length === 0) && (
          <div className="text-center py-12 text-sidebar-foreground/40 text-sm">No users yet.</div>
        )}
      </div>
    </div>
  );
}
