document.addEventListener('DOMContentLoaded', () => {

  /* ---------- LOADER ---------- */
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => loader.classList.add('hidden'), 400);
  });
  // Fallback in case 'load' already fired
  setTimeout(() => loader.classList.add('hidden'), 1500);

  /* ---------- YEAR ---------- */
  document.getElementById('year').textContent = new Date().getFullYear();

  /* ---------- THEME TOGGLE ---------- */
  const themeToggle = document.getElementById('themeToggle');
  const root = document.documentElement;
  const savedTheme = localStorageGet('theme') || 'dark';
  if (savedTheme === 'light') root.setAttribute('data-theme', 'light');

  themeToggle.addEventListener('click', () => {
    const isLight = root.getAttribute('data-theme') === 'light';
    if (isLight) {
      root.removeAttribute('data-theme');
      localStorageSet('theme', 'dark');
    } else {
      root.setAttribute('data-theme', 'light');
      localStorageSet('theme', 'light');
    }
  });

  // Safe localStorage wrapper (works in normal browsers; no-ops if blocked)
  function localStorageGet(key) {
    try { return window.localStorage.getItem(key); } catch (e) { return null; }
  }
  function localStorageSet(key, val) {
    try { window.localStorage.setItem(key, val); } catch (e) { /* ignore */ }
  }

  /* ---------- STICKY NAVBAR ---------- */
  const navbar = document.getElementById('navbar');
  const scrollProgress = document.getElementById('scrollProgress');
  const backToTop = document.getElementById('backToTop');

  /* ---------- ACTIVE NAV HIGHLIGHT (declared early; used by onScroll below) ---------- */
  const sections = document.querySelectorAll('main section[id], section#hero');
  const navItems = document.querySelectorAll('.nav-link');

  function updateActiveNav() {
    let current = sections[0] ? sections[0].id : '';
    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= 120) {
        current = section.id;
      }
    });
    navItems.forEach(item => {
      item.classList.toggle('active', item.dataset.section === current);
    });
  }

  function onScroll() {
    const scrollY = window.scrollY;
    navbar.classList.toggle('scrolled', scrollY > 40);
    backToTop.classList.toggle('visible', scrollY > 500);

    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
    scrollProgress.style.width = progress + '%';

    updateActiveNav();
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- BACK TO TOP ---------- */
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------- MOBILE NAV ---------- */
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('active', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------- TYPING ANIMATION ---------- */
  const typingTextEl = document.getElementById('typingText');
  const roles = [
    'Computer Science Engineering Student',
    'Full-Stack Developer',
    'Spring Boot & React Enthusiast',
    'Building real-world web applications'
  ];
  let roleIndex = 0, charIndex = 0, deleting = false;

  function typeLoop() {
    const current = roles[roleIndex];
    if (!deleting) {
      charIndex++;
      typingTextEl.textContent = current.slice(0, charIndex);
      if (charIndex === current.length) {
        deleting = true;
        setTimeout(typeLoop, 1800);
        return;
      }
    } else {
      charIndex--;
      typingTextEl.textContent = current.slice(0, charIndex);
      if (charIndex === 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
      }
    }
    setTimeout(typeLoop, deleting ? 35 : 65);
  }
  typeLoop();

  /* ---------- SCROLL REVEAL ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => revealObserver.observe(el));

  // Fallback: force reveal anything still hidden after 2.5s (covers edge cases
  // like very tall viewports or observer misfires)
  setTimeout(() => {
    revealEls.forEach(el => el.classList.add('in-view'));
  }, 2500);

  /* ---------- SKILL BARS ANIMATION ---------- */
  const skillFills = document.querySelectorAll('.skill-fill');
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill = entry.target;
        const level = fill.getAttribute('data-level');
        fill.style.width = level + '%';
        skillObserver.unobserve(fill);
      }
    });
  }, { threshold: 0.3 });
  skillFills.forEach(fill => skillObserver.observe(fill));

  /* ---------- SMOOTH SCROLL (anchor links) ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const offset = 70;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ---------- CONTACT FORM VALIDATION ---------- */
  const form = document.getElementById('contactForm');
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const messageInput = document.getElementById('message');
  const nameError = document.getElementById('nameError');
  const emailError = document.getElementById('emailError');
  const messageError = document.getElementById('messageError');
  const formSuccess = document.getElementById('formSuccess');

  function setError(input, errorEl, message) {
    errorEl.textContent = message;
    input.closest('.form-group').classList.toggle('error', !!message);
  }

  function validateName() {
    const value = nameInput.value.trim();
    if (!value) {
      setError(nameInput, nameError, 'Please enter your name.');
      return false;
    }
    setError(nameInput, nameError, '');
    return true;
  }

  function validateEmail() {
    const value = emailInput.value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value) {
      setError(emailInput, emailError, 'Please enter your email.');
      return false;
    }
    if (!emailPattern.test(value)) {
      setError(emailInput, emailError, 'Please enter a valid email address.');
      return false;
    }
    setError(emailInput, emailError, '');
    return true;
  }

  function validateMessage() {
    const value = messageInput.value.trim();
    if (!value) {
      setError(messageInput, messageError, 'Please enter a message.');
      return false;
    }
    if (value.length < 10) {
      setError(messageInput, messageError, 'Message should be at least 10 characters.');
      return false;
    }
    setError(messageInput, messageError, '');
    return true;
  }

  nameInput.addEventListener('blur', validateName);
  emailInput.addEventListener('blur', validateEmail);
  messageInput.addEventListener('blur', validateMessage);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const isNameValid = validateName();
    const isEmailValid = validateEmail();
    const isMessageValid = validateMessage();

    if (isNameValid && isEmailValid && isMessageValid) {
      formSuccess.textContent = "Thanks for reaching out! I'll get back to you soon.";
      form.reset();
      setTimeout(() => { formSuccess.textContent = ''; }, 5000);
    } else {
      formSuccess.textContent = '';
    }
  });

});
