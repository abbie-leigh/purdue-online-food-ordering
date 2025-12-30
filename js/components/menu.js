const { useEffect, useMemo, useState } = React;
const RESTAURANT_API_URL = "https://dummyjson.com/c/2d83-4f1d-4625-a81f";
const RESTAURANT_ID = new URLSearchParams(window.location.search).get("id");

function formatPrice(price) {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(price);
}

function Menu() {
    const [restaurantData, setData] = useState(null);
    const cartCount = window.cartStore.useCartCount();

    // ✅ toast state
    const [toast, setToast] = useState(null);

    useEffect(() => {
        const onAdded = (e) => {
            const name = e?.detail?.item?.name ?? "Item";
            setToast(`${name} added to cart ✅`);
            // auto-hide after 1.6s
            window.clearTimeout(window.__toastTimer);
            window.__toastTimer = window.setTimeout(() => setToast(null), 1600);
        };

        window.addEventListener("cart:item-added", onAdded);
        return () => window.removeEventListener("cart:item-added", onAdded);
    }, []);

    useEffect(() => {
        let cancelled = false;

        async function loadData() {
            const response = await fetch(RESTAURANT_API_URL);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const json = await response.json();
            if (!cancelled) setData(json);
        }
        loadData();
        return () => { cancelled = true; };
    }, []);

    const restaurant = useMemo(
        () => restaurantData?.restaurants?.find((r) => String(r.id) === RESTAURANT_ID),
        [restaurantData])

    return (
        <div className="min-h-screen flex flex-col bg-orange-100">
            {/* ✅ toast */}
            {toast && (
                <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
                    <div className="rounded-2xl bg-green-100 text-green-800 px-4 py-2 shadow-md text-sm font-medium border border-green-200">
                        {toast}
                    </div>
                </div>
            )}

            <div id="menuHeader">
                <MenuHeader restaurant={restaurant} />
            </div>
            <div id="menuGrid" className="flex-1">
                <MenuGrid restaurant={restaurant} />
            </div>
        </div>
    );
}

function MenuHeader({ restaurant }) {
    if (!restaurant) return null;

    return (
        <header className="relative h-[10vh] min-h-[100px] w-full shadow shadow-black">
            {/* Image */}
            <img src={restaurant.image}
                className="absolute inset-0 h-full w-full object-cover" />

            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/50"></div>

            {/* Title */}
            <div className="relative z-10 flex h-full items-center justify-center">
                <h1 className="text-white text-4xl md:text-6xl font-serif tracking-widest uppercase">
                    {restaurant.name}
                </h1>
            </div>
        </header>
    );
}

function MenuGrid({ restaurant }) {
    if (!restaurant) return null;

    const items = useMemo(() => restaurant?.menu?.items ?? [], [restaurant]);
    return (
        <main>
            <section
                aria-live="polite"
                className="max-w-6xl mx-auto p-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {items.map((item) => (
                    <MenuItem key={item.id ?? item.name} item={item} />
                ))}
            </section>
        </main>
    );
}

function MenuItem({ item }) {
    const price = formatPrice(item.price);

    return (
        <article className="bg-white rounded-2xl shadow-sm shadow-stone-800 overflow-hidden flex flex-col h-full">
            {/* Top: Title + Price */}
            <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        <h2 className="text-lg text-stone-800 font-semibold truncate">
                            {item.name}
                        </h2>
                        <p className="text-xs text-stone-500">{item.description}</p>
                    </div>

                    <p className="text-lg text-stone-800 font-semibold whitespace-nowrap">
                        {price}
                    </p>
                </div>
            </div>

            {/* Photo */}
            <div className="relative mt-auto">
                <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-48 object-cover"
                />
                {/* soft overlay */}
                <div className="absolute inset-0 bg-stone-500/20" />
                
                <button
                    className="absolute bottom-3 right-3 z-10 px-4 py-2 text-sm font-semibold rounded-xl
                           bg-white text-stone-800 shadow-sm shadow-stone-800
                           hover:bg-orange-400 hover:text-white"
                    aria-label={`Add ${item.name} to cart`}
                    onClick={() => window.cartStore.addToCart(item)}>
                    Add
                </button>
            </div>
        </article>
    );
}

ReactDOM.createRoot(document.getElementById("menu")).render(<Menu />);