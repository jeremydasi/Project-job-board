import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/header.css';
import logo from '../../assets/logo-ice-job.svg';
import AuthContext from '../authContext';

const Header = () => {
  const { isLoggedIn, logout } = useContext(AuthContext);

  return (
    <div className='Header'>
      <header>
        <nav>
          <img src={logo} alt="Logo" className="logo" />
          <span className="logo-text">Ice Job</span>

          <ul>
            <input
              type="text"
              id="search-bar"
              name="search"
              placeholder="Recherche"
              required
              minLength="4"
              maxLength="50"
              size="10"
            />
            <li><Link to="/">Accueil</Link></li>
            <li><Link to="/Fav">Favoris</Link></li>

            {/* Afficher les boutons selon l'état de connexion */}
            {isLoggedIn ? (
              <>
                <li><Link to="/MonCompte">Mon Compte</Link></li>
                <li>
                  <button onClick={logout}>Déconnexion</button>
                </li>
              </>
            ) : (
              <li><Link to="/login">Login</Link></li>
            )}
          </ul>
        </nav>
      </header>
    </div>
  );
};

export default Header;
