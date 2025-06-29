// Расширенный скрипт для кнопки прокрутки на мобильных устройствах
(function() {
  // Улучшенное определение мобильного устройства
  function isMobileDevice() {
    return (
      window.innerWidth <= 768 || // Поддержка планшетов
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    );
  }

  // Создание кнопки прокрутки с расширенной функциональностью
  function createScrollTopButton() {
    const scrollTopContainer = document.createElement('div');
    scrollTopContainer.id = 'mobile-scroll-top-container';
    scrollTopContainer.setAttribute('aria-hidden', 'true');
    
    const scrollTopBtn = document.createElement('button');
    scrollTopBtn.id = 'mobile-scroll-top-btn';
    scrollTopBtn.setAttribute('aria-label', 'Прокрутка наверх');
    
    // Улучшенная SVG иконка с анимацией
    scrollTopBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white">
        <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"/>
      </svg>
    `;

    scrollTopContainer.appendChild(scrollTopBtn);
    document.body.appendChild(scrollTopContainer);

    return { scrollTopContainer, scrollTopBtn };
  }

  // Управление видимостью кнопки с расширенной логикой
  function setupScrollTopButtonVisibility(scrollTopContainer) {
    const SCROLL_SHOW_THRESHOLD = 300;
    const SCROLL_HIDE_THRESHOLD = 100;

    function toggleScrollTopButton() {
      const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
      
      if (scrollPosition > SCROLL_SHOW_THRESHOLD) {
        scrollTopContainer.classList.add('visible');
        scrollTopContainer.classList.add('animated-fade');
      } else if (scrollPosition < SCROLL_HIDE_THRESHOLD) {
        scrollTopContainer.classList.remove('visible');
        scrollTopContainer.classList.remove('animated-fade');
      }
    }

    let scrollTimeout;
    window.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(toggleScrollTopButton, 50);
    });
  }

  // Плавная прокрутка с поддержкой разных браузеров
  function setupScrollTopButtonClick(scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      // Анимация нажатия
      scrollTopBtn.classList.add('pressed');
      setTimeout(() => scrollTopBtn.classList.remove('pressed'), 200);

      // Плавная прокрутка
      if ('scrollBehavior' in document.documentElement.style) {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      } else {
        // Fallback для старых браузеров с анимацией
        const scrollStep = -window.scrollY / 15;
        const scrollInterval = setInterval(() => {
          if (window.scrollY > 0) {
            window.scrollBy(0, scrollStep);
          } else {
            clearInterval(scrollInterval);
          }
        }, 15);
      }
    });
  }

  // Добавление расширенных стилей
  function addScrollTopStyles() {
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      @media (max-width: 768px) {
        #mobile-scroll-top-container {
          position: fixed;
          bottom: 20px;
          right: 20px;
          z-index: 1000;
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s ease;
          transform: scale(0.7);
        }

        #mobile-scroll-top-container.visible {
          opacity: 1;
          visibility: visible;
          transform: scale(1);
        }

        #mobile-scroll-top-container.animated-fade {
          animation: fadeIn 0.4s ease;
        }

        #mobile-scroll-top-btn {
          width: 50px;
          height: 50px;
          background: linear-gradient(135deg, #00b4db, #0083b0);
          border: none;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          box-shadow: 0 6px 15px rgba(0,0,0,0.3);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        #mobile-scroll-top-btn.pressed {
          transform: scale(0.9);
          background: linear-gradient(135deg, #0083b0, #00b4db);
          box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        }

        #mobile-scroll-top-btn svg {
          width: 24px;
          height: 24px;
        }

        @keyframes fadeIn {
          from { 
            opacity: 0; 
            transform: translateY(20px) scale(0.7);
          }
          to { 
            opacity: 1; 
            transform: translateY(0) scale(1);
          }
        }
      }
    `;
    document.head.appendChild(styleElement);
  }

  // Инициализация при загрузке страницы
  function init() {
    if (!isMobileDevice()) return;

    addScrollTopStyles();
    const { scrollTopContainer, scrollTopBtn } = createScrollTopButton();
    setupScrollTopButtonVisibility(scrollTopContainer);
    setupScrollTopButtonClick(scrollTopBtn);
  }

  // Запуск инициализации
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();