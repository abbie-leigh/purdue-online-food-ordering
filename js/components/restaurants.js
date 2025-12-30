const { useEffect, useMemo, useState } = React;
const RESTAURANT_API_URL = "https://dummyjson.com/c/2d83-4f1d-4625-a81f";

function RestaurantGrid() {
  const [restaurantData, setData] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function loadRestaurants() {
      const response = await fetch(RESTAURANT_API_URL);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const json = await response.json();
      if (!cancelled) setData(json);
    }
    loadRestaurants();
    return () => { cancelled = true; };
  }, []);

  const restaurants = useMemo(() => {
    return restaurantData?.restaurants ?? [];
  }, [restaurantData]);

  return (
    <section
      className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5"
      aria-live="polite">
      {restaurants.map((r) => (
        <RestaurantCard key={`${r.id}-${r.name}`} restaurant={r} />
      ))}
    </section>
  );
}

function RestaurantCard({ restaurant }) {
  return (
    <article className="group overflow-hidden rounded-2xl shadow-sm shadow-stone-800 transition">
      <a href={`menu.html?id=${restaurant.id}`} className="block">
        <div className="relative overflow-hidden">
          <img
            src={restaurant.image}
            className="h-40 w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            loading="lazy"
            alt={restaurant.name}/>

          {/* Soft Overlay */}
          <div className="absolute inset-0 bg-black/5" />

          {/* Center Bar */}
          <div className="absolute inset-x-0 top-1/4 -translate-y-1/2">
            <div className="bg-white px-3 py-2 shadow-sm shadow-stone-800 backdrop-blur-sm">
              <div className="flex items-baseline justify-between gap-2">
                <h2 className="min-w-0 truncate text-base font-semibold text-stone-900">
                  {restaurant.name}
                </h2>
                <p className="shrink-0 text-[11px] font-medium text-stone-600">
                  {restaurant.cuisine}
                </p>
              </div>
            </div>
          </div>
        </div>
      </a>
    </article>
  );
}


ReactDOM.createRoot(document.getElementById("restaurantGrid")).render(<RestaurantGrid />);
