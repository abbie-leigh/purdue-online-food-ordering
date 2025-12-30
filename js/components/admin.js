const { useEffect, useMemo, useState } = React;

function AdminPage() {
  const [me, setMe] = useState(null);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  const isAdmin = useMemo(() => {
    try {
      return window.userDb?.isAdmin?.() ?? false;
    } catch {
      return false;
    }
  }, [me]);

  // Load current user + guard
  useEffect(() => {
    const current = window.userDb?.getCurrentUser?.() ?? null;
    setMe(current);

    if (!current) {
      window.location.href = "login.html";
      return;
    }
    if (!(window.userDb?.isAdmin?.() ?? false)) {
      window.location.href = "restaurants.html";
      return;
    }
  }, []);

  const loadUsers = () => {
    setError("");
    try {
      const list = window.userDb.listUsers(); // admin-only
      // sort admin first, then newest created
      list.sort((a, b) => {
        const aAdmin = a.id === "admin" || a.role === "admin";
        const bAdmin = b.id === "admin" || b.role === "admin";
        if (aAdmin !== bAdmin) return aAdmin ? -1 : 1;
        return String(b.createdAt ?? "").localeCompare(String(a.createdAt ?? ""));
      });
      setUsers(list);
    } catch (e) {
      setError(e?.message ?? "Unable to load users.");
    }
  };

  // Initial load after guard
  useEffect(() => {
    if (!me) return;
    if (!isAdmin) return;
    loadUsers();
  }, [me, isAdmin]);

  const fmtDate = (iso) => {
    try {
      return new Date(iso).toLocaleString();
    } catch {
      return iso ?? "";
    }
  };

  const fullName = (u) => {
    const name = `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim();
    return name || "(no name)";
  };

  const isProtected = (u) => u.id === "admin" || u.role === "admin" || String(u.emailNorm ?? "").toLowerCase() === "admin";

  const onDelete = (u) => {
    setError("");
    const ok = confirm(`Delete user "${fullName(u)}" (${u.email})? This cannot be undone.`);
    if (!ok) return;

    try {
      window.userDb.deleteUser(u.id);
      loadUsers();
    } catch (e) {
      setError(e?.message ?? "Failed to delete user.");
    }
  };

  const onSignOut = () => {
    window.userDb?.logOut?.();
    window.location.href = "login.html";
  };

  // While redirecting, render nothing (avoids flash)
  if (!me || !isAdmin) return null;

  return (
    <div className="max-w-5xl mx-auto p-6">
      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
          {error}
        </div>
      )}

      <div className="rounded-2xl bg-white shadow-sm border overflow-hidden">
        <div className="p-4 border-b flex items-center justify-between gap-3">
          <div className="text-gray-700 font-medium">
            Users <span className="ml-2 text-sm text-gray-500">({users.length})</span>
          </div>
          <button onClick={loadUsers} className="rounded-xl border px-3 py-1 text-gray-700 hover:bg-gray-50">
            Refresh
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="text-left font-medium px-4 py-3">Name</th>
                <th className="text-left font-medium px-4 py-3">Email</th>
                <th className="text-left font-medium px-4 py-3">Role</th>
                <th className="text-left font-medium px-4 py-3">Created</th>
                <th className="text-right font-medium px-4 py-3">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {users.map((u) => (
                <tr key={u.id} className="text-gray-700">
                  <td className="px-4 py-3">{fullName(u)}</td>
                  <td className="px-4 py-3">{u.email}</td>
                  <td className="px-4 py-3">{u.role ?? "user"}</td>
                  <td className="px-4 py-3 text-gray-500">{fmtDate(u.createdAt)}</td>
                  <td className="px-4 py-3 text-right">
                    {isProtected(u) ? (
                      <span className="text-gray-400">Protected</span>
                    ) : (
                      <button
                        onClick={() => onDelete(u)}
                        className="rounded-xl border px-3 py-1 hover:bg-red-50 hover:text-red-600">
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}

              {users.length === 0 && (
                <tr>
                  <td className="px-4 py-6 text-gray-500" colSpan={5}>
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Mount
const root = ReactDOM.createRoot(document.getElementById("admin-root"));
root.render(<AdminPage />);
