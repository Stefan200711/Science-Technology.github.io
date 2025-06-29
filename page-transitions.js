// Плавные переходы между страницами
(function() {
  // Функция для создания оверлея перехода
  function createTransitionOverlay() {
    const overlay = document.createElement('div');
    overlay.id = 'page-transition-overlay';
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, #00b4db, #0083b0);
      z-index: 9999;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.5s ease-in-out;
      display: flex;
      justify-content: center;
      align-items: center;
    `;

    // Добавляем анимированный логотип или индикатор загрузки
    const loader = document.createElement('div');
    loader.style.cssText = `
      width: 100px;
      height: 100px;
      border: 4px solid rgba(255,255,255,0.3);
      border-top: 4px solid white;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    `;

    const style = document.createElement('style');
    style.textContent = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;

    overlay.appendChild(loader);
    document.body.appendChild(overlay);
    document.head.appendChild(style);

    return overlay;
  }

  // Функция для инициализации плавных переходов
  function initPageTransitions() {
    const overlay = createTransitionOverlay();
    const links = document.querySelectorAll('a[href]:not([href^="#"])');

    links.forEach(link => {
      link.addEventListener('click', (e) => {
        // Проверяем, что это внутренняя ссылка
        if (new URL(link.href).origin === window.location.origin) {
          e.preventDefault();
          const targetUrl = link.href;

          // Показываем оверлей
          overlay.style.opacity = '1';

          // Переход на новую страницу после анимации
          setTimeout(() => {
            window.location.href = targetUrl;
          }, 500);
        }
      });
    });

    // Обработка загрузки страницы
    window.addEventListener('load', () => {
      overlay.style.opacity = '0';
      setTimeout(() => {
        overlay.style.display = 'none';
      }, 500);
    });

    // Обработка перехода назад/вперед
    window.addEventListener('pageshow', (event) => {
      if (event.persisted) {
        overlay.style.opacity = '0';
        setTimeout(() => {
          overlay.style.display = 'none';
        }, 500);
      }
    });
  }

  // Инициализация при загрузке DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPageTransitions);
  } else {
    initPageTransitions();
  }
})(); 