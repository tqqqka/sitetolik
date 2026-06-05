const tourSearch = document.querySelector("#tourSearch");
const tourCards = Array.from(document.querySelectorAll(".tour-card"));
const tourCounter = document.querySelector("#tourCounter");
const tourRemaining = document.querySelector("#tourRemaining");
const nowUtcLabel = document.querySelector("#nowUtcLabel");
const togglePastButton = document.querySelector("#togglePastTours");
const tourList = document.querySelector("#tourList");

let hidePastTours = false;
let searchTimer = null;
const SEARCH_DELAY = 170;
const HIDE_ANIMATION_MS = 260;

function formatNowUtc() {
  return new Date().toISOString().replace(".000Z", " UTC").replace("T", " ");
}

function updateNowLabel() {
  if (nowUtcLabel) nowUtcLabel.textContent = "Сейчас: " + formatNowUtc();
}

function isPastCard(card) {
  return Date.now() > Date.parse(card.dataset.time);
}

function refreshTourStatuses() {
  const now = Date.now();
  let remainingTotal = 0;

  tourCards.forEach((card) => {
    const ms = Date.parse(card.dataset.time);
    const past = now > ms;

    if (!past) remainingTotal += 1;

    card.classList.toggle("past", past);
    card.classList.toggle("upcoming", !past);

    const status = card.querySelector(".tour-time span");
    if (status) status.textContent = past ? "прошёл" : "скоро";
  });

  if (tourRemaining) {
    tourRemaining.textContent = "Осталось концертов: " + remainingTotal;
  }
}

function getCardMatches(card, query) {
  const text = `${card.dataset.country} ${card.dataset.city} ${card.dataset.date}`.toLowerCase();
  const matchesSearch = !query || text.includes(query);
  const shouldHidePast = hidePastTours && isPastCard(card);
  return matchesSearch && !shouldHidePast;
}

function showCard(card, order) {
  card.dataset.visible = "true";
  card.hidden = false;
  card.style.setProperty("--search-order", String(Math.min(order, 22)));

  requestAnimationFrame(() => {
    card.classList.remove("search-hidden");
    card.classList.add("search-visible");
  });
}

function hideCard(card) {
  card.dataset.visible = "false";
  card.classList.add("search-hidden");
  card.classList.remove("search-visible");

  window.setTimeout(() => {
    if (card.dataset.visible === "false") {
      card.hidden = true;
    }
  }, HIDE_ANIMATION_MS);
}

function applyFilterSmooth() {
  const query = (tourSearch?.value || "").trim().toLowerCase();
  let visible = 0;

  tourList?.classList.add("is-filtering");

  tourCards.forEach((card) => {
    const show = getCardMatches(card, query);

    if (show) {
      showCard(card, visible);
      visible += 1;
    } else {
      hideCard(card);
    }
  });

  if (tourCounter) {
    tourCounter.textContent = visible + " концертов найдено";
  }

  window.setTimeout(() => {
    tourList?.classList.remove("is-filtering");
  }, HIDE_ANIMATION_MS);
}

function scheduleFilter() {
  window.clearTimeout(searchTimer);
  tourList?.classList.add("is-typing");

  searchTimer = window.setTimeout(() => {
    tourList?.classList.remove("is-typing");
    applyFilterSmooth();
  }, SEARCH_DELAY);
}

tourSearch?.addEventListener("input", scheduleFilter);

togglePastButton?.addEventListener("click", () => {
  hidePastTours = !hidePastTours;
  togglePastButton.textContent = hidePastTours ? "Показать прошедшие концерты" : "Скрыть прошедшие концерты";
  applyFilterSmooth();
});

updateNowLabel();
refreshTourStatuses();

// Мягкий первичный показ без резкого пересоздания списка.
tourCards.forEach((card, index) => {
  card.style.setProperty("--search-order", String(Math.min(index, 22)));
  card.dataset.visible = "true";
  card.classList.add("search-visible");
});

applyFilterSmooth();

setInterval(() => {
  updateNowLabel();
  refreshTourStatuses();
  applyFilterSmooth();
}, 60 * 1000);
