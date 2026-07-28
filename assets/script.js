document.getElementById("year").textContent = new Date().getFullYear();

// tap-to-highlight for timeline bullet points on touch devices
document.querySelectorAll(".timeline-list").forEach((list) => {
  list.querySelectorAll("li").forEach((item) => {
    item.addEventListener("click", () => {
      const wasActive = item.classList.contains("is-active");
      list.querySelectorAll("li.is-active").forEach((el) => el.classList.remove("is-active"));
      if (!wasActive) item.classList.add("is-active");
    });
  });
});

// seamless marquee: clone the content enough times to cover any viewport width,
// then animate by exactly one item's width so the loop never shows a gap
const marqueeTrack = document.getElementById("marqueeTrack");

function setupMarquee() {
  if (!marqueeTrack) return;
  const viewport = marqueeTrack.parentElement;
  const original = marqueeTrack.children[0];

  while (marqueeTrack.children.length > 1) {
    marqueeTrack.removeChild(marqueeTrack.lastElementChild);
  }

  const itemWidth = original.getBoundingClientRect().width;
  const viewportWidth = viewport.getBoundingClientRect().width;
  const neededWidth = viewportWidth * 2 + itemWidth;

  let totalWidth = itemWidth;
  while (totalWidth < neededWidth) {
    marqueeTrack.appendChild(original.cloneNode(true));
    totalWidth += itemWidth;
  }

  const pixelsPerSecond = 70;
  marqueeTrack.style.setProperty("--marquee-distance", `-${itemWidth}px`);
  marqueeTrack.style.setProperty("--marquee-duration", `${itemWidth / pixelsPerSecond}s`);
}

setupMarquee();
let marqueeResizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(marqueeResizeTimer);
  marqueeResizeTimer = setTimeout(setupMarquee, 200);
});

// logo click forces a full page reload
const navLogo = document.getElementById("navLogo");
navLogo.addEventListener("click", (e) => {
  e.preventDefault();
  window.location.reload();
});

// nav scroll state + progress bar
const nav = document.getElementById("nav");
const progressBar = document.getElementById("progressBar");

function onScroll() {
  nav.classList.toggle("scrolled", window.scrollY > 10);
  const doc = document.documentElement;
  const scrollable = doc.scrollHeight - doc.clientHeight;
  const pct = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
  progressBar.style.width = pct + "%";
}
document.addEventListener("scroll", onScroll, { passive: true });
onScroll();

// mobile nav toggle
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");
navToggle.addEventListener("click", () => {
  navLinks.classList.toggle("open");
});
navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => navLinks.classList.remove("open"));
});

// reveal on scroll
const revealEls = document.querySelectorAll(".reveal");
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);
revealEls.forEach((el) => revealObserver.observe(el));

// animated stat counters
const statEls = document.querySelectorAll(".stat-value");
const statObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || "";
      const isDecimal = !Number.isInteger(target);
      const duration = 1400;
      const start = performance.now();

      function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = target * eased;
        el.textContent = (isDecimal ? value.toFixed(1) : Math.round(value)) + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      statObserver.unobserve(el);
    });
  },
  { threshold: 0.5 }
);
statEls.forEach((el) => statObserver.observe(el));

// typewriter tagline
const taglineEl = document.getElementById("typedTagline");
const taglinePhrases = [
  "Every dataset has a story. I help uncover it.",
  "I ask the right questions before building dashboards and reports.",
  "Complex problems deserve simple solutions.",
];

function typeLoop() {
  const phrase = taglinePhrases[typeLoop.phraseIndex % taglinePhrases.length];
  const typingSpeed = 55;
  const deletingSpeed = 30;
  const pauseAfterType = 1800;
  const pauseAfterDelete = 400;

  if (!typeLoop.deleting && typeLoop.charIndex <= phrase.length) {
    taglineEl.textContent = phrase.slice(0, typeLoop.charIndex);
    typeLoop.charIndex++;
    if (typeLoop.charIndex > phrase.length) {
      setTimeout(() => { typeLoop.deleting = true; typeLoop(); }, pauseAfterType);
      return;
    }
    setTimeout(typeLoop, typingSpeed);
  } else if (typeLoop.deleting && typeLoop.charIndex >= 0) {
    taglineEl.textContent = phrase.slice(0, typeLoop.charIndex);
    typeLoop.charIndex--;
    if (typeLoop.charIndex < 0) {
      typeLoop.deleting = false;
      typeLoop.charIndex = 0;
      typeLoop.phraseIndex++;
      setTimeout(typeLoop, pauseAfterDelete);
      return;
    }
    setTimeout(typeLoop, deletingSpeed);
  }
}
typeLoop.phraseIndex = 0;
typeLoop.charIndex = 0;
typeLoop.deleting = false;
if (taglineEl) typeLoop();
