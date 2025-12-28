// fetch("navbar.html")
//   .then(response => response.text())
//   .then(html => {
//     document.getElementById("navbar").innerHTML = html;
//   });




const { useEffect, useState } = React;

function Navbar({
  brand = "Purdue Foodies",
  brandHref = "restaurants.html",
  onLogin,
  onSignUp,
  getCartCount,
  onCartOpen,
}) {
  const [cartCount, setCartCount] = useState(0);

  // Keep it simple: poll for cart count changes (works with existing window.cartDisplay/cart logic)
  useEffect(() => {
    const readCount = () => {
      try {
        if (typeof getCartCount === "function") return Number(getCartCount()) || 0;
        // fallback if you already store count somewhere global
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

  const badgeHidden = cartCount <= 0;

  return (
    <nav className="shadow-md relative">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo/ App Name */}
          <a href={brandHref} className="text-2xl font-semibold text-orange-400">
            {brand}
          </a>

          {/* Right Side Buttons */}
          <div className="flex items-center gap-3">
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

            {/* Cart button */}
            <button
              id="cartBtn"
              type="button"
              className="relative inline-flex items-center justify-center rounded-lg p-2 text-gray-700 hover:text-orange-400 hover:bg-orange-50"
              aria-label="Open cart"
              onClick={
                onCartOpen ||
                (() => {
                  // preserve your existing behavior
                  window.cartDisplay?.open?.();
                })
              }>
              {/* Cart icon (SVG) */}
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

              {/* Badge */}
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