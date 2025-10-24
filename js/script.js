// Shared behavior: menu toggle, active nav, tilt effect for .tilt-card, smooth scroll, footer year.

document.addEventListener('DOMContentLoaded', () => {
  // set year in footer
  const y = new Date().getFullYear();
  if(document.getElementById('year')){
      document.getElementById('year').textContent = y;
  }

  // NAV active highlighting
  const navLinks = document.querySelectorAll('.main-nav .nav-link');
  const current = window.location.pathname.split('/').pop() || 'index.html';
  navLinks.forEach(a => {
    const href = a.getAttribute('href');
    if (href === current) a.classList.add('active');
    else a.classList.remove('active');
  });

  // mobile menu toggle
  const menuToggle = document.getElementById('menuToggle');
  const mainNav = document.getElementById('mainNav');
  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', () => {
      mainNav.classList.toggle('open');
      if (mainNav.classList.contains('open')) {
        mainNav.style.display = 'flex';
        mainNav.style.flexDirection = 'column';
        mainNav.style.background = 'rgba(0,0,0,0.45)';
        mainNav.style.padding = '12px';
        mainNav.style.position = 'absolute';
        mainNav.style.top = '66px';
        mainNav.style.right = '36px';
        mainNav.style.borderRadius = '10px';
      } else {
        mainNav.style.display = '';
        mainNav.style = '';
      }
    });

    // click outside to close
    document.addEventListener('click', (e) => {
      if (!mainNav.contains(e.target) && !menuToggle.contains(e.target)) {
        mainNav.classList.remove('open');
        mainNav.style.display = '';
        mainNav.style = '';
      }
    });
  }

  // Smooth scroll for hash
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      const t = document.querySelector(this.getAttribute('href'));
      if (t) t.scrollIntoView({ behavior: 'smooth' });
    });
  });

  // TILT EFFECT for testimonial and card elements
  const tiltCards = document.querySelectorAll('.tilt-card');
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', handleTilt);
    card.addEventListener('mouseleave', resetTilt);
    card.addEventListener('mouseenter', () => card.style.transition = 'transform 150ms ease');
  });

  function handleTilt(e) {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const dx = (x - cx) / cx;
    const dy = (y - cy) / cy;
    const tiltX = (dy) * 6;
    const tiltY = (dx) * -6;
    const scale = 1.02;
    card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(${scale})`;
  }

  function resetTilt(e) {
    const card = e.currentTarget;
    card.style.transform = '';
  }

  // keyboard escape to close mobile nav
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      if (mainNav && mainNav.classList.contains('open')) {
        mainNav.classList.remove('open');
        mainNav.style.display = '';
        mainNav.style = '';
      }
    }
  });

  // Star rating
  const stars = document.querySelectorAll('.star-rating .fa-star');
  const ratingInput = document.getElementById('rating');

  stars.forEach(star => {
    star.addEventListener('click', () => {
      const value = star.getAttribute('data-value');
      ratingInput.value = value;
      stars.forEach(s => {
        if (s.getAttribute('data-value') <= value) {
          s.classList.remove('far');
          s.classList.add('fas');
        } else {
          s.classList.remove('fas');
          s.classList.add('far');
        }
      });
    });
  });

  // Feedback form submission
  const feedbackForm = document.getElementById('feedbackForm');
  if (feedbackForm) {
    feedbackForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('name').value;
      const feedback = document.getElementById('feedback').value;
      const rating = document.getElementById('rating').value;

      const testimonial = {
        name,
        feedback,
        rating
      };

      let testimonials = JSON.parse(localStorage.getItem('testimonials')) || [];
      testimonials.push(testimonial);
      localStorage.setItem('testimonials', JSON.stringify(testimonials));

      window.location.href = 'index.html';
    });
  }

  // Display testimonials on index.html
  if (window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/')) {
    const testimonialsContainer = document.getElementById('testimonials-container');
    if (testimonialsContainer) {
        const testimonials = JSON.parse(localStorage.getItem('testimonials')) || [];
        if (testimonials.length > 0) {
            testimonialsContainer.innerHTML = '';
            testimonials.forEach(testimonial => {
                const testimonialCard = document.createElement('div');
                testimonialCard.classList.add('testimonial-card', 'tilt-card');

                let stars = '';
                for (let i = 0; i < 5; i++) {
                    if (i < testimonial.rating) {
                        stars += '<i class="fas fa-star"></i>';
                    } else {
                        stars += '<i class="far fa-star"></i>';
                    }
                }

                testimonialCard.innerHTML = `
                    <div class="testimonial-rating">${stars}</div>
                    <p class="testimonial-feedback">"${testimonial.feedback}"</p>
                    <p class="testimonial-author">- ${testimonial.name}</p>
                `;
                testimonialsContainer.appendChild(testimonialCard);
            });
        } else {
            testimonialsContainer.innerHTML = '<p>No testimonials yet. Be the first to leave a review!</p>';
        }
    } 
  }
});