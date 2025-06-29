// Универсальный скрипт для мобильной навигации и кнопки прокрутки
(function() {
    // Определение мобильного устройства
    function isMobileDevice() {
        return window.innerWidth <= 768 || 
               /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    // Если не мобильное устройство - выходим
    if (!isMobileDevice()) return;

    // Кэширование элементов
    let header = null;
    let scrollTopButton = null;
    let lastScrollTop = 0;
    let isHeaderHidden = false;

    // Константы
    const SCROLL_THRESHOLD = 50;
    const SCROLL_TOP_THRESHOLD = 300;
    const delta = 5; // Минимальное изменение для определения направления скролла

    // Создание кнопки прокрутки наверх
    function createScrollTopButton() {
        scrollTopButton = document.createElement('button');
        scrollTopButton.id = 'scroll-top-btn';
        scrollTopButton.setAttribute('aria-label', 'Прокрутка наверх');
        scrollTopButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#0d1117">
                <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"/>
            </svg>
        `;
        document.body.appendChild(scrollTopButton);

        // Обработчик клика
        scrollTopButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Оптимизация скролла с throttling
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }

    // Улучшенное определение скролла
    const handleScroll = throttle(() => {
        const st = window.pageYOffset || document.documentElement.scrollTop;
        
        // Показ/скрытие кнопки прокрутки наверх
        if (scrollTopButton) {
            if (st > SCROLL_TOP_THRESHOLD) {
                scrollTopButton.classList.add('show');
            } else {
                scrollTopButton.classList.remove('show');
            }
        }

        // Определение направления скролла с более точным порогом
        if (Math.abs(lastScrollTop - st) <= delta) return;
        
        if (st > lastScrollTop) {
            // Скролл вниз
            header?.classList.add('mobile-header-hidden');
            isHeaderHidden = true;
        } else {
            // Скролл вверх
            header?.classList.remove('mobile-header-hidden');
            isHeaderHidden = false;
        }
        
        lastScrollTop = st;
    }, 100); // Throttling на 100 мс для производительности

    // Инициализация
    function initMobileNavigation() {
        // Находим хедер
        header = document.querySelector('header');
        if (!header) return;

        // Добавляем классы для стилизации
        header.classList.add('mobile-navigation');

        // Создаем кнопку прокрутки
        createScrollTopButton();

        // Обработчики событий
        window.addEventListener('scroll', handleScroll, { passive: true });

        // Восстановление навигации при касании в верхней части экрана
        document.addEventListener('touchstart', () => {}, { passive: true });
    }

    // Инициализация при загрузке страницы
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMobileNavigation);
    } else {
        initMobileNavigation();
    }
})(); 