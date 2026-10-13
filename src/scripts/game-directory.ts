const directory = document.querySelector<HTMLElement>('#games-directory');
if (directory) {
  const search = directory.querySelector<HTMLInputElement>('#directory-search')!;
  const source = directory.querySelector<HTMLSelectElement>('#directory-source')!;
  const cards = [...directory.querySelectorAll<HTMLAnchorElement>('[data-game-code]')];
  const count = directory.querySelector<HTMLElement>('#directory-count')!;
  const empty = directory.querySelector<HTMLElement>('#directory-empty')!;
  const codeForm = document.querySelector<HTMLFormElement>('#game-code-form')!;
  const codeInput = codeForm.querySelector<HTMLInputElement>('#game-code')!;
  const codeStatus = codeForm.querySelector<HTMLElement>('#game-code-status')!;
  function filter() {
    const query = search.value.trim().toLowerCase();
    let visible = 0;
    for (const card of cards) {
      const matches = `${card.dataset.gameName} ${card.dataset.gameCode}`.toLowerCase().includes(query);
      card.hidden = !matches || (source.value !== 'all' && card.dataset.gameSource !== source.value);
      if (!card.hidden) visible++;
    }
    count.textContent = `${visible} of ${cards.length} games`;
    empty.hidden = visible !== 0;
  }
  function reset() { search.value = ''; source.value = 'all'; filter(); search.focus(); }
  function open(code: string) { document.dispatchEvent(new CustomEvent('calcsolver:open', { detail: { code } })); }
  search.addEventListener('input', filter);
  source.addEventListener('change', filter);
  directory.querySelector('#directory-reset')?.addEventListener('click', reset);
  cards.forEach(card => {
    card.addEventListener('click', event => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) return;
      event.preventDefault(); open(card.dataset.gameCode!);
    });
    const image = card.querySelector('img')!;
    image.addEventListener('error', () => { image.hidden = true; }, { once: true });
    if (image.complete && !image.naturalWidth) image.hidden = true;
  });
  codeInput.addEventListener('input', () => { codeStatus.textContent = ''; codeInput.removeAttribute('aria-invalid'); });
  codeForm.addEventListener('submit', event => {
    event.preventDefault();
    const code = codeInput.value.trim();
    if (code === '0000') { codeStatus.textContent = 'Showing all games.'; reset(); return; }
    if (!cards.some(card => card.dataset.gameCode === code)) {
      codeStatus.textContent = /^\d{4}$/.test(code) ? 'Code not found. Try 0000 for all games.' : 'Enter a four-digit game code.';
      codeInput.setAttribute('aria-invalid', 'true');
      return;
    }
    codeInput.removeAttribute('aria-invalid'); codeStatus.textContent = ''; open(code);
  });
}
