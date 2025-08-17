// =============================
// MAIN SITE SCRIPT
// =============================

// Run everything after DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  
  // =============================
  // Year in Footer
  // =============================
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // =============================
  // Mobile Menu Toggle
  // =============================
  const header = document.querySelector(".nav");
  const toggle = document.querySelector(".nav__toggle");
  const menuLinks = document.querySelectorAll(".nav__link");

  if (header && toggle) {
    toggle.addEventListener("click", () => {
      header.classList.toggle("nav--open");
    });

    // Close menu when clicking a link
    menuLinks.forEach(link => {
      link.addEventListener("click", () => header.classList.remove("nav--open"));
    });
  }

  // =============================
  // Sticky Header (on scroll)
  // =============================
  const onScrollHeader = () => {
    if (window.scrollY > 12) header?.classList.add("scrolled");
    else header?.classList.remove("scrolled");
  };
  onScrollHeader();
  window.addEventListener("scroll", onScrollHeader, { passive: true });

  // =============================
  // Smooth Scroll for Anchor Links
  // =============================
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener("click", e => {
      const id = a.getAttribute("href").slice(1);
      const el = document.getElementById(id);
      if (!el) return;
      e.preventDefault();
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  // =============================
  // Scroll Spy (Active Nav Link)
  // =============================
  const sections = ["home", "about", "products", "contact"]
    .map(id => document.getElementById(id))
    .filter(Boolean);

  const links = new Map(
    [...document.querySelectorAll(".nav__link")]
      .map(l => [l.getAttribute("href").slice(1), l])
  );

  const onScrollSpy = () => {
    let closest = { id: "home", top: Number.POSITIVE_INFINITY };
    sections.forEach(sec => {
      const rect = sec.getBoundingClientRect();
      const top = Math.abs(rect.top);
      if (top < closest.top) closest = { id: sec.id, top };
    });
    document.querySelectorAll(".nav__link").forEach(l => l.classList.remove("active"));
    links.get(closest.id)?.classList.add("active");
  };
  onScrollSpy();
  window.addEventListener("scroll", onScrollSpy, { passive: true });

  // =============================
  // Animated Counters
  // =============================
  const counters = document.querySelectorAll("[data-counter]");
  let countersStarted = false;

  const runCounters = () => {
    if (countersStarted || counters.length === 0) return;

    const anyVisible = [...counters].some(el => {
      const rect = el.getBoundingClientRect();
      return rect.top < window.innerHeight && rect.bottom > 0;
    });
    if (!anyVisible) return;

    countersStarted = true;

    counters.forEach(el => {
      const target = parseInt(el.getAttribute("data-counter"), 10) || 0;
      let curr = 0;
      const step = Math.max(1, Math.round(target / 40));

      const tick = () => {
        curr = Math.min(target, curr + step);
        el.textContent = curr;
        if (curr < target) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  };

  runCounters();
  window.addEventListener("scroll", runCounters, { passive: true });

  // =============================
  // Contact Form (Demo Handler)
  // =============================
  const form = document.getElementById("contactForm");
  const toast = document.getElementById("toast");

  if (form && toast) {
    form.addEventListener("submit", e => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(form).entries());

      toast.textContent = `Thanks ${data.name || "there"}! We will contact you soon.`;
      toast.classList.add("show");
      setTimeout(() => toast.classList.remove("show"), 3000);
      form.reset();
    });
  }

});
document.getElementById("contactForm").addEventListener("submit", async function(e) {
  e.preventDefault();
  const form = e.target;
  const data = new FormData(form);

  const response = await fetch(form.action, {
    method: form.method,
    body: data,
    headers: { 'Accept': 'application/json' }
  });

  if (response.ok) {
    form.reset();
    document.getElementById("successPopup").style.display = "flex"; // Show popup
  } else {
    alert("❌ Something went wrong. Please try again.");
  }
});

document.getElementById("closePopup").addEventListener("click", function() {
  document.getElementById("successPopup").style.display = "none"; // Close popup
});


