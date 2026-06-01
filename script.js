const colorGrid = document.querySelector('#colorGrid');
const emptyMessage = document.querySelector('#emptyMessage');
const searchInput = document.querySelector('#searchInput');
const categoryFilters = document.querySelector('#categoryFilters');
const resultTitle = document.querySelector('#resultTitle');
const resultCount = document.querySelector('#resultCount');
const toast = document.querySelector('#toast');

let activeCategory = 'Todas';

function rgbToString(rgb) {
  return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
}

function copyText(text) {
  navigator.clipboard.writeText(text).then(() => {
    showToast(`${text} copiado`);
  }).catch(() => {
    const helper = document.createElement('textarea');
    helper.value = text;
    document.body.appendChild(helper);
    helper.select();
    document.execCommand('copy');
    helper.remove();
    showToast(`${text} copiado`);
  });
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 1400);
}

function createCategoryButton(category) {
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = category;
  button.className = category === activeCategory ? 'filter active' : 'filter';
  button.addEventListener('click', () => {
    activeCategory = category;
    renderFilters();
    renderColors();
  });
  return button;
}

function renderFilters() {
  const categories = ['Todas', ...new Set(COLORS.map((color) => color.category))];
  categoryFilters.innerHTML = '';
  categories.forEach((category) => categoryFilters.appendChild(createCategoryButton(category)));
}

function createColorCard(color) {
  const rgb = rgbToString(color.rgb);
  const card = document.createElement('article');
  card.className = 'color-card';
  card.innerHTML = `
    <button class="swatch" type="button" style="background:${rgb}" data-copy="${rgb}" aria-label="Copiar ${rgb}"></button>
    <div class="info">
      <div>
        <h3>${color.pt}</h3>
        <p>${color.name}</p>
      </div>
      <button class="value" type="button" data-copy="${rgb}">${rgb}</button>
      <button class="value hex" type="button" data-copy="${color.hex}">${color.hex}</button>
    </div>
  `;
  return card;
}

function renderColors() {
  const term = searchInput.value.trim().toLowerCase();

  const filtered = COLORS.filter((color) => {
    const rgb = rgbToString(color.rgb).toLowerCase();
    const matchesCategory = activeCategory === 'Todas' || color.category === activeCategory;
    const matchesSearch = !term ||
      color.pt.toLowerCase().includes(term) ||
      color.name.toLowerCase().includes(term) ||
      color.category.toLowerCase().includes(term) ||
      color.hex.toLowerCase().includes(term) ||
      rgb.includes(term);

    return matchesCategory && matchesSearch;
  });

  colorGrid.innerHTML = '';
  filtered.forEach((color) => colorGrid.appendChild(createColorCard(color)));

  resultTitle.textContent = activeCategory === 'Todas' ? 'Todas as cores' : activeCategory;
  resultCount.textContent = `${filtered.length} ${filtered.length === 1 ? 'cor encontrada' : 'cores encontradas'}`;
  emptyMessage.hidden = filtered.length > 0;
}

document.body.addEventListener('click', (event) => {
  const target = event.target.closest('[data-copy]');
  if (target) copyText(target.dataset.copy);
});

searchInput.addEventListener('input', renderColors);

renderFilters();
renderColors();
