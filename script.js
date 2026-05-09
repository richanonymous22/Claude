(() => {
  const header = document.querySelector(".header");
  const toggle = document.querySelector(".nav-toggle");
  const mobileMenu = document.getElementById("mobile-menu");
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Sticky header shadow on scroll
  const onScroll = () => {
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 8);
  };
  document.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Mobile menu
  if (toggle && mobileMenu) {
    toggle.addEventListener("click", () => {
      const open = mobileMenu.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    mobileMenu.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => {
        mobileMenu.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      })
    );
  }

  // Reveal on scroll
  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("is-visible"));
  }

  // Number count-up
  const counters = document.querySelectorAll("[data-count]");
  const animate = (el) => {
    const target = Number(el.dataset.count) || 0;
    const dur = 1400;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.round(target * eased).toLocaleString();
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  if ("IntersectionObserver" in window) {
    const co = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            animate(e.target);
            co.unobserve(e.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach((el) => co.observe(el));
  } else {
    counters.forEach((el) => (el.textContent = el.dataset.count));
  }

  // Mark current nav link
  const path = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a, .mobile-menu a").forEach((a) => {
    const href = a.getAttribute("href");
    if (!href) return;
    if (href === path || (path === "" && href === "index.html")) {
      a.classList.add("is-active");
    }
  });

  // ===========================================================
  // Homepage savings calculator (3-question quiz)
  // ===========================================================
  const homeCalc = document.getElementById("home-calc");
  if (homeCalc) {
    const result = homeCalc.querySelector(".calc-result");
    const savingsEl = result?.querySelector(".savings");
    const recoEl = result?.querySelector("[data-reco]");
    const tryUpdate = () => {
      const turnover = homeCalc.querySelector('input[name="turnover"]:checked')?.value;
      const provider = homeCalc.querySelector('input[name="provider"]:checked')?.value;
      const biz = homeCalc.querySelector('input[name="biz"]:checked')?.value;
      if (!turnover || !provider || !biz) return;

      // Simple heuristic: estimate monthly savings
      const map = { "1": 75, "2": 200, "3": 380, "4": 620 };
      let savings = map[turnover] || 200;
      if (provider === "high") savings *= 1.4;
      if (provider === "unknown") savings *= 1.2;
      savings = Math.round(savings / 5) * 5;

      const recos = {
        restaurant: "Teya Pax A920 Pro — instant payouts and split-tip support, ideal for hospitality.",
        retail: "Teya or Shift4 — fast checkout, reliable hardware, the rate that fits your volume.",
        salon: "SumUp Solo or Teya portable — light, mobile, contactless tips out of the box.",
        mobile: "SumUp 4G — pay-as-you-go, no monthly fees, works wherever signal reaches.",
        other: "Teya for £10K+ turnover, Shift4 if you’re smaller — we’ll confirm on the call."
      };

      if (savingsEl) savingsEl.textContent = `£${savings} / month`;
      if (recoEl) recoEl.textContent = recos[biz] || recos.other;
      result.classList.add("is-shown");
    };
    homeCalc.querySelectorAll('input[type="radio"]').forEach((i) =>
      i.addEventListener("change", tryUpdate)
    );
  }

  // ===========================================================
  // Card Machines page recommendation quiz
  // ===========================================================
  const cardCalc = document.getElementById("card-calc");
  if (cardCalc) {
    const result = cardCalc.querySelector(".calc-result");
    const headEl = result?.querySelector("h4");
    const bodyEl = result?.querySelector("p");
    const update = () => {
      const turnover = cardCalc.querySelector('input[name="cm-turnover"]:checked')?.value;
      const biz = cardCalc.querySelector('input[name="cm-biz"]:checked')?.value;
      const mob = cardCalc.querySelector('input[name="cm-mob"]:checked')?.value;
      if (!turnover || !biz || !mob) return;

      let pick = "Teya Pax A920 Pro";
      let reason = "Lowest blended rate on our panel for £10K+ turnover, instant payouts, no contract.";

      if (turnover === "1") {
        pick = "SumUp Solo";
        reason = "No monthly fees and a one-off £162 inc. VAT terminal — perfect at lower volumes.";
      } else if (turnover === "1" || turnover === "2") {
        pick = "Shift4";
        reason = "First terminal free, transparent flat rate, ideal under £10K/month.";
      } else if (turnover === "4") {
        pick = "Worldpay (interchange-style)";
        reason = "Debit rates from 0.30%, lowest on the market for high-volume merchants.";
      }
      if (mob === "mobile") {
        pick = pick.includes("Worldpay") ? pick : "Teya / SumUp 4G";
        reason = "4G + WiFi portable terminal that goes wherever your business goes.";
      }

      if (headEl) headEl.textContent = `Our pick for you: ${pick}`;
      if (bodyEl) bodyEl.textContent = reason;
      result.classList.add("is-shown");
    };
    cardCalc.querySelectorAll('input[type="radio"]').forEach((i) =>
      i.addEventListener("change", update)
    );
  }

  // ===========================================================
  // Generic forms (acknowledge submission)
  // ===========================================================
  document.querySelectorAll("form[data-form]").forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const msg = form.querySelector(".form-msg");
      const email = form.querySelector('input[type="email"]')?.value?.trim();
      if (email !== undefined) {
        const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        if (!ok) {
          if (msg) {
            msg.textContent = "Please enter a valid email address.";
            msg.classList.add("is-error");
          }
          return;
        }
      }
      const required = form.querySelectorAll("[required]");
      for (const f of required) {
        if (!f.value || !f.value.trim()) {
          if (msg) {
            msg.textContent = "Please fill in all required fields.";
            msg.classList.add("is-error");
          }
          f.focus();
          return;
        }
      }
      if (msg) {
        msg.textContent =
          "Thanks — we'll be in touch within the hour during working hours.";
        msg.classList.remove("is-error");
      }
      form.reset();
    });
  });
})();
