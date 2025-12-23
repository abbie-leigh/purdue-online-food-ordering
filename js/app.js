const RESTAURANT_API_URL = "https://dummyjson.com/c/2d83-4f1d-4625-a81f";

async function loadData() {
  const response = await fetch(RESTAURANT_API_URL);
  const data = await response.json();
  console.log(data);
  return data;
}

loadData();

