// ============================================
//  ВИКТОР КРАФТ — FullPage Scroll
// ============================================

// ---- Year in footer ----
document.getElementById('year').textContent = new Date().getFullYear();

// ============================================
//  FULLPAGE SCROLL SYSTEM (Desktop Only)
// ============================================
(function() {
  'use strict';

  function isMobile() {
    return window.innerWidth <= 768;
  }

  const sections = document.querySelectorAll('section[id]');
  const totalSections = sections.length;
  let currentSection = 0;
  let isAnimating = false;
  let touchStartY = 0;
  let touchEndY = 0;
  
  const TRANSITION_DURATION = 800;

  // Don't initialize FullPage on mobile
  if (isMobile()) {
    console.log('[FullPage] Mobile detected - using native scroll');
    sections.forEach((section) => {
      section.classList.remove('fullpage-section', 'active', 'previous');
    });
    return;
  }

  console.log('[FullPage] Desktop detected - initializing FullPage');
  console.log('[FullPage] Found sections:', totalSections);

  // Initialize sections
  function initSections() {
    sections.forEach((section, index) => {
      section.classList.add('fullpage-section');
      if (index === 0) {
        section.classList.add('active');
      }
    });

    createNavigationDots();
    
    // Trigger initial animations for hero section
    setTimeout(() => {
      const heroSection = document.getElementById('hero');
      if (heroSection) {
        const animatedElements = heroSection.querySelectorAll('.fade-up, .fade-left, .fade-right');
        animatedElements.forEach((el, i) => {
          setTimeout(() => el.classList.add('visible'), i * 100);
        });
      }
    }, 100);
  }

  // Create navigation dots
  function createNavigationDots() {
    const nav = document.createElement('nav');
    nav.className = 'fullpage-nav';
    
    sections.forEach((_, index) => {
      const dot = document.createElement('button');
      dot.className = 'fullpage-dot' + (index === 0 ? ' active' : '');
      dot.setAttribute('aria-label', 'Перейти к секции ' + (index + 1));
      dot.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        goToSection(index);
      });
      nav.appendChild(dot);
    });

    document.body.appendChild(nav);
    console.log('[FullPage] Navigation dots created');
  }

  // Update navigation dots
  function updateNavigationDots() {
    const dots = document.querySelectorAll('.fullpage-dot');
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === currentSection);
    });
  }

  // Go to specific section
  function goToSection(index) {
    if (isAnimating || index === currentSection || index < 0 || index >= totalSections) {
      return false;
    }

    isAnimating = true;

    const prevSection = sections[currentSection];
    const nextSection = sections[index];
    const direction = index > currentSection ? 'down' : 'up';

    // Reset all sections
    sections.forEach(s => {
      s.classList.remove('active', 'previous');
    });

    // Set previous section class
    if (direction === 'down') {
      prevSection.classList.add('previous');
    }

    // Activate next section
    nextSection.classList.add('active');

    // Trigger animations
    triggerSectionAnimations(nextSection);

    currentSection = index;
    updateNavigationDots();

    // Update URL hash
    try {
      history.pushState(null, null, '#' + nextSection.id);
    } catch (e) {}

    setTimeout(() => {
      isAnimating = false;
    }, TRANSITION_DURATION);

    return true;
  }

  // Trigger animations for section elements
  function triggerSectionAnimations(section) {
    const animatedElements = section.querySelectorAll('.fade-up, .fade-left, .fade-right');
    
    animatedElements.forEach(el => {
      el.classList.remove('visible');
    });

    setTimeout(() => {
      animatedElements.forEach((el, index) => {
        setTimeout(() => {
          el.classList.add('visible');
        }, index * 80);
      });
    }, 100);
  }

  // Scroll handler
  function handleScroll(event) {
    if (isAnimating) return;

    event.preventDefault();
    event.stopPropagation();

    const delta = event.deltaY || event.wheelDelta || 0;
    const direction = Math.sign(delta);

    if (direction > 0 && currentSection < totalSections - 1) {
      goToSection(currentSection + 1);
    } else if (direction < 0 && currentSection > 0) {
      goToSection(currentSection - 1);
    }
  }

  // Touch handlers
  function handleTouchStart(event) {
    touchStartY = event.touches[0].clientY;
  }

  function handleTouchMove(event) {
    if (isAnimating) return;
    touchEndY = event.touches[0].clientY;
  }

  function handleTouchEnd() {
    if (isAnimating) return;

    const diff = touchStartY - touchEndY;
    const threshold = 50;

    if (Math.abs(diff) < threshold) return;

    if (diff > 0 && currentSection < totalSections - 1) {
      goToSection(currentSection + 1);
    } else if (diff < 0 && currentSection > 0) {
      goToSection(currentSection - 1);
    }

    touchStartY = 0;
    touchEndY = 0;
  }

  // Keyboard navigation
  function handleKeydown(event) {
    if (isAnimating) return;

    switch(event.key) {
      case 'ArrowDown':
      case 'PageDown':
        event.preventDefault();
        if (currentSection < totalSections - 1) {
          goToSection(currentSection + 1);
        }
        break;
      case 'ArrowUp':
      case 'PageUp':
        event.preventDefault();
        if (currentSection > 0) {
          goToSection(currentSection - 1);
        }
        break;
      case 'Home':
        event.preventDefault();
        goToSection(0);
        break;
      case 'End':
        event.preventDefault();
        goToSection(totalSections - 1);
        break;
    }
  }

  // Initialize
  function init() {
    initSections();

    window.addEventListener('wheel', handleScroll, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('keydown', handleKeydown);

    console.log('[FullPage] Initialization complete');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.fullpageGoToSection = goToSection;

})();

// ---- Scroll helpers ----
function scrollToContact() {
  const sections = document.querySelectorAll('section[id]');
  const contactSection = document.getElementById('contact');
  const index = Array.from(sections).indexOf(contactSection);
  if (index !== -1 && window.fullpageGoToSection) {
    window.fullpageGoToSection(index);
  }
}

function scrollToAbout() {
  const sections = document.querySelectorAll('section[id]');
  const aboutSection = document.getElementById('about');
  const index = Array.from(sections).indexOf(aboutSection);
  if (index !== -1 && window.fullpageGoToSection) {
    window.fullpageGoToSection(index);
  }
}

// Go to section by ID (for footer navigation)
function goToSectionById(sectionId) {
  const sections = document.querySelectorAll('section[id]');
  const targetSection = document.getElementById(sectionId);
  const index = Array.from(sections).indexOf(targetSection);
  if (index !== -1 && window.fullpageGoToSection) {
    window.fullpageGoToSection(index);
  }
}

// Make function available globally
window.goToSectionById = goToSectionById;

// ---- Contact form ----
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwCV9lGCRL4R_-bUsMZzpkpnRYAZjQ2-5QcGH8O5PyUkhjddHHVnLB29rPlpqPVrnpy6w/exec";
const form = document.getElementById('contactForm');
const slotSelect = document.getElementById('slotSelect');
const submitBtn = document.getElementById('submitBtn');
const toast = document.getElementById('toast');

async function loadSlots() {
  try {
    const response = await fetch(SCRIPT_URL);
    const result = await response.json();
    if (result.success) {
      slotSelect.innerHTML = '<option value="">Выберите дату и время</option>';
      if (result.slots.length === 0) {
        slotSelect.innerHTML = '<option value="">Нет свободных мест</option>';
      } else {
        result.slots.forEach(slot => {
          const option = document.createElement('option');
          option.value = JSON.stringify(slot);
          option.textContent = `${slot.date} — ${slot.time}`;
          slotSelect.appendChild(option);
        });
      }
    } else {
      throw new Error(result.error);
    }
  } catch (error) {
    console.error("Ошибка загрузки:", error);
    slotSelect.innerHTML = '<option value="">Ошибка загрузки расписания</option>';
  }
}

loadSlots();

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!slotSelect.value) {
    alert("Пожалуйста, выберите удобное время.");
    return;
  }
  submitBtn.disabled = true;
  submitBtn.textContent = '⏳ Оформляем запись...';
  const selectedSlot = JSON.parse(slotSelect.value);
  const payload = {
    row: selectedSlot.row,
    date: selectedSlot.date,
    time: selectedSlot.time,
    name: document.getElementById('userName').value,
    contact: document.getElementById('userContact').value,
    message: document.getElementById('userMessage').value
  };
  try {
    await fetch(SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      cache: 'no-cache',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 4000);
    form.reset();
    loadSlots();
  } catch (error) {
    console.error("Ошибка при отправке:", error);
    alert("Произошла ошибка.");
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = '✉ Записаться на первичную консультацию';
  }
});

// ---- Scroll animations on intersection ----
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, observerOptions);

document.querySelectorAll('.fade-up, .fade-left, .fade-right').forEach(el => {
  observer.observe(el);
});

// ---- Anchor links with FullPage ----
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (e) => {
    const targetId = link.getAttribute('href');
    if (targetId.length > 1) {
      e.preventDefault();
      const target = document.querySelector(targetId);
      if (target) {
        const sections = document.querySelectorAll('section[id]');
        const index = Array.from(sections).indexOf(target);
        if (index !== -1 && window.fullpageGoToSection) {
          window.fullpageGoToSection(index);
        } else if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    }
  });
});

// ============================================
//  COUNTDOWN TIMER
// ============================================
(function() {
  // ===== НАСТРОЙКИ ДАТЫ =====
  // Установи дату окончания здесь (формат: YYYY-MM-DDTHH:MM:SS)
  const endDateString = "2026-07-31T12:00:00";
  // ==========================
  
  const countdownElement = document.getElementById('countdownTimer');
  if (!countdownElement) return;
  
  const endDate = new Date(endDateString).getTime();
  
  const daysEl = document.getElementById('days');
  const hoursEl = document.getElementById('hours');
  const minutesEl = document.getElementById('minutes');
  const secondsEl = document.getElementById('seconds');
  
  function updateCountdown() {
    const now = new Date().getTime();
    const distance = endDate - now;
    
    if (distance < 0) {
      // Таймер истёк
      if (daysEl) daysEl.textContent = "00";
      if (hoursEl) hoursEl.textContent = "00";
      if (minutesEl) minutesEl.textContent = "00";
      if (secondsEl) secondsEl.textContent = "00";
      return;
    }
    
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
    if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
    if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
    if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
    if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
  }
  
  // Обновляем каждую секунду
  updateCountdown();
  setInterval(updateCountdown, 1000);
  
  console.log('[Countdown] Timer initialized for:', endDateString);
})();
