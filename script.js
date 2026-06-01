const palette = document.querySelector('#palette');
const toast = document.querySelector('#toast');

function rgbToText(rgb) {
  return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
}

function copyText(text) {
  navigator.clipboard.writeText(text).then(() => {
    showToast(text);
  }).catch(() => {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    textarea.remove();
    showToast(text);
  });
}

function showToast(text) {
  toast.textContent = `${text} copiado`;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 1300);
}

function groupColors() {
  return COLORS.reduce((groups, color) => {
    if (!groups[color.category]) groups[color.category] = [];
    groups[color.category].push(color);
    return groups;
  }, {});
}

function createColorCard(color) {
  const rgb = rgbToText(color.rgb);
  const card = document.createElement('article');
  card.className = 'color-card';
  card.innerHTML = `
    <button class="color-preview" type="button" data-copy="${rgb}" style="background:${rgb}" aria-label="Copiar ${rgb}"></button>
    <div class="color-content">
      <h3>${color.pt}</h3>
      <p>${color.name}</p>
      <button class="rgb-button" type="button" data-copy="${rgb}">${rgb}</button>
      <span>${color.hex}</span>
    </div>
  `;
  return card;
}

function renderPalette() {
  const groups = groupColors();
  palette.innerHTML = '';

  Object.entries(groups).forEach(([category, colors]) => {
    const section = document.createElement('section');
    section.className = 'tone-section';

    const header = document.createElement('div');
    header.className = 'tone-header';
    header.innerHTML = `<h2>${category}</h2><p>${colors.length} tons</p>`;

    const grid = document.createElement('div');
    grid.className = 'color-grid';
    colors.forEach((color) => grid.appendChild(createColorCard(color)));

    section.appendChild(header);
    section.appendChild(grid);
    palette.appendChild(section);
  });
}

document.body.addEventListener('click', (event) => {
  const target = event.target.closest('[data-copy]');
  if (target) copyText(target.dataset.copy);
});

renderPalette();
