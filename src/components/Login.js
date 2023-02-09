import React, { useState } from 'react';

function Login (props) {
  // Стейты авторизации
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // Передача почты и пароля
  function handleEmail (event) { setEmail(event.target.value) }
  function handlePass (event) { setPassword(event.target.value) }
  // Функция авторизации и сброса формы
  function handleSubmitButton (event) {
    event.preventDefault();
    props.handleLogin(password, email);
    setPassword('');
    setEmail('');
  }

  return (
    <>
      <div className="auth">
        <h3 className="auth__title-form">Вход</h3>
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
          <button type="submit" className="auth__button" aria-label="Войти">Войти</button>
        </form>
      </div>
    </>
  )
}

export default Login;