import headerLogo from '../images/logo.svg';
import { Link, Route } from 'react-router-dom';

function Header (props) {
  return (
    <header className="header">
      <img src={ headerLogo } className="header__logo" alt="Логотип проекта Mesto" />
      <div className="header__member-area">
        { props.isLoggedIn ? ( // Если пользователь авторизован, видит данный код:
          <>
            <p className="header__menu-item">{ props.email }</p>
            <Link to='/sign-in' className="header__menu-item" onClick={ props.isLogout }>Выйти</Link>
          </>
        ) : ( // Если пользователь не авторизован, видит данный код:
          <>
            <Route path='/sign-up'>
              <Link to='/sign-in' className="header__menu-item">Вход</Link>
            </Route>
            <Route path='/sign-in' >
              <Link to='/sign-up' className="header__menu-item">Регистрация</Link>
            </Route>
          </>
        )}
      </div>
    </header>
  )
}

export default Header;