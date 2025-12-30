(function () {
  const { useSyncExternalStore } = React;
  const listeners = new Set();

  const STORAGE_KEY = "purdueFoodiesCart:v1";

  function safeParse(raw, fallback) {
    try {
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  }

  function loadCartFromStorage() {
    // stored as array of [itemId, { item, qty }]
    const raw = localStorage.getItem(STORAGE_KEY);
    const entries = safeParse(raw, []);
    // Defensive: ensure it's an array of pairs
    if (!Array.isArray(entries)) return new Map();
    return new Map(entries);
  }

  function saveCartToStorage(cartMap) {
    try {
      const entries = Array.from(cartMap.entries());
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch {
      // ignore quota/private mode errors
    }
  }

  // ✅ Hydrate on initial load
  let cart = loadCartFromStorage();

  function notify() {
    // ✅ Persist on every change
    saveCartToStorage(cart);
    for (const l of listeners) l();
  }

  function addToCart(item) {
    const count = cart.get(item.id)?.qty ?? 0;
    cart.set(item.id, { item, qty: count + 1 });
    notify();

    // 🔔 tell the UI something was added (for toasts/snackbars)
    window.dispatchEvent(
      new CustomEvent("cart:item-added", { detail: { item, qty: count + 1 } })
    );
  }


  function removeFromCart(itemId) {
    const existing = cart.get(itemId);
    if (!existing) return;

    if (existing.qty <= 1) cart.delete(itemId);
    else cart.set(itemId, { ...existing, qty: existing.qty - 1 });

    notify();
  }

  function clearCart() {
    cart = new Map();
    notify();
  }

  function getCartCount() {
    let total = 0;
    for (const { qty } of cart.values()) total += qty;
    return total;
  }

  function getCart() {
    return cart;
  }

  function subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  }

  function useCartCount() {
    return useSyncExternalStore(subscribe, getCartCount);
  }

  function useCartItems() {
    return useSyncExternalStore(subscribe, getCart);
  }

  // Expose public API
  window.cartStore = {
    addToCart,
    removeFromCart,
    clearCart,
    getCartCount,
    useCartCount,
    getCart,
    useCartItems,
    subscribe,
  };
})();
