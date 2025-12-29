const { useEffect, useState, useRef } = React;

function Navbar({
  brand = "Purdue Foodies",
  brandHref = "restaurants.html",
  onLogin,
  onSignUp,
  getCartCount,
  onCartOpen,
}) {
  const [cartCount, setCartCount] = useState(0);

  // NEW: current user + dropdown state
  const [currentUser, setCurrentUser] = useState(null);
  const [accountOpen, setAccountOpen] = useState(false);
  const accountRef = useRef(null);

  // Keep it simple: poll for cart count changes
  useEffect(() => {
    const readCount = () => {
      try {
        if (typeof getCartCount === "function") return Number(getCartCount()) || 0;
        if (window.cartCount != null) return Number(window.cartCount) || 0;
        return 0;
      } catch {
        return 0;
      }
    };

    setCartCount(readCount());
    const id = setInterval(() => setCartCount(readCount()), 250);
    return () => clearInterval(id);
  }, [getCartCount]);

  // NEW: read logged-in user (simple polling so it updates after login/logout on same page)
  useEffect(() => {
    const readUser = () => {
      try {
        return window.userDb?.getCurrentUser?.() ?? null;
      } catch {
        return null;
      }
    };

    setCurrentUser(readUser());
    const id = setInterval(() => setCurrentUser(readUser()), 500);
    return () => clearInterval(id);
  }, []);

  // NEW: close dropdown when clicking outside
  useEffect(() => {
    const onDocClick = (e) => {
      if (!accountRef.current) return;
      if (!accountRef.current.contains(e.target)) setAccountOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const badgeHidden = cartCount <= 0;

  const handleSignOut = () => {
    window.userDb?.logOut?.();
    setAccountOpen(false);
    // pick one behavior:
    // 1) refresh current page
    window.location.reload();
    // 2) OR redirect:
    // window.location.href = "restaurants.html";
  };

  return (
    <nav className="shadow-md relative z-40">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo/ App Name */}
          <a href={brandHref} className="text-2xl font-semibold text-orange-400">
            {brand}
          </a>

          {/* Right Side Buttons */}
          <div className="flex items-center gap-3">
            {/* If NOT logged in: show Login + Sign Up */}
            {!currentUser ? (
              <>
                <button
                  className="text-gray-700 hover:text-orange-400 font-medium"
                  type="button"
                  onClick={onLogin || (() => console.log("Login"))}>
                  Login
                </button>

                <button
                  className="bg-orange-400 text-white font-semibold px-3 py-1 rounded-2xl hover:bg-orange-500"
                  type="button"
                  onClick={onSignUp || (() => console.log("Sign Up"))}>
                  Sign Up
                </button>
              </>
            ) : (
              /* If logged in: show Your Account dropdown */
              <div className="relative" ref={accountRef}>
                <button
                  type="button"
                  className="flex items-center gap-2 bg-orange-400 text-white font-semibold px-3 py-1 rounded-2xl hover:bg-orange-500"
                  aria-haspopup="menu"
                  aria-expanded={accountOpen}
                  onClick={() => setAccountOpen((v) => !v)}>
                  Your Account
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={"h-4 w-4 transition-transform " + (accountOpen ? "rotate-180" : "")}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {accountOpen && (
                  <div
                    role="menu"
                    className="absolute right-0 mt-2 w-30 rounded-xl border bg-white shadow-lg overflow-hidden">
                    <button
                      role="menuitem"
                      type="button"
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-500"
                      onClick={handleSignOut}>
                      Sign out
                    </button>
                  </div>
                )}
                {accountOpen && (
                  <div
                    role="menu"
                    className="absolute right-0 mt-2 w-44 rounded-xl border bg-white shadow-lg overflow-hidden z-40">
                    <button
                      role="menuitem"
                      type="button"
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-500"
                      onClick={handleSignOut}>
                      Sign out
                    </button>

                    {/* Admin-only option */}
                    {window.userDb?.isAdmin?.() && (
                      <button
                        role="menuitem"
                        type="button"
                        className="w-full text-left px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-500 border-t"
                        onClick={() => {
                          setAccountOpen(false);
                          window.location.href = "admin.html";
                        }}>
                        Manage users
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Cart button */}
            <button
              id="cartBtn"
              type="button"
              className="relative inline-flex items-center justify-center rounded-lg p-2 text-gray-700 hover:text-orange-400 hover:bg-orange-50"
              aria-label="Open cart"
              onClick={
                onCartOpen ||
                (() => {
                  window.cartDisplay?.open?.();
                })
              }>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 8h14m-9 0a1 1 0 102 0 1 1 0 00-2 0zm8 0a1 1 0 102 0 1 1 0 00-2 0z"
                />
              </svg>

              <span
                id="cartCount"
                className={
                  "absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-orange-500 text-white text-xs leading-[18px] text-center " +
                  (badgeHidden ? "hidden" : "")
                }>
                {cartCount}
              </span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

// Mount it
const root = ReactDOM.createRoot(document.getElementById("navbar"));
root.render(
  <Navbar
    onLogin={() => (window.location.href = "login.html")}
    onSignUp={() => (window.location.href = "register.html")}
    getCartCount={() => window.cartDisplay?.count?.() ?? window.cartCount ?? 0}
    onCartOpen={() => window.cartDisplay?.open?.()}
  />
);
