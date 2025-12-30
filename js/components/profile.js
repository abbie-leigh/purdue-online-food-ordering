function ProfilePage() {
  const [me, setMe] = React.useState(null);

  // view vs edit mode
  const [isEditing, setIsEditing] = React.useState(false);

  // form draft
  const [draft, setDraft] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "", // only used when editing; blank means "no change"
  });

  // copy of values before editing so Cancel can restore
  const [original, setOriginal] = React.useState(null);

  const [msg, setMsg] = React.useState("");
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    const current = window.userDb?.getCurrentUser?.() ?? null;
    if (!current) {
      window.location.href = "login.html";
      return;
    }

    setMe(current);
    const base = {
      firstName: current.firstName ?? "",
      lastName: current.lastName ?? "",
      email: current.email ?? "",
      password: "",
    };
    setDraft(base);
    setOriginal(base);
  }, []);

  const fullName = `${me?.firstName ?? ""} ${me?.lastName ?? ""}`.trim();

  function startEdit() {
    setMsg("");
    setError("");
    setIsEditing(true);
    // capture current values for cancel
    const base = {
      firstName: me?.firstName ?? "",
      lastName: me?.lastName ?? "",
      email: me?.email ?? "",
      password: "",
    };
    setOriginal(base);
    setDraft(base);
  }

  function cancelEdit() {
    setMsg("");
    setError("");
    setIsEditing(false);
    if (original) setDraft(original);
  }

  function onChange(e) {
    const { name, value } = e.target;
    setDraft((d) => ({ ...d, [name]: value }));
  }

  async function save() {
    setMsg("");
    setError("");

    try {
      const updated = await window.userDb.updateCurrentUserProfile(draft);
      setMe(updated);

      const base = {
        firstName: updated.firstName ?? "",
        lastName: updated.lastName ?? "",
        email: updated.email ?? "",
        password: "",
      };
      setDraft(base);
      setOriginal(base);

      setIsEditing(false);
      setMsg("Profile updated!");
    } catch (err) {
      setError(err?.message ?? "Unable to update profile.");
    }
  }

  if (!me) return null;

  return (
    <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-orange-400 text-white px-6 py-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">
              {fullName || "Your Profile"}
            </h1>
            <p className="text-white/90 text-sm">{me.email}</p>
          </div>

          {!isEditing ? (
            <button
              type="button"
              onClick={startEdit}
              className="bg-white text-orange-500 font-semibold px-4 py-2 rounded-xl hover:bg-orange-50 active:scale-[0.98]"
            >
              Edit Profile
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={cancelEdit}
                className="bg-white/20 text-white font-semibold px-4 py-2 rounded-xl hover:bg-white/30 active:scale-[0.98]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={save}
                className="bg-white text-orange-500 font-semibold px-4 py-2 rounded-xl hover:bg-orange-50 active:scale-[0.98]"
              >
                Update
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="p-6 space-y-4">
        <Field
          label="First Name"
          name="firstName"
          value={draft.firstName}
          onChange={onChange}
          isEditing={isEditing}
        />
        <Field
          label="Last Name"
          name="lastName"
          value={draft.lastName}
          onChange={onChange}
          isEditing={isEditing}
        />
        <Field
          label="Email Address"
          name="email"
          type="email"
          value={draft.email}
          onChange={onChange}
          isEditing={isEditing}
        />

        {/* Typical profile UX: password only shown while editing */}
        {isEditing && (
          <Field
            label="New Password (optional)"
            name="password"
            type="password"
            value={draft.password}
            onChange={onChange}
            isEditing={true}
            placeholder="Leave blank to keep current password"
          />
        )}

        {msg && (
          <p className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl p-3">
            {msg}
          </p>
        )}

        {error && (
          <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl p-3">
            {error}
          </p>
        )}

        <div className="pt-2 flex justify-between">
          <a
            href="restaurants.html"
            className="text-sm text-orange-400 font-medium hover:underline"
          >
            Back to restaurants
          </a>

          {/* Optional: quick sign out here if you want
          <button
            type="button"
            onClick={() => { window.userDb?.logOut?.(); window.location.href="restaurants.html"; }}
            className="text-sm text-stone-500 hover:text-orange-400"
          >
            Sign out
          </button>
          */}
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  name,
  value,
  onChange,
  isEditing,
  type = "text",
  placeholder = "",
}) {
  return (
    <div>
      <label className="block text-sm text-stone-500 mb-1 ml-1">{label}</label>

      {!isEditing ? (
        <div className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-2 text-stone-800">
          {value?.toString()?.trim() ? value : <span className="text-stone-400">—</span>}
        </div>
      ) : (
        <input
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full rounded-xl border border-stone-300 px-4 py-2
                     focus:outline-none focus:ring-1 focus:ring-orange-300
                     focus:border-orange-300 text-stone-800"
        />
      )}
    </div>
  );
}

// Mount
ReactDOM.createRoot(document.getElementById("profile-root")).render(<ProfilePage />);
