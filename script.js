document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;

  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  if (navToggle && navLinks) {
    navToggle.onclick = function () {
      navLinks.classList.toggle('open');
      navToggle.classList.toggle('open');
      body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    };

    document.querySelectorAll('.nav-links a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navToggle.classList.remove('open');
        body.style.overflow = '';
      });
    });

    document.addEventListener('click', (e) => {
      if (navLinks.classList.contains('open') &&
        !navLinks.contains(e.target) &&
        !navToggle.contains(e.target)) {
        navLinks.classList.remove('open');
        navToggle.classList.remove('open');
        body.style.overflow = '';
      }
    });
  }

  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  anchorLinks.forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetSelector = this.getAttribute('href');
      if (!targetSelector || targetSelector === '#') return;

      const target = document.querySelector(targetSelector);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  if ('IntersectionObserver' in window) {
    const animationObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('in-view'), 100);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -100px 0px'
    });

    document.querySelectorAll('.animate-on-scroll, .animate-from-left, .animate-from-right, .animate-from-top, .animate-from-bottom')
      .forEach(card => animationObserver.observe(card));
  }

  const carouselImgs = document.querySelectorAll('.carousel-img');
  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');
  if (carouselImgs.length && prevBtn && nextBtn) {
    let carouselIndex = 0;
    const showCarouselImg = (idx) => {
      carouselImgs.forEach((img, i) => img.classList.toggle('active', i === idx));
    };

    showCarouselImg(carouselIndex);

    prevBtn.onclick = function () {
      carouselIndex = (carouselIndex - 1 + carouselImgs.length) % carouselImgs.length;
      showCarouselImg(carouselIndex);
    };
    nextBtn.onclick = function () {
      carouselIndex = (carouselIndex + 1) % carouselImgs.length;
      showCarouselImg(carouselIndex);
    };
  }

  const form = document.getElementById('contactForm');
  const formMessage = document.getElementById('formMessage');

  if (form && formMessage) {
    form.addEventListener('submit', async function (e) {
      e.preventDefault();

      const submitBtn = form.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.textContent;
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;
      formMessage.textContent = '';
      formMessage.className = 'form-message';

      const data = {
        name: form.elements['name'].value,
        email: form.elements['email'].value,
        subject: form.elements['subject'].value,
        message: form.elements['message'].value
      };

      try {
        const response = await fetch("https://surya-portfolio-backend.onrender.com/api/contact", {
          method: form.method,
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok && result.success) {
          formMessage.textContent = result.message || "Message sent successfully!";
          formMessage.className = 'form-message success';
          form.reset();
        } else {
          formMessage.textContent = result.message || "Oops! Something went wrong.";
          formMessage.className = 'form-message error';
        }
      } catch (error) {
        console.error('Form submission error:', error);
        formMessage.textContent = "Network error. Please check your connection and try again.";
        formMessage.className = 'form-message error';
      } finally {
        submitBtn.textContent = originalBtnText;
        submitBtn.disabled = false;
      }
    });
  }

  const certImages = document.querySelectorAll('.cert-img');
  const certModal = document.getElementById('cert-modal');
  const modalImg = document.getElementById('modal-cert-img');
  const closeModalBtn = document.getElementById('close-modal');

  if (certImages.length && certModal && modalImg) {
    const openModal = (src) => {
      modalImg.setAttribute('src', src);
      certModal.classList.add('active');
      body.style.overflow = 'hidden';
    };

    const closeModal = () => {
      certModal.classList.remove('active');
      body.style.overflow = '';
    };

    certImages.forEach(img => {
      img.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const src = img.getAttribute('src');
        if (src) {
          openModal(src);
        }
      });
    });

    if (closeModalBtn) {
      closeModalBtn.addEventListener('click', closeModal);
    }

    certModal.addEventListener('click', (e) => {
      if (e.target === certModal) {
        closeModal();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && certModal.classList.contains('active')) {
        closeModal();
      }
    });
  }
});
