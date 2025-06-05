const wineGrid = document.getElementById('wineGrid');
const searchInput = document.getElementById('searchInput');
const filterType = document.getElementById('filterType');
const sortBy = document.getElementById('sortBy');
const resetFilters = document.getElementById('resetFilters');

const API_URL = 'http://localhost:3000/api/wines';

let wines = [];
let filteredWines = [];

async function loadWines() {
  try {
    const res = await fetch(API_URL);
    wines = await res.json();
    filteredWines = [...wines];
    renderWines(filteredWines);
  } catch (e) {
    wineGrid.innerHTML = '<p style="color:red; text-align:center;">Failed to load wines.</p>';
    console.error(e);
  }
}

function renderWines(winesToRender) {
  wineGrid.innerHTML = '';

  if (winesToRender.length === 0) {
    wineGrid.innerHTML = '<p>No wines match your criteria.</p>';
    return;
  }

  winesToRender.forEach(wine => {
    const div = document.createElement('div');
    div.className = 'wine-card';

    div.innerHTML = `
      <a href="${wine.page}">
        <img src="http://localhost:3000/uploads/${wine.image}" alt="${wine.name}" />
        <h2>${wine.name}</h2>
        <p>Type: ${wine.type}</p>
        <p>Alcohol: ${wine.alcohol}%</p>
      </a>
    `;

    wineGrid.appendChild(div);
  });
}

function applyFilters() {
  const search = searchInput.value.trim().toLowerCase();
  const type = filterType.value;
  const sort = sortBy.value;

  filteredWines = wines.filter(wine => {
    const matchesSearch = wine.name.toLowerCase().includes(search);
    const matchesType = type === 'all' || wine.type === type;
    return matchesSearch && matchesType;
  });

  if (sort === 'name') {
    filteredWines.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sort === 'alcohol') {
    filteredWines.sort((a, b) => a.alcohol - b.alcohol);
  }

  renderWines(filteredWines);
}

searchInput.addEventListener('input', applyFilters);
filterType.addEventListener('change', applyFilters);
sortBy.addEventListener('change', applyFilters);
resetFilters.addEventListener('click', () => {
  searchInput.value = '';
  filterType.value = 'all';
  sortBy.value = 'name';
  applyFilters();
});

loadWines();
