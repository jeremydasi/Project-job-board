import React, { useState, useEffect } from "react";
import "../styles/fav.css";

const Fav = () => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(storedFavorites);
  }, []);

  return (
    <div>
      <div className="fav-container">
        <h2>Vos Emplois Favoris</h2>
        {favorites.length === 0 ? (
          
            <p className="fav-empty-message">
              Aucun emploi ajouté aux favoris pour l'instant.
            </p>
          
        ) : (
          <div className="fav-list">
            {favorites.map((job) => (
              <div key={job.id} className="fav-job">
                <h3>{job.title}</h3>
                <p>
                  <strong>Entreprise:</strong> {job.company}
                </p>
                <p>
                  <strong>Lieu:</strong> {job.location}
                </p>
                <p>
                  <strong>Durée:</strong> {job.duration}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Fav;