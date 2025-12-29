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
    <article className="group overflow-hidden rounded-2xl border border-white bg-white shadow-lg shadow-black/20 transition">
      <a href={`menu.html?id=${restaurant.id}`} className="block">
        <div className="p-3 flex items-center justify-between gap-3">
          <h2 className="text-lg text-stone-800 font-semibold truncate">
            {restaurant.name}
          </h2>
          <p className="text-xs text-stone-500">{restaurant.cuisine}</p>
        </div>

        <div className="relative overflow-hidden after:pointer-events-none">
          <img
            src={restaurant.image}
            className="h-40 w-full object-cover duration-300 group-hover:scale-[1.02]"
            loading="lazy"
          />
        </div>

      </a>
    </article>
  );
}

ReactDOM.createRoot(document.getElementById("restaurantGrid")).render(<RestaurantGrid />);
