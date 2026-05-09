(() => {
  const nav = document.getElementById("nav");
  const toggle = document.querySelector(".nav-toggle");
  const mobileMenu = document.getElementById("mobile-menu");
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // --- Sticky nav shadow on scroll ---
  const onScroll = () => {
    if (!nav) return;
    nav.classList.toggle("is-scrolled", window.scrollY > 8);
  };
  document.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // --- Mobile menu ---
  if (toggle && mobileMenu) {
    toggle.addEventListener("click", () => {
      const open = mobileMenu.classList.toggle("is-open");
      mobileMenu.hidden = !open;
      toggle.setAttribute("aria-expanded", String(open));
    });
    mobileMenu.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => {
        mobileMenu.classList.remove("is-open");
        mobileMenu.hidden = true;
        toggle.setAttribute("aria-expanded", "false");
      })
    );
  }

  // --- Reveal on scroll ---
  const revealTargets = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.08 }
    );
    revealTargets.forEach((el) => io.observe(el));
  } else {
    revealTargets.forEach((el) => el.classList.add("is-visible"));
  }

  // --- Number count-up ---
  const counters = document.querySelectorAll("[data-count]");
  const animateCount = (el) => {
    const target = Number(el.dataset.count) || 0;
    const duration = 1400;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.round(target * eased).toString();
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  if ("IntersectionObserver" in window) {
    const co = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            co.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.6 }
    );
    counters.forEach((el) => co.observe(el));
  } else {
    counters.forEach((el) => (el.textContent = el.dataset.count));
  }

  // --- Subtle parallax on hero orbs ---
  const orbs = document.querySelectorAll(".orb");
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  if (orbs.length && !reduceMotion) {
    let raf = 0;
    let lx = 0, ly = 0;
    const onMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        lx += (x - lx) * 0.08;
        ly += (y - ly) * 0.08;
        orbs.forEach((orb, i) => {
          const depth = (i + 1) * 12;
          orb.style.transform = `translate3d(${lx * depth}px, ${ly * depth}px, 0)`;
        });
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
  }

  // --- Contact form (demo) ---
  const form = document.querySelector(".cta-form");
  if (form) {
    const msg = form.querySelector(".form-msg");
    const input = form.querySelector("input[type='email']");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const value = (input.value || "").trim();
      const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      if (!ok) {
        if (msg) msg.textContent = "Please enter a valid email.";
        input.focus();
        return;
      }
      if (msg) msg.textContent = "Thanks — we'll be in touch within two business days.";
      form.reset();
    });
  }

  // Footer newsletter — simple no-op acknowledgement
  const footerForm = document.querySelector(".footer-form");
  if (footerForm) {
    footerForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = footerForm.querySelector("input");
      if (input) input.value = "";
      const btn = footerForm.querySelector("button");
      if (btn) {
        btn.textContent = "✓";
        setTimeout(() => (btn.textContent = "→"), 1600);
      }
    });
  }
})();
