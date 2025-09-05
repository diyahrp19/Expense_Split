import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function Groups() {
  const { backendUser, logout } = useAuth();
  const qc = useQueryClient();
  const [name, setName] = useState("");
  const [emails, setEmails] = useState("");

  const { data: groups } = useQuery({
    queryKey: ["groups", backendUser?._id],
    queryFn: async () =>
      (await api.get(`/groups/user/${backendUser!._id}`)).data,
    enabled: !!backendUser?._id,
  });

  const createGroup = useMutation({
    mutationFn: async () =>
      (
        await api.post("/groups", {
          name,
          createdBy: backendUser!._id,
          members: emails
            .split(",")
            .map((e) => e.trim())
            .filter(Boolean)
            .map((email) => ({ email })),
        })
      ).data,
    onSuccess: () => {
      setName("");
      setEmails("");
      qc.invalidateQueries({ queryKey: ["groups", backendUser!._id] });
    },
  });

  return (
    <div className="max-w-3xl mx-auto p-4">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Your Groups</h1>
        <button onClick={logout} className="px-3 py-1 rounded bg-gray-200">
          Logout
        </button>
      </header>

      <div className="bg-white rounded-2xl p-4 shadow mb-6">
        <h2 className="font-semibold mb-2">Create Group</h2>
        <div className="grid gap-2 md:grid-cols-3">
          <input
            className="border p-2 rounded"
            placeholder="Group name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="border p-2 rounded md:col-span-2"
            placeholder="Member emails (comma-separated)"
            value={emails}
            onChange={(e) => setEmails(e.target.value)}
          />
        </div>
        <button
          onClick={() => createGroup.mutate()}
          className="mt-3 px-4 py-2 rounded bg-black text-white"
        >
          Create
        </button>
      </div>

      <div className="grid gap-3">
        {(groups || []).map((g: any) => (
          <Link
            key={g._id}
            to={`/groups/${g._id}`}
            className="block p-4 bg-white rounded-2xl shadow"
          >
            <div className="font-medium">{g.name}</div>
            <div className="text-sm text-gray-600">
              {g.members.length} members
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
