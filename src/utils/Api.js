import apiFindings from './apiFindings';

class Api {
  constructor({ link, headers }) {
    this._link = link;
    this._headers = headers;
  }
  // Метод обработки ответа сервера
  _processingServerResponse (res) {
    if (res.ok) {
      return res.json();
    } else {
      return Promise.reject(`код ошибки: ${res.status}`);
    }
  }
  // Метод инициализации карточек с сервера
  getInitialCards () {
    return fetch(`${this._link}cards`, {
      headers: this._headers
      // По умолчанию fetch — это GET, можно не указывать
    })
      .then(this._processingServerResponse)
  }
  // Метод добавления новой карточки на сервер
  addNewCard (name, link) {
    return fetch(`${this._link}cards`, {
      headers: this._headers,
      method: 'POST',
      body: JSON.stringify({ name, link })
    })
      .then(this._processingServerResponse)
  }
  // Метод удаления карточки с сервера
  deleteCard (cardId) {
    return fetch(`${this._link}cards/${cardId}`, {
      headers: this._headers,
      method: 'DELETE',
    })
      .then(this._processingServerResponse)
  }
  // Метод получения данных пользователя с сервера
  getUserData () {
    return fetch(`${this._link}users/me`, {
      headers: this._headers
      // По умолчанию fetch — это GET, можно не указывать
    })
      .then( this._processingServerResponse)
  }
  // Метод отправки данных пользователя на сервер
  sendUserData (userName, userAbout) {
    return fetch(`${this._link}users/me`, {
      headers: this._headers,
      method: 'PATCH',
      body: JSON.stringify({ name: userName, about: userAbout })
    })
      .then(this._processingServerResponse)
  }
  // Метод отправки данных о новом аватаре на сервер
  sendAvatarData (avatarLink) {
    return fetch(`${this._link}users/me/avatar`, {
      headers: this._headers,
      method: 'PATCH',
      body: JSON.stringify({ avatar: avatarLink.avatar })
    })
      .then(this._processingServerResponse)
  }
  // Метод обработки лайков карточки
  changeLikeCardStatus (cardId, isLiked) {
    if (isLiked) {
      return fetch(`${this._link}cards/${cardId}/likes`, {
        headers: this._headers,
        method: 'PUT',
      })
      .then(this._processingServerResponse)
    } else {
      return fetch(`${this._link}cards/${cardId}/likes`, {
        headers: this._headers,
        method: 'DELETE',
      })
      .then(this._processingServerResponse)
    }
  }
}

// Создание экземпляра класса
const apiConnect = new Api(apiFindings);
// Экспорт экземпляра класса
export default apiConnect;
