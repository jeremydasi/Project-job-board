import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/MonCompte.css";

const MonCompte = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  // Function to fetch user information
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token"); // Ensure token is stored and accessible

      if (!token) {
        setError("Utilisateur non connecté. Veuillez vous connecter.");
        navigate("/login");
        return;
      }

      try {
        const response = await fetch("http://localhost:3000/auth/check-session", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
          credentials: "include",
        });

        if (!response.ok) {
          const errorMessage = await response.text();
          console.error("Erreur serveur:", errorMessage);
          setError("Erreur lors de la récupération des informations utilisateur.");
          return;
        }

        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const data = await response.json();
          console.log("Données utilisateur récupérées :", data); // Pour déboguer les données reçues
          
          if (data.loggedIn) {
            setUser(data.user);
          } else {
            setError("Utilisateur non connecté.");
            navigate("/login");
          }
        } else {
          setError("Réponse inattendue du serveur.");
          console.error("Réponse inattendue :", await response.text());
        }
      } catch (error) {
        console.error("Erreur lors de la récupération de l'utilisateur:", error);
        setError("Erreur lors de la récupération des informations utilisateur.");
      }
    };

    fetchUser();
  }, [navigate]);

  // Handle logout
  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      await fetch("http://localhost:3000/auth/logout", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        credentials: "include",
      });
      localStorage.removeItem("token");
      setUser(null);
      navigate("/login");
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem("token");

    // Vérifiez les données utilisateur avant l'envoi
    console.log("Données utilisateur avant envoi :", user);

    try {
        const response = await fetch("http://localhost:3000/auth/update-session", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(user),
            credentials: "include",
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            console.error("Erreur lors de la mise à jour:", errorMessage);
            setError("Erreur lors de la mise à jour des informations.");
        } else {
            const result = await response.json();
            setUser(result.user); // Met à jour l'état avec les nouvelles informations
            alert("Informations mises à jour avec succès !");
        }
    } catch (error) {
        console.error("Erreur lors de la mise à jour des informations utilisateur:", error);
        setError("Erreur lors de la mise à jour des informations.");
    }
};


  // Render error or loading state
  if (error) {
    return <p>{error}</p>;
  }

  if (!user) {
    return <p>Chargement des informations utilisateur...</p>;
  }

  return (
    <div className="mon-compte-container">
      <h1>Mon Compte</h1>
      <div className="profile-section">
        <img src={user.profilePic || "default-profile.jpg"} alt="Profil" className="profile-pic" />
        <div className="user-details">
          <h2>{`${user.user_firstname} ${user.user_lastname}`}</h2>
          <p><strong>Email :</strong> {user.user_email}</p>
          <p><strong>Adresse :</strong> {user.address || "Non renseignée"}</p>
          <p><strong>Téléphone :</strong> {user.phone || "Non renseigné"}</p>
          <p><strong>Bio :</strong> {user.bio || "Aucune biographie fournie"}</p>
        </div>
      </div>

      <div className="edit-section">
        <h3>Mettre à jour vos informations</h3>
        <form className="edit-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nom Complet:</label>
            <input
              type="text"
              value={`${user.user_firstname} ${user.user_lastname}`}
              onChange={(e) => {
                const [firstname, lastname] = e.target.value.split(" ");
                setUser({ ...user, user_firstname: firstname, user_lastname: lastname });
              }}
            />
          </div>

          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={user.user_email}
              onChange={(e) => setUser({ ...user, user_email: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Adresse:</label>
            <input
              type="text"
              value={user.address || ""}
              onChange={(e) => setUser({ ...user, address: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Téléphone:</label>
            <input
              type="tel"
              value={user.phone || ""}
              onChange={(e) => setUser({ ...user, phone: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Bio:</label>
            <textarea
              value={user.bio || ""}
              onChange={(e) => setUser({ ...user, bio: e.target.value })}
            ></textarea>
          </div>

          <button type="submit" className="save-btn">Enregistrer</button>
          <button type="button" onClick={handleLogout} className="logout-btn">Déconnexion</button>
        </form>
      </div>
    </div>
  );
};

export default MonCompte;
