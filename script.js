// script.js
document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.getElementById("theme-toggle");
  const body = document.body;
  const sections = document.querySelectorAll(".section");
  const typingText = document.getElementById("typing-text");
  const aboutText = document.getElementById("about-text");
  const header = document.getElementById("site-header");
  const hamburger = document.getElementById("hamburger");
  const mainNav = document.getElementById("main-nav");
  const navLinks = document.querySelectorAll("nav a");

  const heroTextToType = "PRIYANSHU\nKUMAR";
  const aboutTextToType =
    "Hi! I'm Priyanshu Kumar, a passionate software developer and B.Tech CS student at Jaipur National University (2023\u20132027), based in Jaipur, Rajasthan. I specialise in full-stack development using React, Python, Java, and C++, and I love building innovative web and mobile applications that solve real-world problems. From a wildlife rescue PWA (ResQ) to an AI-powered legal assistant (Kanoon Saathi) and Smart NGO Routing, I build things that matter. I'm also an IBM SkillsBuild AI-ML intern and active in tech events at my university.";
  let heroI = 0;
  let aboutI = 0;
  let aboutTypingStarted = false;

  // ─── LOAD SAVED THEME ───
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    body.classList.remove("light-mode");
    body.classList.add("dark-mode");
    themeToggle.checked = true;
  }

  // ─── TYPING EFFECT: HERO ───
  function typeHero() {
    if (heroI < heroTextToType.length) {
      const char = heroTextToType.charAt(heroI);
      if (char === "\n") {
        typingText.innerHTML += "<br>";
      } else {
        typingText.innerHTML += char;
      }
      heroI++;
      setTimeout(typeHero, 90);
    } else {
      typingText.style.animation = "none";
      typingText.style.borderRight = "none";
    }
  }
  typeHero();

  // ─── TYPING EFFECT: ABOUT (safe textContent) ───
  function typeAbout() {
    if (aboutI < aboutTextToType.length) {
      // Safe: append a text node instead of using innerHTML
      aboutText.appendChild(
        document.createTextNode(aboutTextToType.charAt(aboutI)),
      );
      aboutI++;
      setTimeout(typeAbout, 18);
    }
  }

  // ─── SMOOTH SCROLL (nav links) ───
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (href.startsWith("#")) {
        e.preventDefault();
        const targetEl = document.getElementById(href.substring(1));
        if (targetEl) {
          targetEl.scrollIntoView({ behavior: "smooth" });
          // Close mobile nav if open
          mainNav.classList.remove("open");
          hamburger.classList.remove("open");
        }
      }
    });
  });

  // ─── HAMBURGER MENU ───
  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("open");
    mainNav.classList.toggle("open");
  });

  // Close nav when clicking outside
  document.addEventListener("click", (e) => {
    if (
      mainNav.classList.contains("open") &&
      !mainNav.contains(e.target) &&
      !hamburger.contains(e.target)
    ) {
      mainNav.classList.remove("open");
      hamburger.classList.remove("open");
    }
  });

  // ─── HEADER: SCROLL GLASS EFFECT ───
  window.addEventListener(
    "scroll",
    () => {
      if (window.scrollY > 40) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
      updateActiveNavLink();
    },
    { passive: true },
  );

  // ─── ACTIVE NAV LINK ON SCROLL ───
  function updateActiveNavLink() {
    let currentSection = "";
    document.querySelectorAll("section").forEach((section) => {
      const sectionTop = section.offsetTop - 80;
      if (window.scrollY >= sectionTop) {
        currentSection = section.getAttribute("id");
      }
    });
    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${currentSection}`) {
        link.classList.add("active");
      }
    });
  }

  // ─── THEME TOGGLE ───
  themeToggle.addEventListener("change", () => {
    if (themeToggle.checked) {
      body.classList.remove("light-mode");
      body.classList.add("dark-mode");
      localStorage.setItem("theme", "dark");
    } else {
      body.classList.remove("dark-mode");
      body.classList.add("light-mode");
      localStorage.setItem("theme", "light");
    }
  });

  // ─── CONTACT FORM ───
  const form = document.getElementById("contact-form");
  const formStatus = document.getElementById("form-status");
  const WEB3FORMS_ACCESS_KEY = "d659fd72-cb2a-4fad-896a-2e450a3c3cae"; 
  
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("form-name").value.trim();
      const email = document.getElementById("form-email").value.trim();
      const message = document.getElementById("form-message").value.trim();

      if (!name || !email || !message) {
        formStatus.textContent = "⚠️ Please fill in all fields.";
        formStatus.className = "form-status error";
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        formStatus.textContent = "⚠️ Please enter a valid email address.";
        formStatus.className = "form-status error";
        return;
      }

      if (WEB3FORMS_ACCESS_KEY === "YOUR_ACCESS_KEY_HERE") {
        formStatus.textContent = "⚠️ Setup needed: Please add your Web3Forms access key in script.js";
        formStatus.className = "form-status error";
        return;
      }

      formStatus.textContent = "⏳ Sending message...";
      formStatus.className = "form-status success";

      fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          name: name,
          email: email,
          message: message,
          subject: `New Portfolio Message from ${name}`,
          from_name: "Portfolio Form"
        })
      })
      .then(async (response) => {
        const json = await response.json();
        if (response.status === 200) {
          formStatus.textContent = "✅ Message sent! I'll get back to you soon.";
          formStatus.className = "form-status success";
          form.reset();
        } else {
          formStatus.textContent = `❌ Error: ${json.message || "Failed to send."}`;
          formStatus.className = "form-status error";
        }
      })
      .catch((error) => {
        console.error(error);
        formStatus.textContent = "❌ Network error. Please try again later.";
        formStatus.className = "form-status error";
      })
      .finally(() => {
        setTimeout(() => {
          formStatus.className = "form-status";
          formStatus.textContent = "";
        }, 6000);
      });
    });
  }

  // ─── INTERSECTION OBSERVER: REVEAL SECTIONS ───
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          if (entry.target.id === "about" && !aboutTypingStarted) {
            aboutTypingStarted = true;
            typeAbout();
          }
        }
      });
    },
    { threshold: 0.1 },
  );
  
  sections.forEach((section) => observer.observe(section));

  // ─── BACK TO TOP ───
  const backToTopBtn = document.getElementById("back-to-top");
  if (backToTopBtn) {
    window.addEventListener(
      "scroll",
      () => {
        if (window.scrollY > 300) {
          backToTopBtn.classList.add("visible");
        } else {
          backToTopBtn.classList.remove("visible");
        }
      },
      { passive: true },
    );

    backToTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
})