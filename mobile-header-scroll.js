// Расширенное управление мобильной навигацией
(function() {
  // Улучшенное определение мобильного устройства
  function isMobileDevice() {
    return (
      window.innerWidth <= 768 || // Поддержка планшетов
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    );
  }

  // Функция для определения ориентации устройства
  function getDeviceOrientation() {
    return window.innerWidth > window.innerHeight ? 'landscape' : 'portrait';
  }

  // Создание и настройка кнопки прокрутки наверх
  function createScrollToTopButton() {
    const scrollButton = document.createElement('button');
    scrollButton.innerHTML = '&#9650;'; // Стрелка вверх
    scrollButton.classList.add('scroll-to-top-btn');
    
    // Стили для кнопки с расширенной анимацией
    scrollButton.style.cssText = `
      display: none;
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 1100;
      width: 50px;
      height: 50px;
      background: linear-gradient(135deg, #00b4db, #0083b0);
      color: white;
      border: none;
      border-radius: 50%;
      box-shadow: 0 4px 15px rgba(0,0,0,0.3);
      outline: none;
      cursor: pointer;
      font-size: 24px;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      transform: scale(0.7) rotate(-180deg);
      opacity: 0;
    `;

    // Добавление стилей для кнопки
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      @media (max-width: 768px) {
        .scroll-to-top-btn {
          display: block !important;
        }
        
        .scroll-to-top-btn:active {
          transform: scale(0.6) rotate(-90deg);
          box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        }

        @keyframes pulse-animation {
          0% { transform: scale(0.7) rotate(-180deg); }
          50% { transform: scale(1) rotate(0deg); }
          100% { transform: scale(0.7) rotate(-180deg); }
        }

        .scroll-to-top-btn.pulse {
          animation: pulse-animation 2s infinite;
        }

        @keyframes bounce-in {
          0% { 
            transform: scale(0.3) translateY(100%);
            opacity: 0;
          }
          50% { 
            transform: scale(1.1) translateY(-10%);
            opacity: 1;
          }
          100% { 
            transform: scale(1) translateY(0);
            opacity: 1;
          }
        }

        .scroll-to-top-btn.bounce-in {
          animation: bounce-in 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }
      }
    `;
    document.head.appendChild(styleElement);

    // Функция показа/скрытия кнопки
    function toggleScrollButton() {
      const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      
      if (scrollPosition > windowHeight * 0.5) {
        scrollButton.style.display = 'block';
        setTimeout(() => {
          scrollButton.style.transform = 'scale(1) rotate(0deg)';
          scrollButton.style.opacity = '1';
          scrollButton.classList.add('bounce-in');
          
          // Добавляем пульсацию после появления
          setTimeout(() => {
            scrollButton.classList.add('pulse');
          }, 600);
        }, 50);
      } else {
        scrollButton.classList.remove('pulse');
        scrollButton.style.transform = 'scale(0.7) rotate(-180deg)';
        scrollButton.style.opacity = '0';
        setTimeout(() => {
          scrollButton.style.display = 'none';
          scrollButton.classList.remove('bounce-in');
        }, 300);
      }
    }

    // Обработчик клика для прокрутки наверх
    scrollButton.addEventListener('click', () => {
      // Анимация нажатия
      scrollButton.style.transform = 'scale(0.8) rotate(-45deg)';
      scrollButton.style.background = 'linear-gradient(135deg, #0083b0, #00b4db)';
      
      setTimeout(() => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
        
        // Возврат к исходному состоянию
        scrollButton.style.transform = 'scale(1) rotate(0deg)';
        scrollButton.style.background = 'linear-gradient(135deg, #00b4db, #0083b0)';
      }, 200);
    });

    // Добавление кнопки на страницу
    document.body.appendChild(scrollButton);

    // Обработчик прокрутки
    window.addEventListener('scroll', toggleScrollButton);

    // Принудительный запуск при инициализации
    toggleScrollButton();

    return scrollButton;
  }

  // Инициализация мобильной навигации
  function initMobileNavigation() {
    const header = document.querySelector('header');
    if (!header) return;

    // Добавляем класс для мобильных устройств
    header.classList.add('mobile-navigation');

    let lastScrollTop = 0;
    let isHeaderHidden = false;
    const SCROLL_THRESHOLD = 10; // Уменьшаем порог чувствительности
    const HIDE_DELAY = 200; // Задержка перед скрытием

    // Улучшенная функция управления видимостью навигации
    function handleHeaderVisibility(e) {
      const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollDifference = currentScrollTop - lastScrollTop;

      // Добавляем плавность и отзывчивость
      if (Math.abs(scrollDifference) > SCROLL_THRESHOLD) {
        if (scrollDifference > 0 && !isHeaderHidden) {
          // Прокрутка вниз - скрываем хедер наверху с расширенной анимацией
          header.classList.add('mobile-header-hidden');
          header.classList.add('animated-slide');
          header.style.transform = 'translateY(-100%) rotate3d(1, 0, 0, 30deg)';
          header.style.opacity = '0';
          isHeaderHidden = true;
        } else if (scrollDifference < 0 && isHeaderHidden) {
          // Прокрутка вверх - показываем хедер с анимацией
          header.classList.remove('mobile-header-hidden');
          header.classList.remove('animated-slide');
          header.style.transform = 'translateY(0) rotate3d(1, 0, 0, 0deg)';
          header.style.opacity = '1';
          isHeaderHidden = false;
        }
      }

      lastScrollTop = currentScrollTop;
    }

    // Добавляем обработчики событий
    let scrollTimeout;
    window.addEventListener('scroll', (e) => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => handleHeaderVisibility(e), 50);
    });

    // Восстановление навигации при касании в верхней части экрана
    document.addEventListener('touchstart', (e) => {
      if (e.touches[0].clientY < 50) {
        header.classList.remove('mobile-header-hidden');
        header.classList.remove('animated-slide');
        header.style.transform = 'translateY(0) rotate3d(1, 0, 0, 0deg)';
        header.style.opacity = '1';
        isHeaderHidden = false;
      }
    });

    // Реакция на смену ориентации устройства
    window.addEventListener('orientationchange', () => {
      const orientation = getDeviceOrientation();
      header.setAttribute('data-orientation', orientation);
      
      // Сбрасываем состояние при смене ориентации
      header.classList.remove('mobile-header-hidden');
      header.classList.remove('animated-slide');
      header.style.transform = 'translateY(0) rotate3d(1, 0, 0, 0deg)';
      header.style.opacity = '1';
      isHeaderHidden = false;
    });
  }

  // Стили для мобильной навигации
  function addMobileStyles() {
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      @media (max-width: 768px) {
        header.mobile-navigation {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          z-index: 1000;
          background: linear-gradient(135deg, #00b4db, #0083b0);
          color: white;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 15px rgba(0,0,0,0.2);
          padding: 10px 0;
          transform-origin: top center;
          backface-visibility: hidden;
        }

        header.mobile-navigation.mobile-header-hidden {
          transform: translateY(-100%) rotate3d(1, 0, 0, 30deg);
          opacity: 0;
        }

        header.mobile-navigation.animated-slide {
          animation: slideDown 0.4s ease;
        }

        @keyframes slideDown {
          from { 
            transform: translateY(-100%) rotate3d(1, 0, 0, 30deg);
            opacity: 0;
          }
          to { 
            transform: translateY(0) rotate3d(1, 0, 0, 0deg);
            opacity: 1;
          }
        }

        body {
          padding-top: 70px; /* Высота навигационной панели */
        }

        header.mobile-navigation nav ul {
          display: flex;
          justify-content: space-around;
          align-items: center;
          list-style: none;
          padding: 0;
          margin: 0;
        }

        header.mobile-navigation nav ul li a {
          color: white;
          text-decoration: none;
          padding: 8px 15px;
          border-radius: 20px;
          transition: all 0.3s ease;
        }

        header.mobile-navigation nav ul li a:active {
          background-color: rgba(255,255,255,0.3);
          transform: scale(0.95);
        }

        header.mobile-navigation nav ul li a.active {
          background-color: rgba(255,255,255,0.2);
        }

        header.mobile-navigation[data-orientation="landscape"] {
          height: 50px;
        }
      }
    `;
    document.head.appendChild(styleElement);
  }

  // Инициализация при загрузке страницы
  function init() {
    // Принудительная проверка мобильного устройства
    const isMobile = isMobileDevice();
    
    if (isMobile) {
      addMobileStyles();
      initMobileNavigation();
      createScrollToTopButton();
    }
  }

  // Запуск инициализации
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();