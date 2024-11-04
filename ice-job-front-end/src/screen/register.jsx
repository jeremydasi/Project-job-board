import React, { useState } from "react";
import "../styles/register.css";
import Logo from "../assets/logo-ice-job.svg";
import Button from "../components/button";
import ButtonLog from "../components/button/buttonLog";
import { useNavigate } from "react-router-dom";
import CustomInput from "../components/customInput";
import CheckList from "../components/checkList";

function Register() {
  const navigate = useNavigate();

  const [prenom, setPrenom] = useState("");
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localisation, setLocalisation] = useState("");
  const [contracts, setContracts] = useState([]);
  const [error, setError] = useState(null);

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/auth/client", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prenom,
          nom,
          email,
          password,
          localisation,
          type_contract: contracts.join(", "),
        }),
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        alert(data.message);
        navigate("/login");
      } else {
        const data = await response.json();
        setError(data.message || "Erreur lors de l'inscription.");
      }
    } catch (err) {
      console.error("Erreur lors de l'inscription:", err);
      setError("Une erreur est survenue. Veuillez réessayer.");
    }
  };

  const isRegisterActive = window.location.pathname === "/register";

  return (
    <div className="containerPageRegister">
      <div className="containerRegister">
        <div className="logo">
          <img src={Logo} alt="logo" />
        </div>

        <div className="containerButton">
          <div className="button">
            <Button
              label="S'inscrire"
              onClick={() => navigate("/register")}
              isActive={isRegisterActive}
            />
          </div>
          <div className="button">
            <Button label="Se connecter" onClick={() => navigate("/login")} />
          </div>
        </div>

        <form className="containerFormRegister" onSubmit={handleRegister}>
          <div className="containerInputRegister">
            <CustomInput
              label="Prénom"
              value={prenom}
              onChange={(e) => {setPrenom(e.target.value);
              }}
            />
            <CustomInput
              label="Nom"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
            />
          </div>

          <div className="containerInputRegister">
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
          </div>

          <div className="containerInputRegister">
            <CustomInput
              label="Métier recherché"
              placeholder="Chef de projet, vendeur, comptable ..."
            />
            <CustomInput
              label="Localité(s) recherchée(s)"
              placeholder="Ville, département, région"
              value={localisation}
              onChange={(e) => setLocalisation(e.target.value)}
            />
          </div>

          <div className="contract">
            <p className="title">Type(s) de contrat</p>

            <CheckList onContractsChange={setContracts} />

            <div className="buttonLog">
              <ButtonLog label="Je m'inscris" type="submit" />
            </div>

            {error && <p className="error">{error}</p>}
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
