class UserManager {
    constructor() {
        this.users = JSON.parse(localStorage.getItem('registeredUsers')) || [];
        this.currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
    }

    // Регистрация нового пользователя
    register(name, email, password) {
        const existingUser = this.users.find(user => user.email === email);
        if (existingUser) {
            return { success: false, message: 'Пользователь с таким email уже существует' };
        }

        // Проверка длины пароля
        if (password.length < 8) {
            this.showNotification('Пароль должен содержать не менее 8 символов', 'error');
            return { success: false, message: 'Пароль должен содержать не менее 8 символов' };
        }

        const newUser = {
            id: Date.now(),
            name: name,
            email: email,
            password: this.hashPassword(password),
            registeredAt: new Date().toISOString()
        };

        this.users.push(newUser);
        localStorage.setItem('registeredUsers', JSON.stringify(this.users));
        return { success: true, user: newUser };
    }

    // Вход пользователя
    login(email, password) {
        const hashedPassword = this.hashPassword(password);
        const user = this.users.find(
            u => u.email === email && u.password === hashedPassword
        );

        if (user) {
            this.currentUser = user;
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.updateAuthUI();
            return { success: true, user: user };
        }

        const existingUser = this.users.find(u => u.email === email);
        if (existingUser) {
            return { success: false, message: 'Неверный пароль' };
        } else {
            return { success: false, message: 'Пользователь с таким email не найден' };
        }
    }

    // Выход пользователя
    logout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
        this.updateAuthUI();
    }

    // Простейшее хеширование
    hashPassword(password) {
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return hash.toString();
    }

    // Проверка, авторизован ли пользователь
    isLoggedIn() {
        return !!this.currentUser;
    }

    // Обновление UI после авторизации/выхода
    updateAuthUI() {
        const loginLinks = document.querySelectorAll('[data-auth-link="login"]');
        const registerLinks = document.querySelectorAll('[data-auth-link="register"]');
        const userInfoElements = document.querySelectorAll('[data-user-info]');
        const logoutButtons = document.querySelectorAll('[data-auth-link="logout"]');

        if (this.isLoggedIn()) {
            loginLinks.forEach(el => el.style.display = 'none');
            registerLinks.forEach(el => el.style.display = 'none');
            userInfoElements.forEach(el => {
                el.style.display = 'block';
                el.textContent = `Привет, ${this.currentUser.name}`;
            });
            logoutButtons.forEach(el => el.style.display = 'block');
        } else {
            loginLinks.forEach(el => el.style.display = 'block');
            registerLinks.forEach(el => el.style.display = 'block');
            userInfoElements.forEach(el => el.style.display = 'none');
            logoutButtons.forEach(el => el.style.display = 'none');
        }
    }

    // Инициализация при загрузке страницы
    init() {
        this.updateAuthUI();

        // Обработчики форм
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');
        const logoutButtons = document.querySelectorAll('[data-auth-link="logout"]');

        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const email = loginForm.querySelector('input[type="email"]').value;
                const password = loginForm.querySelector('input[type="password"]').value;
                const result = this.login(email, password);
                
                if (result.success) {
                    this.showNotification('Вход выполнен успешно', 'success');
                    closeModal('loginModal');
                } else {
                    this.showNotification(result.message, 'error');
                }
            });
        }

        if (registerForm) {
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const name = registerForm.querySelector('input[placeholder="Имя"]').value;
                const email = registerForm.querySelector('input[type="email"]').value;
                const passwordInputs = registerForm.querySelectorAll('input[type="password"]');
                const password = passwordInputs[0].value;
                const confirmPassword = passwordInputs[1].value;
                
                // Проверка совпадения паролей
                if (password !== confirmPassword) {
                    // Добавляем визуальную индикацию несовпадения паролей
                    passwordInputs[0].style.borderColor = 'red';
                    passwordInputs[1].style.borderColor = 'red';
                    
                    this.showNotification('Пароли не совпадают', 'error');
                    return;
                } else {
                    // Сбрасываем цвет границ, если пароли совпадают
                    passwordInputs[0].style.borderColor = '';
                    passwordInputs[1].style.borderColor = '';
                }
                
                // Проверка длины пароля
                if (password.length < 8) {
                    this.showNotification('Пароль должен содержать не менее 8 символов', 'error');
                    return;
                }
                
                const result = this.register(name, email, password);
                
                if (result.success) {
                    this.showNotification('Регистрация прошла успешно', 'success');
                    closeModal('registerModal');
                } else {
                    this.showNotification(result.message, 'error');
                }
            });
        }

        logoutButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.logout();
                this.showNotification('Вы вышли из аккаунта', 'success');
            });
        });
    }

    // Показ уведомлений
    showNotification(message, type = 'success') {
        const notification = document.getElementById('notification');
        const notificationMessage = document.getElementById('notificationMessage');
        
        if (notification && notificationMessage) {
            notificationMessage.textContent = message;
            notification.className = `notification ${type} visible`;
            
            // Добавляем консоль-лог для отладки
            console.log(`Notification: ${message}, Type: ${type}`);
            
            // Очищаем предыдущий таймер, если он был
            if (this.notificationTimer) {
                clearTimeout(this.notificationTimer);
            }
            
            // Устанавливаем новый таймер
            this.notificationTimer = setTimeout(() => {
                notification.className = 'notification';
            }, 3500);
        } else {
            // Резервный метод, если элементы не найдены
            console.error('Notification elements not found');
            alert(message);
        }
    }
}

// Создаем глобальный экземпляр UserManager
const userManager = new UserManager();

// Инициализируем при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    userManager.init();
}); 