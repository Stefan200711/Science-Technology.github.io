// Система комментариев
class CommentsManager {
  constructor() {
    this.comments = JSON.parse(localStorage.getItem('comments')) || {};
    this.currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
  }

  // Получить комментарии для конкретной новости
  getComments(newsId) {
    return this.comments[newsId] || [];
  }

  // Добавить комментарий
  addComment(newsId, text) {
    if (!this.currentUser) {
      return { success: false, message: 'Необходимо войти в аккаунт для добавления комментария' };
    }

    if (!text.trim()) {
      return { success: false, message: 'Комментарий не может быть пустым' };
    }

    if (!this.comments[newsId]) {
      this.comments[newsId] = [];
    }

    const comment = {
      id: Date.now(),
      author: this.currentUser.name,
      text: text.trim(),
      date: new Date().toISOString(),
      userId: this.currentUser.id,
      likes: 0,
      likedBy: [] // Список пользователей, которые лайкнули комментарий
    };

    this.comments[newsId].push(comment);
    localStorage.setItem('comments', JSON.stringify(this.comments));
    
    return { success: true, comment: comment };
  }

  // Удалить комментарий (только автор может удалить свой комментарий)
  deleteComment(newsId, commentId) {
    if (!this.currentUser) {
      return { success: false, message: 'Необходимо войти в аккаунт' };
    }

    const newsComments = this.comments[newsId];
    if (!newsComments) {
      return { success: false, message: 'Комментарий не найден' };
    }

    const commentIndex = newsComments.findIndex(c => c.id === commentId);
    if (commentIndex === -1) {
      return { success: false, message: 'Комментарий не найден' };
    }

    const comment = newsComments[commentIndex];
    if (comment.userId !== this.currentUser.id) {
      return { success: false, message: 'Вы можете удалить только свои комментарии' };
    }

    newsComments.splice(commentIndex, 1);
    localStorage.setItem('comments', JSON.stringify(this.comments));
    
    return { success: true };
  }

  // Добавить ответ на комментарий
  addReply(newsId, parentCommentId, text) {
    if (!this.currentUser) {
      return { success: false, message: 'Необходимо войти в аккаунт для добавления ответа' };
    }

    if (!text.trim()) {
      return { success: false, message: 'Ответ не может быть пустым' };
    }

    if (!this.comments[newsId]) {
      return { success: false, message: 'Новость не найдена' };
    }

    const parentComment = this.comments[newsId].find(c => c.id === parentCommentId);
    if (!parentComment) {
      return { success: false, message: 'Родительский комментарий не найден' };
    }

    const reply = {
      id: Date.now(),
      parentId: parentCommentId,
      author: this.currentUser.name,
      text: text.trim(),
      date: new Date().toISOString(),
      userId: this.currentUser.id,
      likes: 0,
      likedBy: [] // Список пользователей, которые лайкнули ответ
    };

    // Если у комментария еще нет replies, создаем массив
    if (!parentComment.replies) {
      parentComment.replies = [];
    }
    parentComment.replies.push(reply);

    localStorage.setItem('comments', JSON.stringify(this.comments));
    
    return { success: true, reply: reply };
  }

  // Удалить ответ на комментарий
  deleteReply(newsId, parentCommentId, replyId) {
    if (!this.currentUser) {
      return { success: false, message: 'Необходимо войти в аккаунт' };
    }

    const newsComments = this.comments[newsId];
    if (!newsComments) {
      return { success: false, message: 'Новость не найдена' };
    }

    const parentComment = newsComments.find(c => c.id === parentCommentId);
    if (!parentComment || !parentComment.replies) {
      return { success: false, message: 'Родительский комментарий не найден' };
    }

    const replyIndex = parentComment.replies.findIndex(r => r.id === replyId);
    if (replyIndex === -1) {
      return { success: false, message: 'Ответ не найден' };
    }

    const reply = parentComment.replies[replyIndex];
    if (reply.userId !== this.currentUser.id) {
      return { success: false, message: 'Вы можете удалить только свои ответы' };
    }

    parentComment.replies.splice(replyIndex, 1);
    localStorage.setItem('comments', JSON.stringify(this.comments));
    
    return { success: true };
  }

  // Лайк комментария
  likeComment(newsId, commentId, isReply = false, parentCommentId = null) {
    if (!this.currentUser) {
      return { success: false, message: 'Необходимо войти в аккаунт' };
    }

    const newsComments = this.comments[newsId];
    if (!newsComments) {
      return { success: false, message: 'Новость не найдена' };
    }

    let comment;
    if (isReply) {
      const parentComment = newsComments.find(c => c.id === parentCommentId);
      if (!parentComment || !parentComment.replies) {
        return { success: false, message: 'Комментарий не найден' };
      }
      comment = parentComment.replies.find(r => r.id === commentId);
    } else {
      comment = newsComments.find(c => c.id === commentId);
    }

    if (!comment) {
      return { success: false, message: 'Комментарий не найден' };
    }

    // Проверяем, лайкал ли пользователь уже этот комментарий
    const userIndex = comment.likedBy.indexOf(this.currentUser.id);
    if (userIndex !== -1) {
      // Убираем лайк
      comment.likedBy.splice(userIndex, 1);
      comment.likes--;
    } else {
      // Добавляем лайк
      comment.likedBy.push(this.currentUser.id);
      comment.likes++;
    }

    localStorage.setItem('comments', JSON.stringify(this.comments));
    
    return { 
      success: true, 
      likes: comment.likes, 
      liked: userIndex === -1 
    };
  }

  // Обновить текущего пользователя
  updateCurrentUser() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
  }

  // Получить инициалы для аватара
  getInitials(name) {
    return name.split(' ').map(word => word.charAt(0)).join('').toUpperCase();
  }

  // Форматировать дату
  formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'только что';
    if (minutes < 60) return `${minutes} мин. назад`;
    if (hours < 24) return `${hours} ч. назад`;
    if (days < 7) return `${days} дн. назад`;
    
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }
}

// Глобальный экземпляр менеджера комментариев
const commentsManager = new CommentsManager();

// Функция для отображения комментариев
function displayComments(newsId) {
  const commentsList = document.getElementById('commentsList');
  const comments = commentsManager.getComments(newsId);
  
  if (!commentsList) return;

  commentsList.innerHTML = '';
  
  if (comments.length === 0) {
    commentsList.innerHTML = '<p style="text-align: center; color: #666; font-style: italic;">Пока нет комментариев. Будьте первым!</p>';
    return;
  }

  comments.forEach(comment => {
    const commentElement = createCommentElement(comment, newsId);
    commentsList.appendChild(commentElement);
  });
}

// Функция для создания элемента комментария
function createCommentElement(comment, newsId) {
  const commentDiv = document.createElement('div');
  commentDiv.className = 'comment';
  commentDiv.dataset.commentId = comment.id;

  // Проверяем, лайкнул ли текущий пользователь этот комментарий
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const isLiked = currentUser ? comment.likedBy.includes(currentUser.id) : false;

  commentDiv.innerHTML = `
    <div class="comment-avatar">${commentsManager.getInitials(comment.author)}</div>
    <div class="comment-body">
      <div class="comment-header">
        <span class="comment-author">${comment.author}</span>
        <span class="comment-date">${commentsManager.formatDate(comment.date)}</span>
      </div>
      <div class="comment-text">${comment.text}</div>
      <div class="comment-actions">
        <button class="reply-btn" onclick="showReplyForm(${comment.id}, '${newsId}')">Ответить</button>
        <button class="like-btn ${isLiked ? 'liked' : ''}" onclick="likeComment(${comment.id}, '${newsId}')">
          <i class="like-icon">❤️</i>
          <span class="like-count">${comment.likes || 0}</span>
        </button>
      </div>
      <div class="comment-replies" id="replies-${comment.id}"></div>
    </div>
  `;

  // Добавляем ответы, если они есть
  if (comment.replies && comment.replies.length > 0) {
    const repliesContainer = commentDiv.querySelector(`#replies-${comment.id}`);
    comment.replies.forEach(reply => {
      const replyElement = createReplyElement(reply, newsId, comment.id);
      repliesContainer.appendChild(replyElement);
    });
  }

  return commentDiv;
}

// Функция для создания элемента ответа
function createReplyElement(reply, newsId, parentCommentId) {
  const replyDiv = document.createElement('div');
  replyDiv.className = 'comment-reply';
  replyDiv.dataset.replyId = reply.id;

  // Проверяем, лайкнул ли текущий пользователь этот ответ
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const isLiked = currentUser ? reply.likedBy.includes(currentUser.id) : false;

  replyDiv.innerHTML = `
    <div class="comment-avatar">${commentsManager.getInitials(reply.author)}</div>
    <div class="comment-body">
      <div class="comment-header">
        <span class="comment-author">${reply.author}</span>
        <span class="comment-date">${commentsManager.formatDate(reply.date)}</span>
      </div>
      <div class="comment-text">${reply.text}</div>
      <div class="comment-actions">
        <button class="like-btn ${isLiked ? 'liked' : ''}" onclick="likeReply(${reply.id}, '${newsId}', ${parentCommentId})">
          <i class="like-icon">❤️</i>
          <span class="like-count">${reply.likes || 0}</span>
        </button>
      </div>
    </div>
  `;

  return replyDiv;
}

// Функция для отображения формы ответа
function showReplyForm(parentCommentId, newsId) {
  // Удаляем существующие формы ответа
  const existingReplyForms = document.querySelectorAll('.reply-form');
  existingReplyForms.forEach(form => form.remove());

  // Находим контейнер для формы ответа
  const parentComment = document.querySelector(`[data-comment-id="${parentCommentId}"]`);
  const repliesContainer = parentComment.querySelector('.comment-replies');

  // Создаем форму ответа
  const replyForm = document.createElement('div');
  replyForm.className = 'reply-form';
  replyForm.innerHTML = `
    <textarea id="replyInput-${parentCommentId}" placeholder="Написать ответ..." rows="3"></textarea>
    <div class="reply-form-actions">
      <button onclick="addReply(${parentCommentId}, '${newsId}')">Отправить</button>
      <button onclick="cancelReply(${parentCommentId})">Отмена</button>
    </div>
  `;

  // Добавляем форму в контейнер ответов
  repliesContainer.appendChild(replyForm);

  // Фокус на поле ввода
  const replyInput = document.getElementById(`replyInput-${parentCommentId}`);
  replyInput.focus();
}

// Функция для добавления ответа
function addReply(parentCommentId, newsId) {
  const replyInput = document.getElementById(`replyInput-${parentCommentId}`);
  const text = replyInput.value.trim();
  
  if (!text) {
    showNotification('Введите текст ответа', 'error');
    return;
  }

  const result = commentsManager.addReply(newsId, parentCommentId, text);
  
  if (result.success) {
    replyInput.value = '';
    displayComments(newsId);
    showNotification('Ответ добавлен!', 'success');
  } else {
    showNotification(result.message, 'error');
  }
}

// Функция для отмены ответа
function cancelReply(parentCommentId) {
  const replyForm = document.querySelector(`[data-comment-id="${parentCommentId}"] .reply-form`);
  if (replyForm) {
    replyForm.remove();
  }
}

// Функция для добавления комментария
function addComment(newsId) {
  const commentInput = document.getElementById('commentInput');
  const text = commentInput.value.trim();
  
  if (!text) {
    showNotification('Введите текст комментария', 'error');
    return;
  }

  const result = commentsManager.addComment(newsId, text);
  
  if (result.success) {
    commentInput.value = '';
    displayComments(newsId);
    showNotification('Комментарий добавлен!', 'success');
  } else {
    showNotification(result.message, 'error');
  }
}

// Функция для удаления комментария
function deleteComment(newsId, commentId) {
  if (confirm('Вы уверены, что хотите удалить этот комментарий?')) {
    const result = commentsManager.deleteComment(newsId, commentId);
    
    if (result.success) {
      displayComments(newsId);
      showNotification('Комментарий удален', 'success');
    } else {
      showNotification(result.message, 'error');
    }
  }
}

// Функция для добавления секции комментариев в модальное окно
function addCommentsSection(newsId) {
  const modalContent = document.querySelector('.modal-content');
  if (!modalContent) return;

  // Проверяем, есть ли уже секция комментариев
  let commentsSection = document.getElementById('commentsSection');
  if (commentsSection) {
    commentsSection.remove();
  }

  // Создаем секцию комментариев
  commentsSection = document.createElement('div');
  commentsSection.id = 'commentsSection';
  commentsSection.className = 'comments-section';
  
  commentsSection.innerHTML = `
    <h3>Комментарии</h3>
    <div id="commentsList"></div>
    <div class="comment-form">
      <textarea id="commentInput" placeholder="Написать комментарий..." rows="3"></textarea>
      <button onclick="addComment('${newsId}')" class="add-comment-btn">Добавить комментарий</button>
    </div>
  `;

  modalContent.appendChild(commentsSection);
  
  // Обновляем текущего пользователя и отображаем комментарии
  commentsManager.updateCurrentUser();
  displayComments(newsId);
}

// Функция для обработки нажатия Enter в поле комментария
function handleCommentKeyPress(event, newsId) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    addComment(newsId);
  }
}

// Добавляем обработчики событий при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
  // Обновляем текущего пользователя
  commentsManager.updateCurrentUser();
  
  // Добавляем обработчик для поля комментария (если оно существует)
  const commentInput = document.getElementById('commentInput');
  if (commentInput) {
    commentInput.addEventListener('keypress', function(event) {
      const newsId = this.closest('.comments-section').dataset.newsId;
      handleCommentKeyPress(event, newsId);
    });
  }
});

// Функция для лайка комментария
function likeComment(commentId, newsId) {
  const result = commentsManager.likeComment(newsId, commentId);
  
  if (result.success) {
    displayComments(newsId);
  } else {
    showNotification(result.message, 'error');
  }
}

// Функция для лайка ответа
function likeReply(replyId, newsId, parentCommentId) {
  const result = commentsManager.likeComment(newsId, replyId, true, parentCommentId);
  
  if (result.success) {
    displayComments(newsId);
  } else {
    showNotification(result.message, 'error');
  }
} 