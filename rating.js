// Система рейтинга новостей (5 звёзд)
class RatingManager {
  constructor() {
    this.ratings = JSON.parse(localStorage.getItem('ratings')) || {};
    this.currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
  }

  // Получить все оценки для новости
  getRatings(newsId) {
    return this.ratings[newsId] || [];
  }

  // Получить средний рейтинг и количество оценок
  getStats(newsId) {
    const arr = this.getRatings(newsId);
    if (!arr.length) return { avg: 0, count: 0 };
    const sum = arr.reduce((acc, r) => acc + r.value, 0);
    return { avg: sum / arr.length, count: arr.length };
  }

  // Получить оценку текущего пользователя
  getUserRating(newsId) {
    if (!this.currentUser) return 0;
    const arr = this.getRatings(newsId);
    const found = arr.find(r => r.userId === this.currentUser.id);
    return found ? found.value : 0;
  }

  // Поставить/обновить оценку
  setRating(newsId, value) {
    if (!this.currentUser) return { success: false, message: 'Войдите для оценки новости' };
    if (value < 1 || value > 5) return { success: false, message: 'Некорректная оценка' };
    if (!this.ratings[newsId]) this.ratings[newsId] = [];
    const arr = this.ratings[newsId];
    const idx = arr.findIndex(r => r.userId === this.currentUser.id);
    if (idx !== -1) {
      arr[idx].value = value;
    } else {
      arr.push({ userId: this.currentUser.id, value });
    }
    localStorage.setItem('ratings', JSON.stringify(this.ratings));
    return { success: true };
  }

  // Обновить пользователя
  updateCurrentUser() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
  }
}

const ratingManager = new RatingManager();

// Рендер блока рейтинга
function renderRatingBlock(newsId) {
  ratingManager.updateCurrentUser();
  const stats = ratingManager.getStats(newsId);
  const userRating = ratingManager.getUserRating(newsId);

  let html = '<div class="rating-section"><div class="rating-label">Ваша оценка:</div><div class="stars">';
  for (let i = 1; i <= 5; i++) {
    html += `<span class="star${i <= userRating ? ' selected' : ''}" data-value="${i}" onclick="setRating('${newsId}', ${i})">&#9733;</span>`;
  }
  html += '</div>';
  html += `<div class="rating-stats">Средний рейтинг: <span class="avg">${stats.avg.toFixed(2)}</span> (${stats.count} оценок)</div></div>`;
  return html;
}

// Вставить блок рейтинга в модальное окно
function addRatingSection(newsId) {
  const modalContent = document.querySelector('.modal-content');
  if (!modalContent) return;
  let ratingSection = document.getElementById('ratingSection');
  if (ratingSection) ratingSection.remove();
  ratingSection = document.createElement('div');
  ratingSection.id = 'ratingSection';
  ratingSection.innerHTML = renderRatingBlock(newsId);
  modalContent.appendChild(ratingSection);
}

// Обработчик клика по звезде
function setRating(newsId, value) {
  const result = ratingManager.setRating(newsId, value);
  if (result.success) {
    showNotification('Спасибо за вашу оценку!', 'success');
    addRatingSection(newsId);
  } else {
    showNotification(result.message, 'error');
  }
} 