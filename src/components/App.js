import React, { useEffect, useState } from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import ImagePopup from './ImagePopup';
import PopupEditAvatar from './PopupEditAvatar';
import PopupEditProfile from './PopupEditProfile';
import PopupAddCard from './PopupAddCard';
import ProtectedRoute from './ProtectedRoute';
import Register from './Register';
import Login from './Login';
import CurrentUserContext from '../contexts/CurrentUserContext';
import apiConnect from '../utils/Api';
import apiAuth from '../utils/AuthApi';
import InfoTooltip from "./InfoTooltip";

function App () {
  // Стейты
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false); // Редактирование аватара
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false); // Редактирование профиля
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false); // Добавление карточки
  const [isImageOpen, setIsImageOpen] = useState(false); // Увеличение изображения
  const [selectedCard, setSelectedCard] = useState({}); // Передача данных при увеличении изображения
  const [cards, setCards] = useState([]); // Инициализация карточек
  const [currentUser, setCurrentUser] = useState({}); // Значение для провайдера контекста
  const [email, setEmail] = useState(''); // Хранение и передача почты
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Состояние авторизации
  const [status, setStatus] = useState(false); // Статус регистрации(авторизации), используется для Tooltip (popup уведомления)
  const [tooltipOpen, setTooltipOpen] = useState(false); // Состояние Tooltip
  // Переменная для хранения истории
  const history = useHistory();
  // Рендер карточек и данных пользователя
  useEffect( () => {
    Promise.all([ apiConnect.getUserData(), apiConnect.getInitialCards() ])
      .then(( [ userItem, initialCards] ) => {
        setCurrentUser(userItem);
        setCards(initialCards);
      })
      .catch( (err) => { console.log(`Возникла глобальная ошибка, ${err}`) })
  }, [])
  // Верификация токена пользователя
  useEffect( () => {
    const userToken = localStorage.getItem('token')
    if (userToken) { apiAuth.tokenVerification(userToken)
        .then( (res) => { setEmail(res.data.email); setIsLoggedIn(true); history.push('/') })
        .catch( (err) => { console.log(`Возникла ошибка верификации токена, ${err}`) })
    }
  }, [history, isLoggedIn])
  // Обработчик открытия попапа обновления аватара
  function handleEditAvatarClick () { setIsEditAvatarPopupOpen(true) }
  // Обработчик открытия попапа редактирования профиля
  function handleEditProfileClick () { setIsEditProfilePopupOpen(true) }
  // Обработчик открытия попапа добавления карточки
  function handleAddPlaceClick () { setIsAddPlacePopupOpen(true) }
  // Обработчик удаления карточки
  function handleCardDelete (card) {
    apiConnect.deleteCard(card._id)
      .then( () => { setCards( (cardsArray) => cardsArray.filter( (cardItem) => cardItem._id !== card._id)) })
      .catch( (err) => { console.log(`Возникла ошибка при удалении карточки, ${err}`) })
  }
  // Обработчик изменения аватара
  function handleUpdateAvatar (link) {
    apiConnect.sendAvatarData(link)
      .then( (res) => { setCurrentUser(res); closeAllPopups() })
      .catch( (err) => { console.log(`Возникла ошибка при зименении аватара, ${err}`) })
  }
  // Обработчик для увеличения изображения и передачи данных
  function handleCardClick (cardItem) {
    setIsImageOpen(true);
    setSelectedCard({
      ...selectedCard,
      name: cardItem.name,
      link: cardItem.link
    })
  }
  // Обработчик лайков карточки
  function handleCardLike (card) {
    const isLiked = card.likes.some(cardItem => cardItem._id === currentUser._id);
    apiConnect.changeLikeCardStatus(card._id, !isLiked)
      .then( (cardsItem) => {
        setCards( (state) => state.map( (cardItem) => cardItem._id === card._id ? cardsItem : cardItem) )
      })
      .catch( (err) => { console.log(`Возникла ошибка при обработке лайков, ${err}`) })
  }
  // Обработчик данных пользователя
  function handleUpdateUser (userItem) {
    apiConnect.sendUserData(userItem.name, userItem.about)
      .then( (res) => { setCurrentUser(res); closeAllPopups() })
      .catch( (err) => { console.log(`Возникла ошибка при редактировании профиля, ${err}`) })
  }
  // Обработчик добавления карточки
  function handleAddCard (cardItem) {
    apiConnect.addNewCard(cardItem.name, cardItem.link)
      .then( (card) => { setCards([card, ...cards]); closeAllPopups() })
      .catch( (err) => { console.log(`Возникла ошибка при добавлении новой карточки, ${err}`) })
  }
  // Функция для закрытия всех попапов
  function closeAllPopups () {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsImageOpen(false);
    setTooltipOpen(false);
  }
  // Функция регистрации пользователя (при успехе(и нет) всплывает popup через Tooltip используя статус)
  function handleRegister (password, email) {
    apiAuth.userRegistration(password, email)
      .then( () => { setTooltipOpen(true); setStatus(true) })
      .catch( (err) => { console.log(`Возникла ошибка при регистрации пользователя, ${err}`); setTooltipOpen(true); setStatus(false) })
  }
  // Функция авторизации пользователя (при неудаче всплывает popup через Tooltip используя статус)
  function handleLogin (password, email) {
    apiAuth.userAuthorization(password, email)
      .then( (res) => {
        // Если токен валиден, авторизовываем и перебрасывам на главную
        if (res.token) {
          localStorage.setItem('token', res.token);
          setEmail(email);
          setIsLoggedIn(true);
          history.push('/');
        }
      })
      .catch( (err) => { console.log(`Возникла ошибка при авторизации, ${err}`); setTooltipOpen(true); setStatus(false) })
  }
  // Функция выхода пользователя
  function handleLogout () { localStorage.removeItem('token'); setIsLoggedIn(false);  }

  return (
    < CurrentUserContext.Provider value={ currentUser } >
      <div className="page">
        < Header
          isLoggedIn = { isLoggedIn }
          email = { email }
          isLogout = { handleLogout } />
        < Switch>
          < ProtectedRoute exact path='/'
            isLoggedIn = { isLoggedIn }
            component = { Main }
            onEditAvatar = { handleEditAvatarClick }
            onEditProfile = { handleEditProfileClick }
            onAddPlace = { handleAddPlaceClick }
            onCardClick = { handleCardClick }
            onCardDelete = { handleCardDelete }
            onCardLike = { handleCardLike }
            cards = { cards } />
          < Route path = { `/sign-in` }>
            < Login
              handleLogin = { handleLogin }
              isOpen = { tooltipOpen }
              onClose = { closeAllPopups }
              status = { status } />
          < /Route>
          < Route path = { `/sign-up` }>
            < Register
              handleRegister = { handleRegister }
              isOpen = { tooltipOpen }
              onClose = { closeAllPopups }
              status = { status } />
          < /Route>
        < /Switch>
        < Footer />
        < PopupEditAvatar
          isOpen = { isEditAvatarPopupOpen }
          onClose = { closeAllPopups }
          onUpdateAvatar = { handleUpdateAvatar } />
        < PopupEditProfile
          isOpen = { isEditProfilePopupOpen }
          onClose = { closeAllPopups }
          onUpdateUser = { handleUpdateUser }/>
        < PopupAddCard
          isOpen = { isAddPlacePopupOpen }
          onClose = { closeAllPopups }
          onAddPlace = { handleAddCard } />
        < ImagePopup
          isOpen = { isImageOpen }
          onClose = { closeAllPopups }
          card = { selectedCard } />
        < InfoTooltip
          isOpen = { tooltipOpen }
          onClose = { closeAllPopups }
          status = { status } />
      </div>
    < /CurrentUserContext.Provider >
  );
}

export default App;
