import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Register (props) {
  // Стейты для регистрации
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // Передача почты и пароля
  function handleEmail (event) { setEmail(event.target.value) }
  function handlePass (event) { setPassword(event.target.value) }
  // Обработка почты и пароля через API (utils/AuthApi), функция регистрации в App
  function handleSubmitButton (event) {
    event.preventDefault();
    props.handleRegister(password, email);
    setPassword('');
    setEmail('');
  }

  return (
    <>
      <div className="auth">
        <h3 className="auth__title-form">Регистрация</h3>
        <form className="auth__form" onSubmit={ handleSubmitButton }>
          <label htmlFor="email-input" className="auth__label">
            <input id="email-input" type="email" onChange={ handleEmail } value={ email || '' } className="auth__input"
                   name="email" required placeholder="Email" minLength="8" maxLength="40" />
            <span className="email-input-error auth__input-error" />
          </label>
          <label htmlFor="passwd-input" className="auth__label">
            <input id="passwd-input" type="password" onChange={ handlePass } value={ password || '' } className="auth__input"
                   name="passwd" required placeholder="Пароль" minLength="6" maxLength="18" />
            <span className="passwd-input-error auth__input-error" />
          </label>
          <button type="submit" className="auth__button" aria-label="Зарегистрироваться">Зарегистрироваться</button>
        </form>
        <div className='auth__register'>
          <p>Уже зарегистрированы?</p>
          <Link to="sign-in" className="auth__link">Войти</Link>
        </div>
      </div>
    </>
  )
}

export default Register;