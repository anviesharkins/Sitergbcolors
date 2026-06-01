const popularGrid = document.querySelector('#popularGrid');
const emptyMessage = document.querySelector('#emptyMessage');
const searchInput = document.querySelector('#searchInput');
const categorySelect = document.querySelector('#categorySelect');
const toast = document.querySelector('#toast');

const redRange = document.querySelector('#redRange');
const greenRange = document.querySelector('#greenRange');
const blueRange = document.querySelector('#blueRange');
const redValue = document.querySelector('#redValue');
const greenValue = document.querySelector('#greenValue');
const blueValue = document.querySelector('#blueValue');
const previewBox = document.querySelector('#previewBox');
const rgbCopyButton = document.querySelector('#rgbCopyButton');
const hexCopyButton = document.querySelector('#hexCopyButton');

const pageRed = document.querySelector('#pageRed');
const pageGreen = document.querySelector('#pageGreen');
const previousPage = document.querySelector('#previousPage');
const nextPage = document.querySelector('#nextPage');
const pageInfo = document.querySelector('#pageInfo');
const allRgbGrid = document.querySelector('#allRgbGrid');

const categoryLabels = {
  all: 'Todas',
  neutras: 'Neutras',
  vermelhas: 'Vermelhas',
  laranjas: 'Laranjas',
  amarelas: 'Amarelas',
  verdes: 'Verdes',
  azuis: 'Azuis',
  roxas: 'Roxas',
  rosas: 'Rosas',
  marrons: 'Marrons'
};

function rgbToString(rgb) {
  return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
}

function componentToHex(value) {
  return value.toString(16).padStart(2, '0').toUpperCase();
}

function rgbToHex(rgb) {
  return `#${componentToHex(rgb[0])}${componentToHex(rgb[1])}${componentToHex(rgb[2])}`;
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    showToast(`${text} copiado`);
  } catch (error) {
    const helper = document.createElement('textarea');
    helper.value = text;
    document.body.appendChild(helper);
    helper.select();
    document.execCommand('copy');
    helper.remove();
    showToast(`${text} copiado`);
  }
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 1600);
}

function fillCategories() {
  const categories = [...new Set(COLORS.map((color) => color.category))];
  categories.forEach((category) => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = categoryLabels[category] || category;
    categorySelect.appendChild(option);
  });
}

function createColorCard(color) {
  const rgb = rgbToString(color.rgb);
  const card = document.createElement('article');
  card.className = 'color-card';
  card.innerHTML = `
    <div class="swatch" style="background: ${rgb}"></div>
    <div class="color-info">
      <h3>${color.pt}</h3>
      <p>${color.name}</p>
      <button class="copy-line" type="button" data-copy="${rgb}">${rgb}</button>
      <button class="copy-line muted" type="button" data-copy="${color.hex}">${color.hex}</button>
    </div>
  `;
  return card;
}

function renderPopularColors() {
  const term = searchInput.value.trim().toLowerCase();
  const category = categorySelect.value;

  const filtered = COLORS.filter((color) => {
    const rgb = rgbToString(color.rgb).toLowerCase();
    const matchesTerm = !term ||
      color.name.toLowerCase().includes(term) ||
      color.pt.toLowerCase().includes(term) ||
      color.hex.toLowerCase().includes(term) ||
      rgb.includes(term);

    const matchesCategory = category === 'all' || color.category === category;
    return matchesTerm && matchesCategory;
  });

  popularGrid.innerHTML = '';
  filtered.forEach((color) => popularGrid.appendChild(createColorCard(color)));
  emptyMessage.hidden = filtered.length > 0;
}

function updateGenerator() {
  const rgb = [Number(redRange.value), Number(greenRange.value), Number(blueRange.value)];
  const rgbText = rgbToString(rgb);
  const hexText = rgbToHex(rgb);

  redValue.textContent = rgb[0];
  greenValue.textContent = rgb[1];
  blueValue.textContent = rgb[2];
  previewBox.style.background = rgbText;
  rgbCopyButton.textContent = rgbText;
  hexCopyButton.textContent = hexText;
}

function clampChannel(value) {
  const number = Number(value);
  if (Number.isNaN(number)) return 0;
  return Math.min(255, Math.max(0, Math.round(number)));
}

function getPageIndex() {
  return clampChannel(pageRed.value) * 256 + clampChannel(pageGreen.value);
}

function setPageFromIndex(index) {
  const safeIndex = Math.min(65535, Math.max(0, index));
  pageRed.value = Math.floor(safeIndex / 256);
  pageGreen.value = safeIndex % 256;
  renderAllRgbPage();
}

function createMiniColor(rgb) {
  const rgbText = rgbToString(rgb);
  const button = document.createElement('button');
  button.className = 'mini-color';
  button.type = 'button';
  button.style.background = rgbText;
  button.title = rgbText;
  button.setAttribute('aria-label', `Copiar ${rgbText}`);
  button.dataset.copy = rgbText;
  return button;
}

function renderAllRgbPage() {
  const r = clampChannel(pageRed.value);
  const g = clampChannel(pageGreen.value);
  pageRed.value = r;
  pageGreen.value = g;

  allRgbGrid.innerHTML = '';
  const fragment = document.createDocumentFragment();

  for (let b = 0; b <= 255; b += 1) {
    fragment.appendChild(createMiniColor([r, g, b]));
  }

  allRgbGrid.appendChild(fragment);
  const pageNumber = getPageIndex() + 1;
  pageInfo.textContent = `Página ${pageNumber.toLocaleString('pt-BR')} de 65.536 — mostrando rgb(${r}, ${g}, 0) até rgb(${r}, ${g}, 255)`;
}

function setupEvents() {
  searchInput.addEventListener('input', renderPopularColors);
  categorySelect.addEventListener('change', renderPopularColors);

  document.body.addEventListener('click', (event) => {
    const copyTarget = event.target.closest('[data-copy]');
    if (copyTarget) copyText(copyTarget.dataset.copy);
  });

  [redRange, greenRange, blueRange].forEach((range) => {
    range.addEventListener('input', updateGenerator);
  });

  rgbCopyButton.addEventListener('click', () => copyText(rgbCopyButton.textContent));
  hexCopyButton.addEventListener('click', () => copyText(hexCopyButton.textContent));

  pageRed.addEventListener('input', renderAllRgbPage);
  pageGreen.addEventListener('input', renderAllRgbPage);
  previousPage.addEventListener('click', () => setPageFromIndex(getPageIndex() - 1));
  nextPage.addEventListener('click', () => setPageFromIndex(getPageIndex() + 1));
}

fillCategories();
renderPopularColors();
updateGenerator();
renderAllRgbPage();
setupEvents();
