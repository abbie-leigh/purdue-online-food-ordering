const { useEffect, useMemo, useRef, useState } = React;

function CartDrawer({ open, onClose }) {
    const cart = window.cartStore.useCartItems();
    const items = [...cart.values()];
    const count = window.cartStore.useCartCount();
    const panelRef = useRef(null);

    useEffect(() => {
        if (!open) return;
        const onKey = (e) => e.key === "Escape" && onClose();
        window.addEventListener("keydown", onKey);
        setTimeout(() => panelRef.current?.focus(), 0);
        return () => window.removeEventListener("keydown", onKey);
    }, [open, onClose]);

    const subtotal = useMemo(() => {
        let s = 0;
        for (const [key, value] of cart) s += Number(value.item.price ?? 0) * value.qty;
        return s;
    }, [items]);

    function deleteLine(itemId) {
        const item = cart.get(itemId);
        if (!item) return;
        for (let i = 0; i < item.qty; i++) window.cartStore.removeFromCart(itemId);
    }

    function placeOrder() {
        for (const item of items) {
            for (let i = 0; i < item.qty; i++) window.cartStore.removeFromCart(item.item.id);
        }
        alert("Order placed! (demo)");
        onClose();
    }

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Cart">
            <div className="absolute inset-0 bg-black/60" onMouseDown={onClose} />

            <div
                className="absolute right-0 top-0 h-full w-full max-w-sm bg-white border-l shadow-2xl"
                onMouseDown={(e) => e.stopPropagation()}
                ref={panelRef}
                tabIndex={-1}>
                <div className="flex h-full flex-col">
                    <div className="flex items-center justify-between px-4 py-4 shadow">
                        <div>
                            <div className="text-lg font-semibold text-stone-800">Cart</div>
                            <div className="text-sm text-stone-400">{count} item{count === 1 ? "" : "s"}</div>
                        </div>
                        <button
                            onClick={onClose}
                            aria-label="Close cart"
                            className="h-9 w-9 rounded-full
                                grid place-items-center
                                hover:bg-orange-100
                                text-stone-400 hover:text-orange-400">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-5 w-5">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </button>
                    </div>

                    <div className="flex-1 overflow-auto p-4">
                        <CartItems items={items}/>
                    </div>

                    <div className="shadow-[0_-1px_3px_rgba(0,0,0,0.1)] p-4 space-y-3">
                        <div className="flex items-center justify-between text-sm px-3">
                            <span className="text-stone-400">Subtotal</span>
                            <span className={items.length === 0 ? "text-stone-400" : "font-semibold text-stone-800"}>${subtotal.toFixed(2)}</span>
                        </div>

                        <button
                            className={[
                                "w-full rounded-2xl px-4 py-3 font-semibold",
                                items.length === 0
                                    ? "bg-orange-400/20 text-white cursor-not-allowed"
                                    : "bg-orange-400 hover:bg-orange-500 text-white",
                            ].join(" ")}
                            onClick={placeOrder}
                            disabled={items.length === 0}>
                            Place Order
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function CartItems({ items }) {
    if (items.length === 0) {
        return (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-stone-500">
                Your cart is empty! {":("}
            </div>
        );
    }
    return (
        <ul className="space-y-3">
            {items.map((item) => (
                <li
                    key={item.item.id}
                    className="rounded-2xl shadow p-4 border border-white/10">

                    {/* Top row: title (left) + price (right) */}
                    <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                            {/* Title (far left) */}
                            <div className="font-medium truncate text-stone-800">{item.item.name}</div>

                            {/* Cost for 1 item (under title) */}
                            <div className="mt-1 text-sm text-stone-400">
                                ${Number(item.item.price ?? 0).toFixed(2)}
                            </div>
                        </div>

                        <div className="min-w-0">
                            {/* Price (far right) */}
                            <div className="shrink-0 text-right font-semibold text-stone-800">
                                ${(Number(item.item.price ?? 0) * item.qty).toFixed(2)}
                            </div>

                            {/* Quantity (under price) */}
                            <div className="mt-2 flex items-center">
                                <button
                                    className="h-5 w-5 rounded-full bg-orange-50 hover:bg-orange-100 grid place-items-center"
                                    onClick={() => window.cartStore.removeFromCart(item.item.id)}
                                    aria-label={`Decrease ${item.item.name}`}
                                    title="Decrease">
                                    <span className="text-lg text-orange-400 leading-none">−</span>
                                </button>

                                <span className="min-w-8 text-center tabular-nums text-stone-400">
                                    {item.qty}
                                </span>

                                <button
                                    className="h-5 w-5 rounded-full bg-orange-50 hover:bg-orange-100 active:scale-95 grid place-items-center"
                                    onClick={() => window.cartStore.addToCart(item.item)}
                                    aria-label={`Increase ${item.item.name}`}
                                    title="Increase">
                                    <span className="text-lg text-orange-400 leading-none">+</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </li>
            ))}
        </ul>
    );
}

function CartRoot() {
    const [open, setOpen] = useState(false);

    // expose a tiny global API so any page/button can open it
    useEffect(() => {
        window.cartDisplay = {
            open: () => setOpen(true),
            close: () => setOpen(false),
            toggle: () => setOpen((v) => !v),
        };
        return () => {
            if (window.cartDisplay) delete window.cartDisplay;
        };
    }, []);

    return <CartDrawer open={open} onClose={() => setOpen(false)} />;
}

ReactDOM.createRoot(document.getElementById("cart")).render(<CartRoot />);
