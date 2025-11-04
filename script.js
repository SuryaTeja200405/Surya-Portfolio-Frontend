// NAVBAR TOGGLE
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.onclick = function () {
  navLinks.classList.toggle('open');
  navToggle.classList.toggle('open');

  document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
};

// CLOSE NAV ON LINK CLICK
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// CLOSE NAV ON OUTSIDE CLICK
document.addEventListener('click', (e) => {
  if (
    navLinks.classList.contains('open') &&
    !navLinks.contains(e.target) &&
    !navToggle.contains(e.target)
  ) {
    navLinks.classList.remove('open');
    navToggle.classList.remove('open');
    document.body.style.overflow = '';
  }
});

// SMOOTH SCROLLING
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// ANIMATION ON SCROLL
const animationObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('in-view');
      }, 100);
    }
  });
}, {
  threshold: 0.15,
  rootMargin: '0px 0px -100px 0px'
});

document.querySelectorAll('.animate-on-scroll, .animate-from-left, .animate-from-right, .animate-from-top, .animate-from-bottom')
  .forEach(card => animationObserver.observe(card));

// CAROUSEL
const carouselImgs = document.querySelectorAll('.carousel-img');
let carouselIndex = 0;

function showCarouselImg(idx) {
  carouselImgs.forEach((img, i) => {
    img.classList.toggle('active', i === idx);
  });
}
showCarouselImg(carouselIndex);

document.getElementById('carousel-prev').onclick = function () {
  carouselIndex = (carouselIndex - 1 + carouselImgs.length) % carouselImgs.length;
  showCarouselImg(carouselIndex);
};
document.getElementById('carousel-next').onclick = function () {
  carouselIndex = (carouselIndex + 1) % carouselImgs.length;
  showCarouselImg(carouselIndex);
};

// ✅ UPDATED CONTACT FORM SUBMIT
const form = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');

form.addEventListener('submit', async function (e) {
  e.preventDefault();

  const submitBtn = form.querySelector('button[type="submit"]');
  const originalBtnText = submitBtn.textContent;
  submitBtn.textContent = 'Sending...';
  submitBtn.disabled = true;
  formMessage.textContent = '';
  formMessage.className = 'form-message';

  const data = {
    name: form.elements['name'].value.trim(),
    email: form.elements['email'].value.trim(),
    subject: form.elements['subject'].value.trim(),
    message: form.elements['message'].value.trim()
  };

  try {
    const response = await fetch('https://surya-portfolio-backend.onrender.com/api/contact', {
      method: 'POST',
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

// CERTIFICATE IMAGE MODAL
document.querySelectorAll('.cert-img').forEach(img => {
  img.addEventListener('click', function (e) {
    e.stopPropagation();
    const src = this.getAttribute('src');
    document.getElementById('modal-cert-img').setAttribute('src', src);
    document.getElementById('cert-modal').classList.add('active');
  });
});

document.getElementById('close-modal').onclick = function () {
  document.getElementById('cert-modal').classList.remove('active');
};

document.getElementById('cert-modal').onclick = function (e) {
  if (e.target === this) {
    this.classList.remove('active');
  }
};
