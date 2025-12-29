(() => {
  const USERS_KEY = "users";
  const CURRENT_USER_KEY = "currentUserId";

  // NEW: built-in admin credentials (demo-only)
  const ADMIN_EMAIL_NORM = "admin";
  const ADMIN_PASSWORD_PLAINTEXT = "adminpassword";

  function loadUsers() {
    try {
      return JSON.parse(localStorage.getItem(USERS_KEY)) ?? [];
    } catch {
      return [];
    }
  }

  function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  function normalizeEmail(email) {
    return String(email ?? "").trim().toLowerCase();
  }

  async function sha256(text) {
    const enc = new TextEncoder().encode(text);
    const buf = await crypto.subtle.digest("SHA-256", enc);
    return [...new Uint8Array(buf)]
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }

  // NEW: ensure admin user exists in localStorage
  async function ensureAdminUser() {
    const users = loadUsers();
    const hasAdmin = users.some((u) => u.emailNorm === ADMIN_EMAIL_NORM);
    if (hasAdmin) return;

    const passwordHash = await sha256(ADMIN_PASSWORD_PLAINTEXT);
    const adminUser = {
      id: "admin", // stable id so we can protect against deletion
      firstName: "Admin",
      lastName: "",
      email: "admin",
      emailNorm: ADMIN_EMAIL_NORM,
      passwordHash,
      role: "admin",
      createdAt: new Date().toISOString(),
    };

    users.push(adminUser);
    saveUsers(users);
  }

  async function createUser({ firstName, lastName, email, password }) {
    await ensureAdminUser();

    const users = loadUsers();
    const emailNorm = normalizeEmail(email);

    if (users.some((u) => u.emailNorm === emailNorm)) {
      throw new Error("An account with that email already exists.");
    }

    const passwordHash = await sha256(password);

    const newUser = {
      id: crypto.randomUUID(),
      firstName: String(firstName ?? "").trim(),
      lastName: String(lastName ?? "").trim(),
      email: String(email ?? "").trim(),
      emailNorm,
      passwordHash,
      role: "user",
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    saveUsers(users);

    localStorage.setItem(CURRENT_USER_KEY, newUser.id);
    return newUser;
  }

  async function login({ email, password }) {
    await ensureAdminUser();

    const users = loadUsers();
    const emailNorm = normalizeEmail(email);
    const user = users.find((u) => u.emailNorm === emailNorm);
    if (!user) throw new Error("No account found for that email.");

    const passwordHash = await sha256(password);
    if (user.passwordHash !== passwordHash) throw new Error("Incorrect password.");

    localStorage.setItem(CURRENT_USER_KEY, user.id);
    return user;
  }

  function logOut() {
    localStorage.removeItem(CURRENT_USER_KEY);
  }

  function getCurrentUser() {
    const id = localStorage.getItem(CURRENT_USER_KEY);
    if (!id) return null;
    return loadUsers().find((u) => u.id === id) ?? null;
  }

  function isEmailTaken(email) {
    const emailNorm = normalizeEmail(email);
    return loadUsers().some((u) => u.emailNorm === emailNorm);
  }

  // NEW: admin checks + user management
  function isAdmin() {
    const u = getCurrentUser();
    return !!u && (u.role === "admin" || u.emailNorm === ADMIN_EMAIL_NORM || u.id === "admin");
  }

  function requireAdmin() {
    if (!isAdmin()) throw new Error("Admin only.");
  }

  function listUsers() {
    requireAdmin();
    // return safe fields only (don’t expose passwordHash to UI)
    return loadUsers().map(({ passwordHash, ...safe }) => safe);
  }

  function deleteUser(userId) {
    requireAdmin();
    if (!userId) throw new Error("Missing user id.");

    // protect admin account
    if (userId === "admin") throw new Error("Cannot delete admin.");

    const users = loadUsers();
    const next = users.filter((u) => u.id !== userId);
    if (next.length === users.length) throw new Error("User not found.");

    saveUsers(next);

    // if you deleted yourself, log out
    const currentId = localStorage.getItem(CURRENT_USER_KEY);
    if (currentId === userId) logOut();
  }

  // expose API
  window.userDb = {
    createUser,
    login,
    logOut,
    getCurrentUser,
    isEmailTaken,

    // NEW exports
    ensureAdminUser,
    isAdmin,
    listUsers,
    deleteUser,

    _loadUsers: loadUsers,
    _saveUsers: saveUsers,
  };

  // Ensure admin exists ASAP (doesn't block)
  window.userDb.ensureAdminUser().catch(() => {});
})();
