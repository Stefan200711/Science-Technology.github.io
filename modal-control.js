// Управление состоянием модальных окон
document.addEventListener('DOMContentLoaded', function() {
  // Закрываем все модальные окна при загрузке страницы
  const modals = document.querySelectorAll('.modal');
  modals.forEach(modal => {
    modal.style.display = 'none';
  });

  // Предотвращаем автоматическое открытие модальных окон
  const loginLinks = document.querySelectorAll('[data-auth-link="login"]');
  const registerLinks = document.querySelectorAll('[data-auth-link="register"]');

  loginLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault(); // Предотвращаем действие по умолчанию
      openModal('loginModal');
    });
  });

  registerLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault(); // Предотвращаем действие по умолчанию
      openModal('registerModal');
    });
  });

  // Добавляем localStorage для управления состоянием модальных окон
  const loginModalState = localStorage.getItem('loginModalState');
  const registerModalState = localStorage.getItem('registerModalState');

  // Восстанавливаем состояние модальных окон, если необходимо
  if (loginModalState === 'open') {
    openModal('loginModal');
  }

  if (registerModalState === 'open') {
    openModal('registerModal');
  }

  // Обновляем состояние модальных окон при закрытии
  function updateModalState(modalId, state) {
    localStorage.setItem(`${modalId}State`, state);
  }

  // Переопределяем функции открытия и закрытия с сохранением состояния
  const originalOpenModal = window.openModal;
  window.openModal = function(modalId) {
    originalOpenModal(modalId);
    updateModalState(modalId, 'open');
  };

  const originalCloseModal = window.closeModal;
  window.closeModal = function(modalId) {
    originalCloseModal(modalId);
    updateModalState(modalId, 'closed');
  };
}); 