import React, { useState, useContext, useEffect } from "react";
import "../styles/login.css";
import Logo from "../assets/logo-ice-job.svg";
import Button from "../components/button";
import ButtonLog from "../components/button/buttonLog";
import { useNavigate } from "react-router-dom";
import CustomInput from "../components/customInput";
import AuthContext from "../components/authContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Veuillez remplir tous les champs !");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);

        const user = {
          id: data.user.id,
          email: data.user.user_email,
          is_admin: data.user.is_admin,
          firstname: data.user.user_firstname,
          lastname: data.user.user_lastname,
        };
        login(user);
        localStorage.setItem("user", JSON.stringify(user));

        if (data.user.is_admin) {
          navigate("/");
        } else {
          navigate("/MonCompte");
        }
      } else {
        setError(data.message || "Identifiants incorrects.");
        setTimeout(() => navigate("/"), 2000);
      }
    } catch (err) {
      console.error("Erreur lors de la connexion :", err);
      setError("Erreur lors de la connexion. Veuillez réessayer.");
      setTimeout(() => navigate("/"), 2000);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user) {
        if (user.is_admin) {
          navigate("/admin");
        } else {
          navigate("/login");
        }
      }
    }
  }, [navigate]);

  // Vérifier si on est sur la page de connexion
  const isLoginActive = window.location.pathname === "/login";

  return (
    <div className="containerPage">
      <div className="containerLogin">
        <div className="logo">
          <img src={Logo} alt="logo" />
        </div>
        <div className="containerButton">
          <div className="button">
            <Button
              label="S'inscrire"
              onClick={() => navigate("/register")}
              isActive={!isLoginActive} 
            />
          </div>
          <div className="button">
            <Button
              label="Se connecter"
              onClick={() => navigate("/login")}
              isActive={isLoginActive} 
            />
          </div>
        </div>

        <form className="containerForm" onSubmit={handleLogin}>
          <CustomInput
            label="Adresse mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <CustomInput
            label="Mot de passe"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="buttonLog">
            <ButtonLog label="Je me connecte" type="submit" />
          </div>
          {error && <p className="error">{error}</p>}
        </form>
      </div>
    </div>
  );
}

export default Login;
