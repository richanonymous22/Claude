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

  // Floating-pill nav (Fincrest-style homepage) mobile toggle
  const fcToggle = document.querySelector(".fc-nav-toggle");
  const fcLinks = document.querySelector(".fc-nav-links");
  if (fcToggle && fcLinks) {
    fcToggle.addEventListener("click", () => {
      const open = fcLinks.classList.toggle("is-open");
      fcToggle.setAttribute("aria-expanded", String(open));
    });
    fcLinks.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => fcLinks.classList.remove("is-open"))
    );
  }

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

/* =========================================================
   MOTION LAYER (cursor, magnetic, tilt, scroll, kinetic)
   ========================================================= */
(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fineHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  // ---------- Custom cursor ----------
  if (fineHover && !reduceMotion) {
    const dot = document.createElement("div");
    const ring = document.createElement("div");
    dot.className = "cursor-dot";
    ring.className = "cursor-ring";
    document.body.appendChild(dot);
    document.body.appendChild(ring);

    let mx = window.innerWidth / 2, my = window.innerHeight / 2;
    let rx = mx, ry = my;
    document.addEventListener("pointermove", (e) => {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
    }, { passive: true });

    const tick = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);

    const hoverables = "a, button, .cursor-target, [data-tilt], input, select, textarea, label";
    document.addEventListener("pointerover", (e) => {
      if (e.target.closest(hoverables)) {
        ring.classList.add("is-hover");
        dot.classList.add("is-hover");
      }
    });
    document.addEventListener("pointerout", (e) => {
      if (e.target.closest(hoverables)) {
        ring.classList.remove("is-hover");
        dot.classList.remove("is-hover");
      }
    });
    document.addEventListener("pointerleave", () => {
      ring.style.opacity = dot.style.opacity = "0";
    });
    document.addEventListener("pointerenter", () => {
      ring.style.opacity = dot.style.opacity = "1";
    });
  }

  // ---------- Scroll progress bar ----------
  const progress = document.createElement("div");
  progress.className = "scroll-progress";
  document.body.appendChild(progress);
  const updateProgress = () => {
    const h = document.documentElement;
    const max = (h.scrollHeight - h.clientHeight) || 1;
    const pct = Math.max(0, Math.min(1, h.scrollTop / max));
    progress.style.width = (pct * 100).toFixed(2) + "%";
  };
  document.addEventListener("scroll", updateProgress, { passive: true });
  updateProgress();

  // ---------- Magnetic buttons ----------
  if (!reduceMotion) {
    document.querySelectorAll(".magnetic").forEach((el) => {
      const inner = el.querySelector(".magnetic-inner") || el;
      const strength = Number(el.dataset.magnetic) || 0.4;
      const r = () => el.getBoundingClientRect();
      el.addEventListener("pointermove", (e) => {
        const b = r();
        const x = e.clientX - (b.left + b.width / 2);
        const y = e.clientY - (b.top + b.height / 2);
        el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
        inner.style.transform = `translate(${x * strength * 0.4}px, ${y * strength * 0.4}px)`;
      });
      el.addEventListener("pointerleave", () => {
        el.style.transform = "";
        inner.style.transform = "";
      });
    });
  }

  // ---------- 3D tilt ----------
  if (!reduceMotion) {
    document.querySelectorAll("[data-tilt]").forEach((el) => {
      const max = Number(el.dataset.tilt) || 10;
      const r = () => el.getBoundingClientRect();
      el.addEventListener("pointermove", (e) => {
        const b = r();
        const px = (e.clientX - b.left) / b.width;
        const py = (e.clientY - b.top) / b.height;
        const rx = (py - 0.5) * -2 * max;
        const ry = (px - 0.5) * 2 * max;
        el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(0)`;
      });
      el.addEventListener("pointerleave", () => {
        el.style.transform = "perspective(900px) rotateX(0) rotateY(0)";
      });
    });
  }

  // ---------- Spotlight cards ----------
  document.querySelectorAll(".spotlight").forEach((el) => {
    el.addEventListener("pointermove", (e) => {
      const b = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${e.clientX - b.left}px`);
      el.style.setProperty("--my", `${e.clientY - b.top}px`);
    });
  });

  // ---------- Kinetic typography (split words) ----------
  document.querySelectorAll(".kinetic").forEach((el) => {
    if (el.dataset.split) return;
    el.dataset.split = "true";
    const text = el.dataset.text || el.textContent;
    el.innerHTML = "";
    const words = text.split(/(\s+)/).filter(Boolean);
    let delay = 0;
    words.forEach((w) => {
      if (/^\s+$/.test(w)) {
        el.appendChild(document.createTextNode(" "));
        return;
      }
      const wrap = document.createElement("span");
      wrap.className = "word";
      // Custom modifiers via {italic:word} or {script:word}
      let modClass = "";
      const mod = w.match(/^\{(\w+):(.+)\}$/);
      let display = w;
      if (mod) { modClass = mod[1]; display = mod[2]; wrap.classList.add(modClass); }
      const inner = document.createElement("span");
      inner.className = "inner";
      inner.style.setProperty("--d", `${delay}ms`);
      inner.textContent = display;
      wrap.appendChild(inner);
      el.appendChild(wrap);
      delay += 60;
    });
  });

  // ---------- Universal observer for "is-in" / "is-visible" ----------
  const motionTargets = document.querySelectorAll(
    ".kinetic, .reveal-up, .reveal-mask, .reveal-blur, .chart-anim, .fc-headline.under, .draw-path"
  );
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible", "is-in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );
    motionTargets.forEach((el) => io.observe(el));
  } else {
    motionTargets.forEach((el) => el.classList.add("is-visible", "is-in"));
  }

  // ---------- Hero parallax (pointer + scroll) ----------
  const parallaxEls = document.querySelectorAll("[data-parallax]");
  if (parallaxEls.length && !reduceMotion) {
    let lx = 0, ly = 0, mx = 0, my = 0;
    let scrollY = window.scrollY;
    document.addEventListener("pointermove", (e) => {
      mx = (e.clientX / window.innerWidth - .5) * 2;
      my = (e.clientY / window.innerHeight - .5) * 2;
    }, { passive: true });
    document.addEventListener("scroll", () => { scrollY = window.scrollY; }, { passive: true });
    const tick = () => {
      lx += (mx - lx) * 0.06;
      ly += (my - ly) * 0.06;
      parallaxEls.forEach((el) => {
        const depth = Number(el.dataset.parallax) || 1;
        const sScale = Number(el.dataset.parallaxScroll || "0");
        const x = lx * depth * 14;
        const y = ly * depth * 10 + scrollY * sScale;
        el.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`;
      });
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  // ---------- Sticky scroll showcase ----------
  document.querySelectorAll(".sticky-show").forEach((sec) => {
    const panels = sec.querySelectorAll(".panel");
    const inds = sec.querySelectorAll(".indicator");
    const setActive = (i) => {
      panels.forEach((p, j) => p.classList.toggle("is-active", i === j));
      inds.forEach((ind, j) => ind.classList.toggle("is-active", i === j));
    };
    setActive(0);
    inds.forEach((ind, i) => ind.addEventListener("click", () => setActive(i)));
    document.addEventListener("scroll", () => {
      const r = sec.getBoundingClientRect();
      const total = sec.offsetHeight - window.innerHeight;
      if (total <= 0) return;
      const p = Math.max(0, Math.min(1, -r.top / total));
      const i = Math.min(panels.length - 1, Math.floor(p * panels.length));
      setActive(i);
    }, { passive: true });
  });

  // ---------- Big stat counters ----------
  document.querySelectorAll(".bigstat[data-to]").forEach((el) => {
    const target = Number(el.dataset.to) || 0;
    const suffix = el.dataset.suffix || "";
    const prefix = el.dataset.prefix || "";
    const dur = 1800;
    const animate = () => {
      const start = performance.now();
      const tick = (now) => {
        const t = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        const v = Math.round(target * eased);
        el.textContent = `${prefix}${v.toLocaleString()}${suffix}`;
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver((entries, o) => {
        entries.forEach((e) => { if (e.isIntersecting) { animate(); o.unobserve(el); } });
      }, { threshold: 0.5 });
      io.observe(el);
    } else animate();
  });
})();
