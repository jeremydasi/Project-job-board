import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../styles/section.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as filledStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as emptyStar } from "@fortawesome/free-regular-svg-icons";
import { Link } from "react-router-dom";

const HomePage = ({ searchTerm = "" }) => {
  const [isStarred, setIsStarred] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      const token = localStorage.getItem("token"); // Récupère le token d'authentification

      if (!token) {
        setError("Vous devez être authentifié pour accéder à cette ressource.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get("http://localhost:3000/jobs", {
          headers: {
            Authorization: `Bearer ${token}`, // Ajout du token dans les en-têtes
          },
        });

        setJobs(response.data);
        if (response.data.length > 0) {
          setSelectedJob(response.data[0]);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des emplois:", error);
        if (error.response && error.response.status === 401) {
          setError("Accès non autorisé. Veuillez vérifier vos identifiants.");
        } else {
          setError("Erreur lors de la récupération des emplois. Veuillez réessayer.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    if (selectedJob) {
      const isJobFavorited = favorites.some((fav) => fav.id === selectedJob.id);
      setIsStarred(isJobFavorited);
    }
  }, [selectedJob]);

  const handleStarClick = () => {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    if (isStarred) {
      const updatedFavorites = favorites.filter((fav) => fav.id !== selectedJob.id);
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    } else {
      favorites.push(selectedJob);
      localStorage.setItem("favorites", JSON.stringify(favorites));
    }

    setIsStarred(!isStarred);
  };

  const handleJobClick = (job) => {
    setSelectedJob(job);
  };

  const normalizeString = (str) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  };

  const filteredJobs = jobs.filter((job) => {
    if (!searchTerm) return true;
    const normalizedSearchTerm = normalizeString(searchTerm);

    return (
      normalizeString(job.job_name).includes(normalizedSearchTerm) ||
      normalizeString(job.name_company).includes(normalizedSearchTerm) ||
      normalizeString(job.city).includes(normalizedSearchTerm)
    );
  });

  return (
    <div className="home-container">
      <div className="job-list-section">
        <div className="header">
          <p>
            <a href="/upload">Publier son CV</a> - Laissez les employeurs vous trouver
          </p>
          <hr />
          <p>
            Emplois : <span className="location">Lieu</span>
          </p>
          <p>
            Trier par : <span className="sort">intitulé du poste</span>
          </p>
          <p>
            Nombre d'emplois : <span className="job-count">{filteredJobs.length}</span>
          </p>
        </div>

        {error && <p className="error-message">{error}</p>}

        {loading ? (
          <p>Chargement des emplois...</p>
        ) : (
          <div className="job-list">
            {filteredJobs.length === 0 ? (
              <p>Aucun emploi trouvé pour "{searchTerm}"</p>
            ) : (
              filteredJobs.map((job) => (
                <div
                  key={job.id}
                  className={`job-item ${selectedJob && selectedJob.id === job.id ? "selected" : ""}`}
                  onClick={() => handleJobClick(job)}
                >
                  {job.job_name}
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {selectedJob && (
        <div className="job-details-section">
          <div className="job-header">
            <h2>{selectedJob.job_name}</h2>
            <p>
              <strong>
                <u>{selectedJob.name_company}</u>:
              </strong>{" "}
              🌍 •{" "}
              <FontAwesomeIcon
                icon={isStarred ? filledStar : emptyStar}
                onClick={handleStarClick}
                style={{
                  cursor: "pointer",
                  color: isStarred ? "gold" : "gray",
                }}
              />
            </p>
            <p>
              <strong>Lieu :</strong> {selectedJob.city}
            </p>
            <p>
              <strong>Durée :</strong> {selectedJob.duration}
            </p>
            <div className="apply-section">
              <Link to="/postule" className="apply-btn">Postuler maintenant</Link>
            </div>
          </div>

          <div className="job-details">
            <div className="section">
              <h3>Détails du Poste</h3>
              <p>
                <strong>Type de Poste :</strong> {selectedJob.duration}
              </p>
              <p>
                <strong>Lieu :</strong> {selectedJob.address}
              </p>
            </div>

            <div className="section">
              <h3>Détails de l'Entreprise</h3>
              <p>{selectedJob.description_company}</p>
            </div>

            <div className="section">
              <h3>Description du Poste</h3>
              <p>{selectedJob.description_poste}</p>
            </div>

            <div className="section">
              <h3>Qualifications</h3>
              <p>{selectedJob.qualifications}</p>
            </div>

            <div className="section">
              <h3>Maîtrise des domaines suivants</h3>
              <div className="skills-section">
                <div className="skills">
                  <h4>Compétences</h4>
                  <p>{selectedJob.skills}</p>
                </div>
                <div className="languages">
                  <h4>Langages</h4>
                  <p>{selectedJob.languages}</p>
                </div>
              </div>
            </div>

            <div className="section">
              <h3>Informations supplémentaires</h3>
              <p>{selectedJob.additional_information}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
