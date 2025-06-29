document.addEventListener('DOMContentLoaded', () => {
    const backgroundCanvas = document.createElement('canvas');
    backgroundCanvas.id = 'space-background';
    backgroundCanvas.style.position = 'fixed';
    backgroundCanvas.style.top = '0';
    backgroundCanvas.style.left = '0';
    backgroundCanvas.style.width = '100%';
    backgroundCanvas.style.height = '100%';
    backgroundCanvas.style.zIndex = '-1';
    document.body.appendChild(backgroundCanvas);

    const ctx = backgroundCanvas.getContext('2d');
    backgroundCanvas.width = window.innerWidth;
    backgroundCanvas.height = window.innerHeight;

    // Звезды
    const stars = [];
    const starCount = 200;

    class Star {
        constructor() {
            this.reset();
        }

        reset() {
            // Случайное начальное положение
            this.x = Math.random() * backgroundCanvas.width;
            this.y = Math.random() * backgroundCanvas.height;
            
            // Случайные направления движения
            this.speedX = (Math.random() - 0.5) * 2; // От -1 до 1
            this.speedY = (Math.random() - 0.5) * 2; // От -1 до 1
            
            // Случайный размер и прозрачность
            this.radius = Math.random() * 1.5;
            this.opacity = Math.random();
            
            // Случайная скорость мерцания
            this.blinkSpeed = Math.random() * 0.02 + 0.01;
            this.blinkPhase = Math.random() * Math.PI * 2;
        }

        draw() {
            // Эффект мерцания
            const currentOpacity = this.opacity * (0.5 + Math.sin(this.blinkPhase) * 0.5);
            
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${currentOpacity})`;
            ctx.fill();
        }

        update() {
            // Движение звезды
            this.x += this.speedX;
            this.y += this.speedY;
            
            // Мерцание
            this.blinkPhase += this.blinkSpeed;
            
            // Перемещение звезды, если она выходит за пределы экрана
            if (this.x < 0 || this.x > backgroundCanvas.width || 
                this.y < 0 || this.y > backgroundCanvas.height) {
                this.reset();
            }
        }
    }

    // Создание звезд
    for (let i = 0; i < starCount; i++) {
        stars.push(new Star());
    }

    // Земля
    const earth = {
        x: backgroundCanvas.width * 0.9,
        y: backgroundCanvas.height * 0.5,
        radius: 250,
        rotation: 0
    };

    function drawEarth() {
        ctx.save();
        ctx.translate(earth.x, earth.y);
        ctx.rotate(earth.rotation);

        // Создаем более сложный градиент для основной сферы Земли
        const planetGradient = ctx.createRadialGradient(
            -earth.radius/3, -earth.radius/3, 0, 
            0, 0, earth.radius
        );
        planetGradient.addColorStop(0, 'rgba(30, 144, 255, 0.9)');     // Глубокий голубой океан
        planetGradient.addColorStop(0.4, 'rgba(30, 144, 255, 0.8)');   // Чуть менее прозрачный
        planetGradient.addColorStop(1, 'rgba(30, 144, 255, 0.7)');     // Более прозрачный край

        // Основная сфера
        ctx.beginPath();
        ctx.arc(0, 0, earth.radius, 0, Math.PI * 2);
        ctx.fillStyle = planetGradient;
        ctx.fill();

        // Функция для создания реалистичных контуров материков
        function createRealContinent(ctx, points, color) {
            ctx.beginPath();
            ctx.moveTo(points[0].x, points[0].y);
            
            // Создаем плавные кривые Безье между точками
            for (let i = 1; i < points.length; i++) {
                let cp1 = points[i-1];
                let cp2 = points[i];
                ctx.bezierCurveTo(
                    cp1.x + (cp2.x - cp1.x) * 0.3, 
                    cp1.y + (cp2.y - cp1.y) * 0.3,
                    cp2.x - (cp2.x - cp1.x) * 0.3, 
                    cp2.y - (cp2.y - cp1.y) * 0.3,
                    cp2.x, 
                    cp2.y
                );
            }
            
            // Замыкаем контур
            ctx.closePath();
            ctx.fillStyle = color;
            ctx.fill();
        }

        // Реалистичные контуры материков (scaled to earth.radius)
        const continents = [
            {
                // Северная Америка
                points: [
                    {x: -earth.radius*0.9, y: -earth.radius*0.6},
                    {x: -earth.radius*0.7, y: -earth.radius*0.8},
                    {x: -earth.radius*0.4, y: -earth.radius},
                    {x: earth.radius*0.1, y: -earth.radius*0.8},
                    {x: earth.radius*0.4, y: -earth.radius*0.6},
                    {x: earth.radius*0.3, y: -earth.radius*0.3},
                    {x: 0, y: -earth.radius*0.2},
                    {x: -earth.radius*0.6, y: -earth.radius*0.3}
                ],
                color: 'rgba(139, 69, 19, 0.9)' // Коричневый
            },
            {
                // Южная Америка
                points: [
                    {x: -earth.radius*0.5, y: earth.radius*0.7},
                    {x: -earth.radius*0.3, y: earth.radius*0.9},
                    {x: 0, y: earth.radius},
                    {x: earth.radius*0.3, y: earth.radius*0.9},
                    {x: earth.radius*0.5, y: earth.radius*0.7},
                    {x: earth.radius*0.4, y: earth.radius*0.4},
                    {x: 0, y: earth.radius*0.3},
                    {x: -earth.radius*0.4, y: earth.radius*0.4}
                ],
                color: 'rgba(34, 139, 34, 0.9)' // Зеленый
            },
            {
                // Африка
                points: [
                    {x: earth.radius*0.6, y: earth.radius*0.3},
                    {x: earth.radius*0.9, y: 0},
                    {x: earth.radius*0.7, y: -earth.radius*0.4},
                    {x: earth.radius*0.4, y: -earth.radius*0.7},
                    {x: 0, y: -earth.radius*0.5},
                    {x: -earth.radius*0.4, y: 0},
                    {x: -earth.radius*0.2, y: earth.radius*0.5},
                    {x: 0, y: earth.radius*0.7}
                ],
                color: 'rgba(85, 107, 47, 0.9)' // Темно-зеленый
            },
            {
                // Евразия
                points: [
                    {x: -earth.radius, y: -earth.radius*0.4},
                    {x: -earth.radius*0.7, y: -earth.radius*0.7},
                    {x: 0, y: -earth.radius*0.9},
                    {x: earth.radius*0.7, y: -earth.radius*0.7},
                    {x: earth.radius, y: -earth.radius*0.4},
                    {x: earth.radius*0.7, y: 0},
                    {x: 0, y: earth.radius*0.5},
                    {x: -earth.radius*0.7, y: 0}
                ],
                color: 'rgba(46, 139, 87, 0.9)' // Морской зеленый
            }
        ];

        // Отрисовка материков
        continents.forEach(continent => {
            createRealContinent(ctx, continent.points, continent.color);
        });

        // Атмосфера с более мягким свечением
        ctx.beginPath();
        const atmosphereGradient = ctx.createRadialGradient(
            0, 0, earth.radius, 
            0, 0, earth.radius * 1.2
        );
        atmosphereGradient.addColorStop(0, 'rgba(173, 216, 230, 0.3)');
        atmosphereGradient.addColorStop(0.7, 'rgba(173, 216, 230, 0.1)');
        atmosphereGradient.addColorStop(1, 'rgba(173, 216, 230, 0)');
        
        ctx.arc(0, 0, earth.radius * 1.2, 0, Math.PI * 2);
        ctx.fillStyle = atmosphereGradient;
        ctx.fill();

        // Легкое свечение краев планеты
        ctx.beginPath();
        const glowGradient = ctx.createRadialGradient(
            0, 0, earth.radius, 
            0, 0, earth.radius * 1.05
        );
        glowGradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
        glowGradient.addColorStop(1, 'rgba(255, 255, 255, 0.1)');
        
        ctx.arc(0, 0, earth.radius * 1.05, 0, Math.PI * 2);
        ctx.fillStyle = glowGradient;
        ctx.fill();

        ctx.restore();
        earth.rotation += 0.001;
    }

    function animate() {
        ctx.clearRect(0, 0, backgroundCanvas.width, backgroundCanvas.height);

        // Фон космоса
        const gradient = ctx.createLinearGradient(0, 0, 0, backgroundCanvas.height);
        gradient.addColorStop(0, '#000033');
        gradient.addColorStop(1, '#000011');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, backgroundCanvas.width, backgroundCanvas.height);

        // Рисование звезд
        stars.forEach(star => {
            star.draw();
            star.update();
        });

        // Рисование Земли
        drawEarth();

        requestAnimationFrame(animate);
    }

    // Адаптация к изменению размера окна
    window.addEventListener('resize', () => {
        backgroundCanvas.width = window.innerWidth;
        backgroundCanvas.height = window.innerHeight;
    });

    animate();

    // Динамическая навигация и прокрутка для мобильных устройств
    // Проверка мобильного устройства
    const isMobile = window.innerWidth <= 600;
    if (!isMobile) return;

    const header = document.querySelector('header');
    
    // Создаем кнопку прокрутки вверх
    const scrollTopBtn = document.createElement('button');
    scrollTopBtn.id = 'scroll-top-btn';
    scrollTopBtn.setAttribute('aria-label', 'Прокрутка наверх');
    scrollTopBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"/>
      </svg>
    `;
    document.body.appendChild(scrollTopBtn);

    // Управление кнопкой прокрутки вверх
    function handleScroll() {
      const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;

      // Показываем кнопку прокрутки вверх после определенной прокрутки
      if (currentScrollTop > 300) {
        scrollTopBtn.classList.add('show');
      } else {
        scrollTopBtn.classList.remove('show');
      }
    }

    // Оптимизированный обработчик прокрутки
    let scrollTimeout;
    window.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(handleScroll, 50);
    });

    // Обработчик клика для кнопки прокрутки вверх
    scrollTopBtn.addEventListener('click', () => {
      // Плавная прокрутка с поддержкой разных браузеров
      if ('scrollBehavior' in document.documentElement.style) {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      } else {
        // Fallback для старых браузеров
        window.scrollTo(0, 0);
      }
    });
}); 