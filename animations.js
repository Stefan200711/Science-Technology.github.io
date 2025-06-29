// Расширенные анимации для сайта
(function() {
  // Функция создания анимированных частиц
  function createAnimatedParticles() {
    const container = document.createElement('div');
    container.classList.add('particle-container');
    container.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 9999;
      overflow: hidden;
    `;
    document.body.appendChild(container);

    function createParticle() {
      const particle = document.createElement('div');
      particle.style.cssText = `
        position: absolute;
        width: 10px;
        height: 10px;
        background: radial-gradient(circle, rgba(0,255,255,0.8) 0%, rgba(0,255,255,0) 70%);
        border-radius: 50%;
        opacity: 0.7;
      `;

      const startX = Math.random() * window.innerWidth;
      const startY = Math.random() * window.innerHeight;
      particle.style.left = `${startX}px`;
      particle.style.top = `${startY}px`;

      container.appendChild(particle);

      const animationDuration = Math.random() * 5 + 3;
      particle.animate([
        { 
          transform: 'scale(0.5) rotate(0deg)',
          opacity: 0.7
        },
        { 
          transform: `scale(${Math.random() * 2 + 1}) rotate(${Math.random() * 360}deg)`,
          opacity: 0
        }
      ], {
        duration: animationDuration * 1000,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
        fill: 'forwards'
      });

      setTimeout(() => {
        container.removeChild(particle);
      }, animationDuration * 1000);
    }

    // Создаем частицы с интервалом
    const particleInterval = setInterval(createParticle, 500);

    // Останавливаем создание частиц через некоторое время
    setTimeout(() => {
      clearInterval(particleInterval);
    }, 10000);
  }

  // Анимация элементов при прокрутке
  function animateOnScroll() {
    const elements = document.querySelectorAll('.animate-on-scroll');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
        }
      });
    }, {
      threshold: 0.1
    });

    elements.forEach(el => {
      el.classList.add('scroll-animation');
      observer.observe(el);
    });
  }

  // Добавляем стили для анимаций при прокрутке
  function addScrollAnimationStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .scroll-animation {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.6s ease-out, transform 0.6s ease-out;
      }

      .scroll-animation.animated {
        opacity: 1;
        transform: translateY(0);
      }
    `;
    document.head.appendChild(style);
  }

  // Инициализация всех анимаций
  function initAnimations() {
    createAnimatedParticles();
    addScrollAnimationStyles();
    animateOnScroll();
  }

  // Запуск анимаций при загрузке страницы
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAnimations);
  } else {
    initAnimations();
  }
})(); 