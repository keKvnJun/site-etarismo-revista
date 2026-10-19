/* etarismo. — comportamento da revista (sem dependências). */
(function () {
  "use strict";

  const ED = window.EDITION;
  const BODY = Object.fromEntries((window.ARTICLES || []).map(a => [a.id, a]));
  const ORDER = ED.order;
  const READING_ORDER = ORDER.flatMap(o => o.id === "editorial" ? [o, ED.summary] : [o]);
  const TOC_ORDER = [ED.cover, ...READING_ORDER];
  const TOTAL_PAGES = Math.max(...READING_ORDER.map(o => Number(o.page)));
  const STORIES = ORDER.filter(o => o.theme);          // as 14 matérias dos cards
  const byId = id => READING_ORDER.find(o => o.id === id);
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const icon = name => `<span class="design-icon icon--${name}" aria-hidden="true"></span>`;
  const ICON = {
    arrow: icon("card-open"),
    right: icon("reader-next"),
    left: icon("reader-previous"),
    mark: icon("reader-bookmark"),
    cardMark: icon("bookmark-card"),
    clock: icon("clock"),
    moon: icon("moon"),
    sun: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
    link: icon("share"),
    zoom: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5"/><path d="m20 20-4.4-4.4M11 8.5v5M8.5 11h5"/></svg>',
    check: icon("check"),
    close: icon("close")
  };
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  document.documentElement.classList.add("js");

  /* ---------- storage (sessão; falha silenciosa em modo privado) ---------- */
  const store = {
    get(k, d) { try { const v = sessionStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (_) { return d; } },
    set(k, v) { try { sessionStorage.setItem(k, JSON.stringify(v)); } catch (_) { /* sem armazenamento */ } }
  };
  let saved = new Set(store.get("etarismo:saved", []));
  const prefs = Object.assign({ size: 0, dark: false }, store.get("etarismo:reader", {}));
  if (document.documentElement.dataset.theme) prefs.dark = document.documentElement.dataset.theme === "dark";

  function applyTheme() {
    document.documentElement.dataset.theme = prefs.dark ? "dark" : "light";
    $('meta[name="theme-color"]').content = prefs.dark ? "#20261c" : "#f7f6f0";
    $$("[data-theme-toggle], [data-dark]").forEach(button => {
      const label = button.hasAttribute("data-theme-toggle") ? "modo escuro" : "leitura escura";
      const action = `${prefs.dark ? "Desativar" : "Ativar"} ${label}`;
      button.setAttribute("aria-pressed", String(prefs.dark));
      button.setAttribute("aria-label", action);
      button.title = action;
      button.innerHTML = prefs.dark ? ICON.sun : ICON.moon;
    });
    try { localStorage.setItem("etarismo:theme", prefs.dark ? "dark" : "light"); }
    catch (_) { /* Sem armazenamento, a alternância continua funcionando. */ }
  }

  /* ---------- media: tenta carregar o arquivo; senão mostra a descrição ---------- */
  function mediaHTML(src, alt) {
    return `<div class="media" data-media data-src="${esc(src)}" data-alt="${esc(alt)}"></div>`;
  }
  function hydrateMedia(root = document) {
    $$("[data-media]:not([data-ready])", root).forEach(el => {
      el.dataset.ready = "1";
      const img = new Image();
      img.alt = el.dataset.alt || "";
      img.decoding = "async";
      img.onload = () => { el.classList.remove("is-missing"); el.replaceChildren(img); el.dispatchEvent(new CustomEvent("media:ok", { bubbles: true })); };
      img.onerror = () => {
        el.classList.add("is-missing");
        el.setAttribute("role", "img");
        el.setAttribute("aria-label", el.dataset.alt || "Imagem indisponível");
        el.innerHTML = `<p class="media__alt" aria-hidden="true">${esc(el.dataset.alt || "")}</p>`;
      };
      img.src = el.dataset.src;
    });
  }

  /* ---------- toast ---------- */
  const toastEl = $("[data-toast]");
  let toastT;
  function toast(msg) {
    // O aviso precisa estar dentro do modal para aparecer acima de sua camada.
    const host = document.querySelector("dialog:modal") || document.body;
    if (toastEl.parentElement !== host) host.append(toastEl);
    toastEl.textContent = msg;
    toastEl.classList.add("is-on");
    clearTimeout(toastT);
    toastT = setTimeout(() => toastEl.classList.remove("is-on"), 2600);
  }

  /* ---------- salvos ---------- */
  function setSaved(id, on) {
    on ? saved.add(id) : saved.delete(id);
    store.set("etarismo:saved", [...saved]);
    syncSaved();
    toast(on ? "Matéria salva nesta sessão." : "Matéria removida das salvas.");
  }
  function syncSaved() {
    const n = saved.size;
    const btn = $("[data-open-saved]");
    const badge = $("[data-saved-count]");
    btn.setAttribute("aria-label", `Matérias salvas nesta sessão: ${n}`);
    badge.textContent = n;
    badge.hidden = n === 0;
    $$("[data-save]").forEach(b => {
      const on = saved.has(b.dataset.save);
      b.setAttribute("aria-pressed", String(on));
      const lbl = b.querySelector("[data-save-label]");
      if (lbl) lbl.textContent = on ? "Salva" : "Salvar";
    });
  }

  /* ---------- quick numbers ---------- */
  $("[data-quick-list]").innerHTML = ED.quickNumbers.map(q => `
    <li class="quick__item">
      <button type="button" data-open-article="${q.opens}" aria-label="${esc(q.value + q.unit + " " + q.label)}. Abrir a matéria relacionada.">
        <span class="quick__value">${q.value}<small>${q.unit.trim()}</small></span>
        <span class="quick__label">${esc(q.label)}</span>
        <span class="quick__source">${esc(q.source)}</span>
      </button>
    </li>`).join("");

  /* ---------- stories: filtros + paginação ---------- */
  const PER_PAGE = 3;
  const state = { theme: null, page: 0, all: false };
  const cardsEl = $("[data-cards]");
  const pagerEl = $("[data-pager]");
  const dotsEl = $("[data-pager-dots]");
  const filtersEl = $("[data-filters]");

  filtersEl.innerHTML =
    `<button type="button" class="chip" data-theme="" aria-pressed="true">Todas as matérias <span class="chip__count">${STORIES.length}</span></button>` +
    ED.themes.map(t => `<button type="button" class="chip" data-theme="${t}" aria-pressed="false">${t}</button>`).join("");

  function cardHTML(o) {
    const ph = ED.PHOTOS[o.photo];
    const crop = ph.crop;
    const photoStyle = crop ? ` style="--photo-x:${crop.x}%;--photo-y:${crop.y}%;--photo-w:${crop.width}%;--photo-h:${crop.height}%"` : "";
    return `
      <article class="card is-entering"${photoStyle}>
        <div class="card__media">
          <button type="button" class="card__open" data-open-article="${o.id}" aria-label="Ler ${esc(o.title)}" tabindex="-1">
            ${mediaHTML(ph.src, ph.alt)}
          </button>
          <span class="card__theme">${o.theme}</span>
          <span class="card__number" aria-hidden="true">${o.page}</span>
          <button type="button" class="card__save" data-save="${o.id}" aria-pressed="false" aria-label="Salvar ${esc(o.title)}">
            ${ICON.cardMark}<span data-save-label>Salvar</span>
          </button>
        </div>
        <p class="card__meta"><span>${esc(o.tag)}</span><span>${o.minutes} min de leitura</span></p>
        <h3 class="card__title">
          <button type="button" data-open-article="${o.id}">${esc(o.title)}${ICON.arrow}</button>
        </h3>
        ${o.teaser ? `<p class="card__teaser">${esc(o.teaser)}</p>` : ""}
      </article>`;
  }

  function renderStories({ animate = true } = {}) {
    const list = state.theme ? STORIES.filter(s => s.theme === state.theme) : STORIES;
    const pages = Math.max(1, Math.ceil(list.length / PER_PAGE));
    state.page = Math.min(state.page, pages - 1);
    const shown = state.all ? list : list.slice(state.page * PER_PAGE, state.page * PER_PAGE + PER_PAGE);

    cardsEl.innerHTML = shown.length ? shown.map(cardHTML).join("") :
      `<p class="cards__empty">Nenhuma matéria neste tema.</p>`;
    hydrateMedia(cardsEl);
    syncSaved();
    if (animate && !reduceMotion.matches) {
      $$(".card", cardsEl).forEach((card, i) => {
        if (typeof card.animate !== "function") return;
        card.animate([
          { opacity: 0.82, transform: "translateY(6px)" },
          { opacity: 1, transform: "translateY(0)" }
        ], { duration: 560, delay: Math.min(i, 2) * 40, easing: "cubic-bezier(.22,.61,.36,1)" });
      });
    }

    const showPager = !state.all && pages > 1;
    pagerEl.hidden = !showPager;
    dotsEl.innerHTML = Array.from({ length: pages }, (_, i) =>
      `<button type="button" data-goto="${i}" aria-label="Mostrar grupo ${i + 1} de matérias" ${i === state.page ? 'aria-current="true"' : ""}></button>`).join("");
    $("[data-page-prev]").disabled = state.page === 0;
    $("[data-page-next]").disabled = state.page >= pages - 1;

    $$(".chip", filtersEl).forEach(c => c.setAttribute("aria-pressed", String((c.dataset.theme || null) === state.theme)));
    const tgl = $("[data-toggle-all]");
    tgl.setAttribute("aria-pressed", String(state.all));
    $("[data-toggle-all-label]").textContent = state.all ? "Mostrar destaques" : "Todas as matérias";
  }

  filtersEl.addEventListener("click", e => {
    const c = e.target.closest(".chip"); if (!c) return;
    state.theme = c.dataset.theme || null; state.page = 0; renderStories();
  });
  dotsEl.addEventListener("click", e => {
    const b = e.target.closest("[data-goto]"); if (!b) return;
    state.page = +b.dataset.goto; renderStories();
  });
  $("[data-page-prev]").addEventListener("click", () => { state.page--; renderStories(); });
  $("[data-page-next]").addEventListener("click", () => { state.page++; renderStories(); });
  $("[data-toggle-all]").addEventListener("click", () => { state.all = !state.all; renderStories(); });

  /* ---------- explorador de dados ---------- */
  const explorer = $("[data-explorer]");
  const barsEl = $("[data-bars]");
  const fmt = v => v.toLocaleString("pt-BR", { minimumFractionDigits: 1 }) + "%";
  // Grade, eixo e barras compartilham a mesma área de plotagem (0–40%).
  const AXIS_MAX = 40;
  $("[data-grid]").innerHTML = [0, 10, 20, 30, 40].map(t =>
    `<span style="bottom:${(t / AXIS_MAX) * 100}%"><i>${t}%</i></span>`).join("");
  barsEl.innerHTML = ED.population60.map(d => `
    <button type="button" class="bar" data-year="${d.year}" data-kind="${d.kind}" aria-pressed="${d.year === "2023"}"
            aria-label="${d.year}: ${fmt(d.value)}${d.kind === "Projeção" ? ", projeção" : ""}">
      <span class="bar__col"><span class="bar__fill" style="--h:${(d.value / AXIS_MAX) * 100}%"><span class="bar__value">${fmt(d.value)}</span></span></span>
      <span class="bar__label"><b>${d.year}</b><small>${d.kind}</small></span>
    </button>`).join("");
  barsEl.addEventListener("click", e => {
    const b = e.target.closest(".bar"); if (!b) return;
    const d = ED.population60.find(x => x.year === b.dataset.year);
    $$(".bar", barsEl).forEach(x => x.setAttribute("aria-pressed", String(x === b)));
    $("[data-readout-value]").textContent = fmt(d.value);
    $("[data-readout-label]").innerHTML = `da população brasileira<br>em ${d.year}${d.kind === "Projeção" ? " (projeção)" : ""}`;
  });
  if ("IntersectionObserver" in window) {
    new IntersectionObserver((entries, obs) => {
      if (entries.some(en => en.isIntersecting)) { explorer.classList.add("is-visible"); obs.disconnect(); }
    }, { threshold: 0.35 }).observe(explorer);
  } else explorer.classList.add("is-visible");

  /* ---------- glossário ---------- */
  $("[data-glossary]").innerHTML = ED.glossary.map((g, i) => {
    const n = String(i + 1).padStart(2, "0");
    const open = i === 0;
    return `
      <div class="acc">
        <button type="button" class="acc__btn" id="acc-b-${i}" aria-expanded="${open}" aria-controls="acc-p-${i}">
          <span class="acc__num">${n}</span><span class="acc__term">${esc(g.term)}</span><span class="acc__icon" aria-hidden="true">${icon(open ? "minus" : "plus")}</span>
        </button>
        <div class="acc__panel${open ? " is-open" : ""}" id="acc-p-${i}" role="region" aria-labelledby="acc-b-${i}">
          <div>${g.def ? `<p>${esc(g.def)}</p>` : `<p class="is-pending">Definição em preparação para esta prévia.</p>`}</div>
        </div>
      </div>`;
  }).join("");
  $("[data-glossary]").addEventListener("click", e => {
    const b = e.target.closest(".acc__btn"); if (!b) return;
    const open = b.getAttribute("aria-expanded") !== "true";
    b.setAttribute("aria-expanded", String(open));
    $(".acc__icon", b).innerHTML = icon(open ? "minus" : "plus");
    $("#" + b.getAttribute("aria-controls")).classList.toggle("is-open", open);
  });

  /* ---------- equipe ---------- */
  $$("[data-team-member]").forEach(el => {
    const member = ED.team.find(m => m.name === el.dataset.teamMember);
    if (!member) return;
    el.dataset.teamPhoto = member.photo;
    el.dataset.name = member.name;
    el.style.setProperty("--portrait-position", member.position || "50% 50%");
  });
  $("[data-team]").innerHTML = ED.team.map(m => `
    <li class="member">
      <div class="member__photo" style="--portrait-position:${esc(m.position || "50% 50%")}" data-team-photo="${esc(m.photo)}" data-name="${esc(m.name)}"><span aria-hidden="true">${m.initials}</span></div>
      <p class="member__name">${esc(m.name)}</p>
      <p class="member__role">Grupo de pesquisa</p>
    </li>`).join("");
  $$("[data-team-photo]").forEach(el => {
    const img = new Image();
    img.alt = "Foto de " + el.dataset.name;
    img.onload = () => el.replaceChildren(img);
    img.src = el.dataset.teamPhoto;
  });

  /* ---------- leitor ---------- */
  const reader = $("[data-reader]");
  const paper = $("[data-reader-paper]");
  const scroller = $("[data-reader-scroll]");
  const articleEl = $("[data-reader-article]");
  const progressEl = $("[data-reader-progress]");
  const SIZES = [1.0625, 1.1875, 1.3125, 1.4375];  // A− … A+
  let currentId = null;
  let lastFocus = null;

  function blockHTML([type, a, b]) {
    if (type === "h") return `<h3>${esc(a)}</h3>`;
    if (type === "figure") {
      return `
        <figure class="reader__figure">
          <div class="reader__figure-frame">
            ${mediaHTML(a, "Gráfico original da reportagem; descrição e fonte disponíveis no texto da matéria.")}
            <button type="button" class="reader__zoom" data-zoom="${esc(a)}" disabled>${ICON.zoom} Ampliar gráfico original</button>
          </div>
          <figcaption>${esc(b)}</figcaption>
        </figure>`;
    }
    if (Array.isArray(b)) {
      const runs = b.map(run => {
        const text = esc(run.text);
        if (run.href && /^https?:\/\//i.test(run.href)) return `<a href="${esc(run.href)}" target="_blank" rel="noopener noreferrer">${text}</a>`;
        return run.underline ? `<span class="reader__source-label">${text}</span>` : text;
      }).join("");
      return `<p>${runs}</p>`;
    }
    return `<p>${esc(a)}</p>`;
  }

  function renderArticle(id) {
    const meta = byId(id);
    const body = BODY[id];
    const isSummary = id === ED.summary.id;
    const i = READING_ORDER.indexOf(meta);
    const prev = READING_ORDER[i - 1], next = READING_ORDER[i + 1];
    articleEl.classList.toggle("reader__article--summary", isSummary);
    $("[data-reader-page]").textContent = `Página ${meta.page} / ${TOTAL_PAGES}`;
    articleEl.innerHTML = `
      <p class="reader__kicker">${esc(meta.kicker)}</p>
      <h2 class="reader__title" id="reader-title" tabindex="-1">${esc(meta.title)}</h2>
      ${isSummary ? "" : `<div class="reader__meta">
        <span>${ICON.clock} ${meta.minutes} min de leitura</span>
        <small>Grupo de pesquisa sobre etarismo</small>
      </div>`}
      <div class="reader__tools">
        <div>
          <button class="icon-btn txt" type="button" data-size="-1" aria-label="Diminuir texto">A−</button>
          <button class="icon-btn txt txt--lg" type="button" data-size="1" aria-label="Aumentar texto">A+</button>
          <span class="sep" aria-hidden="true"></span>
          <button class="icon-btn" type="button" data-dark aria-pressed="${prefs.dark}" aria-label="Ativar leitura escura">${ICON.moon}</button>
        </div>
        <div>
          ${isSummary ? "" : `<button class="icon-btn" type="button" data-save="${id}" aria-pressed="false" aria-label="Salvar matéria">${ICON.mark}</button>`}
          <button class="icon-btn" type="button" data-copy aria-label="Copiar link da matéria">${ICON.link}</button>
        </div>
      </div>
      ${isSummary ? `<div class="reader__summary">
        <p class="reader__summary-intro">${esc(meta.intro)}</p>
        <p class="reader__summary-count">${TOC_ORDER.length} páginas nesta edição</p>
        <ol class="toc" aria-label="Sumário da edição">${TOC_ORDER.map(o => tocItem(o)).join("")}</ol>
      </div>` : `<div class="reader__body">
        ${body ? body.blocks.map(blockHTML).join("") : `
          <div class="reader__pending">
            <strong>O texto desta página ainda não está nesta prévia.</strong>
            Ele entra na próxima atualização da edição. Enquanto isso, siga para a próxima leitura ou volte ao sumário.
          </div>`}
      </div>
      <div class="reader__end"><span>Você chegou ao fim desta leitura.</span>${ICON.check}</div>`}
      <nav class="reader__nav" aria-label="Navegar entre leituras">
        ${prev ? `<button type="button" data-open-article="${prev.id}"><small>${ICON.left} Anterior</small><strong>${esc(prev.id === ED.summary.id ? prev.kicker : prev.title)}</strong></button>` : ""}
        ${next ? `<button type="button" class="is-next" data-open-article="${next.id}"><small>Próxima leitura ${ICON.right}</small><strong>${esc(next.id === ED.summary.id ? next.kicker : next.title)}</strong></button>`
               : `<button type="button" class="is-next" data-close-reader><small>Edição completa</small><strong>Voltar à revista</strong></button>`}
      </nav>`;
    hydrateMedia(articleEl);
    $$("[data-zoom]", articleEl).forEach(z => {
      z.closest("figure").addEventListener("media:ok", () => { z.disabled = false; });
    });
    applyPrefs();
    syncSaved();
    scroller.scrollTop = 0;
    updateProgress();
  }

  function applyPrefs() {
    const size = SIZES[prefs.size + 1];
    paper.style.setProperty("--r-size", `clamp(${size}rem, ${size * 2}vw, ${size * 1.8}rem)`);
    paper.classList.toggle("is-dark", prefs.dark);
    applyTheme();
    const dn = $('[data-size="-1"]', articleEl), up = $('[data-size="1"]', articleEl);
    if (dn) dn.disabled = prefs.size <= -1;
    if (up) up.disabled = prefs.size >= SIZES.length - 2;
    store.set("etarismo:reader", prefs);
  }

  function updateProgress() {
    const max = scroller.scrollHeight - scroller.clientHeight;
    progressEl.style.setProperty("--p", max > 0 ? Math.min(1, scroller.scrollTop / max) : 1);
  }
  scroller.addEventListener("scroll", updateProgress, { passive: true });

  function openArticle(id, { push = true } = {}) {
    if (!byId(id)) return;
    closeSheets();
    if (!reader.open) { lastFocus = document.activeElement; reader.showModal(); document.body.style.overflow = "hidden"; }
    currentId = id;
    renderArticle(id);
    $("#reader-title").focus({ preventScroll: true });
    if (push) history.pushState({ id }, "", id === ED.summary.id ? "#/sumario" : "#/leitura/" + id);
    document.title = byId(id).title + " — etarismo.";
  }
  function closeReader({ push = true } = {}) {
    if (!reader.open) return;
    reader.close();
  }
  reader.addEventListener("close", () => {
    document.body.style.overflow = "";
    currentId = null;
    document.title = "etarismo. Revista digital · Edição especial 2026";
    if (location.hash.startsWith("#/")) history.pushState({}, "", location.pathname + location.search);
    if (lastFocus && document.contains(lastFocus)) lastFocus.focus();
  });
  reader.addEventListener("click", e => {
    if (e.target === reader) { reader.close(); return; }      // clique no fundo
    if (e.target.closest("[data-close-reader]")) { reader.close(); return; }
    const s = e.target.closest("[data-size]");
    if (s && !s.disabled) { prefs.size = Math.max(-1, Math.min(SIZES.length - 2, prefs.size + +s.dataset.size)); applyPrefs(); return; }
    if (e.target.closest("[data-dark]")) { prefs.dark = !prefs.dark; applyPrefs(); return; }
    if (e.target.closest("[data-copy]")) { copyLink(); return; }
    const z = e.target.closest("[data-zoom]");
    if (z && !z.disabled) openLightbox(z.dataset.zoom);
  });

  async function copyLink() {
    const url = location.href.split("#")[0] + (currentId === ED.summary.id ? "#/sumario" : "#/leitura/" + currentId);
    try { await navigator.clipboard.writeText(url); toast("Link da matéria copiado."); }
    catch (_) { window.prompt("Copie o link da matéria:", url); }
  }

  /* lightbox */
  function openLightbox(src) {
    const d = document.createElement("dialog");
    d.className = "lightbox";
    d.setAttribute("aria-label", "Gráfico original ampliado");
    d.innerHTML = `<img src="${esc(src)}" alt="Gráfico original da reportagem, ampliado."><button class="icon-btn" type="button" aria-label="Fechar gráfico ampliado">${ICON.close}</button>`;
    reader.after(d);
    d.addEventListener("close", () => d.remove());
    d.addEventListener("click", e => { if (e.target === d || e.target.closest("button")) d.close(); });
    d.showModal();
  }

  /* ---------- sumário e painéis de busca e salvos ---------- */
  const search = $("[data-search]"), savedDlg = $("[data-saved]");
  function tocItem(o, extra = "") {
    const current = o.id === ED.summary.id;
    const tag = current ? "div" : "button";
    const attrs = current ? 'class="toc__current" aria-current="page"'
      : o.id === ED.cover.id ? 'type="button" data-open-cover'
      : `type="button" data-open-article="${o.id}"`;
    return `<li><${tag} ${attrs}>
      <span class="toc__num">${o.page}</span>
      <span class="toc__kicker">${esc(o.kicker)}</span>
      <span class="toc__title">${extra || esc(o.title)}</span></${tag}></li>`;
  }

  function openSheet(d) {
    closeSheets();
    if (reader.open) reader.close();
    lastFocus = document.activeElement;
    d.showModal();
  }
  function closeSheets() { [search, savedDlg].forEach(d => d.open && d.close()); }
  [search, savedDlg].forEach(d => {
    d.addEventListener("click", e => { if (e.target === d || e.target.closest("[data-close-sheet]")) d.close(); });
    d.addEventListener("close", () => {
      if (!reader.open && lastFocus && document.contains(lastFocus)) lastFocus.focus();
    });
  });

  // busca
  const norm = s => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  const haystack = Object.fromEntries(ORDER.map(o => [o.id, norm([o.title, o.kicker, o.theme || "", o.teaser || "", ...(BODY[o.id] ? BODY[o.id].blocks.map(b => b[b[0] === "figure" ? 2 : 1]) : [])].join(" "))]));
  const qInput = $("[data-search-input]");
  function runSearch() {
    const q = norm(qInput.value.trim());
    const list = $("[data-search-list]"), status = $("[data-search-status]");
    if (!q) { list.innerHTML = ""; status.textContent = "Digite para buscar entre as 18 leituras."; return; }
    const hits = ORDER.filter(o => haystack[o.id].includes(q));
    status.textContent = hits.length ? `${hits.length} ${hits.length === 1 ? "leitura encontrada" : "leituras encontradas"}.` : "Nenhuma leitura encontrada. Tente outro termo, como “seleção” ou “IBGE”.";
    list.innerHTML = hits.map(o => {
      const t = esc(o.title), i = norm(o.title).indexOf(q);
      const title = i >= 0 ? t.slice(0, i) + "<mark>" + t.slice(i, i + q.length) + "</mark>" + t.slice(i + q.length) : t;
      return tocItem(o, i >= 0 && t.length === o.title.length ? title : t);
    }).join("");
  }
  qInput.addEventListener("input", runSearch);
  // Em campos type=search o Esc nativo só limpa o texto; aqui ele fecha a busca.
  qInput.addEventListener("keydown", e => { if (e.key === "Escape") { e.preventDefault(); search.close(); } });

  function renderSavedList() {
    const items = ORDER.filter(o => saved.has(o.id));
    $("[data-saved-list]").innerHTML = items.length ? items.map(o => tocItem(o)).join("")
      : `<li class="toc__empty">Nenhuma matéria salva ainda. Use o marcador nos cards ou no leitor para guardar uma leitura.</li>`;
  }

  /* ---------- delegação global ---------- */
  document.addEventListener("click", e => {
    if (e.target.closest("[data-theme-toggle]")) { prefs.dark = !prefs.dark; applyPrefs(); return; }
    if (e.target.closest("[data-open-cover]")) {
      lastFocus = $(".brand");
      closeReader();
      history.pushState({}, "", "#inicio");
      $("#inicio").scrollIntoView({ behavior: reduceMotion.matches ? "auto" : "smooth" });
      return;
    }
    const open = e.target.closest("[data-open-article]");
    if (open) { e.preventDefault(); openArticle(open.dataset.openArticle); return; }
    const save = e.target.closest("[data-save]");
    if (save) { setSaved(save.dataset.save, !saved.has(save.dataset.save)); return; }
    if (e.target.closest("[data-open-summary]")) { openArticle(ED.summary.id); return; }
    if (e.target.closest("[data-open-search]")) { openSheet(search); runSearch(); qInput.focus(); return; }
    if (e.target.closest("[data-open-saved]")) { renderSavedList(); openSheet(savedDlg); return; }
  });

  /* ---------- menu mobile ---------- */
  const menuBtn = $("[data-menu-toggle]"), sheet = $("[data-menu-sheet]");
  function setMenu(open) {
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    sheet.hidden = !open;
  }
  menuBtn.addEventListener("click", () => setMenu(sheet.hidden));
  sheet.addEventListener("click", e => { if (e.target.closest("a")) setMenu(false); });
  document.addEventListener("keydown", e => { if (e.key === "Escape" && !sheet.hidden) { setMenu(false); menuBtn.focus(); } });

  /* ---------- header + scrollspy ---------- */
  const header = $("[data-header]");
  const spyLinks = $$("[data-spy]");
  const sections = spyLinks.map(a => document.getElementById(a.dataset.spy));
  function onScroll() {
    header.classList.toggle("is-scrolled", window.scrollY > 8);
    const y = window.scrollY + window.innerHeight * 0.35;
    let active = sections[0];
    sections.slice().sort((a, b) => a.offsetTop - b.offsetTop).forEach(s => { if (s.offsetTop <= y) active = s; });
    spyLinks.forEach(a => a.setAttribute("aria-current", a.dataset.spy === active.id ? "true" : "false"));
  }
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- roteamento por hash ---------- */
  function route() {
    const m = location.hash.match(/^#\/leitura\/([\w-]+)/);
    if (m && byId(m[1])) { openArticle(m[1], { push: false }); return; }
    if (location.hash === "#/sumario") { openArticle(ED.summary.id, { push: false }); return; }
    if (reader.open) reader.close();
  }
  window.addEventListener("popstate", route);

  /* ---------- init ---------- */
  renderStories({ animate: false });
  hydrateMedia();
  syncSaved();
  applyPrefs();
  onScroll();
  route();
  requestAnimationFrame(() => {
    document.documentElement.classList.add("is-ready");
    if (reduceMotion.matches || location.hash.startsWith("#/")) return;
    $$(".hero__copy, .hero__visual").forEach((el, i) => {
      if (typeof el.animate !== "function") return;
      el.animate([
        { opacity: 0.9, transform: "translateY(6px)" },
        { opacity: 1, transform: "translateY(0)" }
      ], { duration: 900, delay: i * 70, easing: "cubic-bezier(.22,.61,.36,1)" });
    });
  });
})();
