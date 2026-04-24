// ─── NAVBAR SCROLL EFFECT ─────────────────────────────────
const navbar = document.getElementById("navbar");
window.addEventListener("scroll", () => {
  navbar.classList.toggle("scrolled", window.scrollY > 20);
});

// ─── MOBILE MENU ──────────────────────────────────────────
const hamburger = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobileMenu");

hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("open");
  mobileMenu.classList.toggle("open");
});

document.querySelectorAll(".mobile-link").forEach((link) => {
  link.addEventListener("click", () => {
    hamburger.classList.remove("open");
    mobileMenu.classList.remove("open");
  });
});

// ─── SCROLL REVEAL ────────────────────────────────────────
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("visible");
        revealObserver.unobserve(e.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

// ─── PRODUCT FILTER ───────────────────────────────────────
const filterBtns   = document.querySelectorAll(".filter-btn");
const productCards = document.querySelectorAll(".product-card");

filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    const filter = btn.dataset.filter;
    productCards.forEach((card) => {
      const show = filter === "all" || card.dataset.category === filter;
      card.style.display = show ? "" : "none";
    });
  });
});

// ─── TOAST NOTIFICATION ───────────────────────────────────
function showToast(msg, type = "") {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.className = "toast" + (type ? " " + type : "");
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 4000);
}

// ─── CONTACT FORM VALIDATION & WHATSAPP REDIRECT ──────────
const form = document.getElementById("contactForm");

// Note: It's best practice to omit the '+' for wa.me links
const whatsappNumber = "201044412201"; 

form.addEventListener("submit", (e) => {
  e.preventDefault();
  let valid = true;

  const fields = [
    { id: "fname",   errId: "fname-error",   check: (v) => v.trim().length > 0 },
    { id: "lname",   errId: "lname-error",   check: (v) => v.trim().length > 0 },
    { id: "email",   errId: "email-error",   check: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) },
    { id: "message", errId: "message-error", check: (v) => v.trim().length > 10 },
  ];

  fields.forEach(({ id, errId, check }) => {
    const input = document.getElementById(id);
    const err   = document.getElementById(errId);
    if (!check(input.value)) {
      input.classList.add("error");
      err.classList.add("show");
      valid = false;
    } else {
      input.classList.remove("error");
      err.classList.remove("show");
    }
  });

  if (valid) {
    const btn = form.querySelector(".form-submit");
    btn.textContent = "Redirecting to WhatsApp...";
    btn.disabled = true;

    // 1. Gather the form data
    const fname = document.getElementById("fname").value.trim();
    const lname = document.getElementById("lname").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    // 2. Format the message for WhatsApp (using %0A for line breaks)
    const whatsappMsg = `*New Contact Form Submission*%0A%0A*Name:* ${fname} ${lname}%0A*Email:* ${email}%0A*Message:* ${message}`;

    // 3. Construct the WhatsApp URL
    const waUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMsg}`;

    // 4. Open WhatsApp in a new tab
    window.open(waUrl, "_blank");

    // 5. Reset UI states
    setTimeout(() => {
      btn.innerHTML = "Redirected ✓";
      showToast("✅ Redirecting to WhatsApp!", "toast-success");
      form.reset();

      setTimeout(() => {
        btn.innerHTML = `Send Message
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
               stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
          </svg>`;
        btn.disabled = false;
      }, 3000);
    }, 1000);
  }
});

// Clear error styles on user input
["fname", "lname", "email", "message"].forEach((id) => {
  const el = document.getElementById(id);
  if (el) {
    el.addEventListener("input", () => {
      el.classList.remove("error");
      const err = document.getElementById(id + "-error");
      if (err) err.classList.remove("show");
    });
  }
});

// ─── ANIMATED NUMBER COUNTER ──────────────────────────────
function animateCount(el, target, suffix = "") {
  let start = 0;
  const duration = 1800;
  const step = target / (duration / 16);

  const timer = setInterval(() => {
    start = Math.min(start + step, target);
    el.textContent = Math.round(start) + suffix;
    if (start >= target) clearInterval(timer);
  }, 16);
}

// Animate "Why Us" metrics when section scrolls into view
const metricsObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        const metrics = e.target.querySelectorAll(".why-metric-val");
        metrics.forEach((m) => {
          const text   = m.textContent;
          const num    = parseInt(text);
          if (!isNaN(num)) {
            const suffix = text.replace(/[0-9]/g, "");
            animateCount(m, num, suffix);
          }
        });
        metricsObserver.unobserve(e.target);
      }
    });
  },
  { threshold: 0.3 }
);

const whySection = document.getElementById("why");
if (whySection) metricsObserver.observe(whySection);

// ─── MOUSE GLOW EFFECT ────────────────────────────────────
const glow = document.querySelector(".mouse-glow");

let mouseX = 0;
let mouseY = 0;

let currentX = 0;
let currentY = 0;

// تتبع الماوس
document.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

// smooth animation (magic هنا 🔥)
function animate() {
  currentX += (mouseX - currentX) * 0.08;
  currentY += (mouseY - currentY) * 0.08;

  if(glow) {
      glow.style.left = currentX + "px";
      glow.style.top = currentY + "px";
  }

  requestAnimationFrame(animate);
}

animate();