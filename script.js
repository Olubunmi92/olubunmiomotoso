document.addEventListener('DOMContentLoaded', () => {
  // Mobile Nav Toggle
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!isOpen));
      navLinks.style.display = isOpen ? '' : 'flex';
    });
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 968) {
          navLinks.style.display = '';
          navToggle.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }

  // Smooth Scroll
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const headerH = document.querySelector('.site-header')?.offsetHeight || 0;
        window.scrollTo({
          top: target.getBoundingClientRect().top + window.scrollY - headerH - 20,
          behavior: 'smooth'
        });
      }
    });
  });

  // Scroll Reveal
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
});