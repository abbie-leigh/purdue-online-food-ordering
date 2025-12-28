// cart.js
(function () {
  const { useSyncExternalStore } = React;
  const listeners = new Set();
  var cart = new Map();

  function notify() {
    for (const l of listeners) l();
  }

  function addToCart(item) {
    const count = cart.get(item.id)?.qty ?? 0;
    cart.set(item.id, {item, qty: count + 1 });
    notify();
  }

  function removeFromCart(itemId) {
    const existing = cart.get(itemId);
    if (!existing) return;

    if (existing.qty <= 1) cart.delete(itemId);
    else cart.set(itemId, { ...existing, qty: existing.qty - 1 });

    notify();
  }

  function getCartCount() {
    let total = 0;
    for (const { qty } of cart.values()) total += qty;
    return total;
  }

  // ✅ cached snapshot: items (this is what was causing the warning)
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
    getCartCount,
    useCartCount,
    getCart,
    useCartItems,
    subscribe,
  };
})();
