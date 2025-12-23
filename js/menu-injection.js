const RESTAURANT_API_URL = "https://dummyjson.com/c/2d83-4f1d-4625-a81f";

export async function loadData() {
  const response = await fetch(RESTAURANT_API_URL);
  const data = await response.json();
  console.log(data.restaurants);

  const name = "Trattoria Roma";
  const restaurant = data.restaurants.find(r => r.name === name);
  const items = restaurant?.menu?.items ?? [];

  const grid = document.querySelector("#menuGrid");
  grid.innerHTML = items.map(renderCard).join("");

  return data;
}

loadData();

function renderCard(item) {
  const tagsHtml = item.tags
    .map(
      (tag) => `
        <span class="text-xs px-2 py-0.5 rounded-full bg-stone-100 text-stone-700">
          ${escapeHtml(tag)}
        </span>
      `
    )
    .join("");

  const price = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(item.price);

  return `
    <article class="bg-white rounded-2xl shadow border border-slate-100 overflow-hidden">
      <!-- Top: Title + Price -->
      <div class="p-4">
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0">
            <h2 class="text-lg text-slate-800 font-semibold truncate">${escapeHtml(item.name)}</h2>
            <p class="text-xs text-slate-500">${escapeHtml(item.description)}</p>
          </div>

          <p class="text-lg text-slate-800 font-semibold whitespace-nowrap">${price}</p>
        </div>
      </div>

      <!-- Middle: Photo -->
      <div class="relative">
        <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.name)}" class="w-full h-64 object-cover"/>
        <button
          class="absolute bottom-3 right-3 px-4 py-2 text-m font-semibold rounded-xl
                bg-white text-slate-800 shadow-md
                hover:bg-orange-400 hover:text-white"
          aria-label="Add Margherita Pizza to cart">
          Add
        </button>
      </div>
      
    </article>
  `;
}


// // One click handler for all buttons (event delegation)
// grid.addEventListener("click", (e) => {
//   const btn = e.target.closest("button[data-item-id]");
//   if (!btn) return;

//   const id = btn.dataset.itemId;
//   console.log("Add to cart:", id);
// });

// --- small helpers to avoid HTML injection bugs ---
function escapeHtml(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
