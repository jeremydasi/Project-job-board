import React, { useEffect, useState } from "react";
import axios from "axios"; // Assurez-vous qu'Axios est installé
import { useNavigate } from "react-router-dom";
import "../styles/Admin.css"; // Assurez-vous que ce chemin est correct

const AdminPage = () => {
  const navigate = useNavigate();
  
  // State pour la liste des jobs, la création d'un nouveau job et la modification d'un job
  const [jobs, setJobs] = useState([]);
  const [newJob, setNewJob] = useState({
    job_name: "",
    name_company: "",
    note: "", // Ajout de champ note
    city: "",
    duration: "",
    poste_details: "",
    address: "",
    description_company: "",
    description_poste: "", // Ajout de champ description_poste
    qualifications: "",
    skills: "",
    languages: "",
    additional_expected_domains: "", // Ajout de champ additional_expected_domains
    additional_information: "", // Ajout de champ additional_information
  });
  const [editJobId, setEditJobId] = useState(null); // ID du job à modifier

  // Chargement des jobs lors du montage du composant
  useEffect(() => {
    fetchJobs();
  }, []);

  // Fonction pour rafraîchir la liste des jobs
  const fetchJobs = async () => {
    try {
      const response = await axios.get("http://localhost:3000/admin/jobs"); // Corrected API endpoint
      setJobs(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des offres :", error);
    }
  };

  // Ajout ou modification d'un job
  const handleSaveJob = async () => {
    try {
      // Validation des champs obligatoires
      if (!newJob.job_name || !newJob.name_company || !newJob.city || !newJob.duration ||
          !newJob.poste_details || !newJob.address || !newJob.description_company ||
          !newJob.description_poste || !newJob.qualifications || !newJob.skills ||
          !newJob.languages || !newJob.additional_expected_domains || !newJob.additional_information) {
        alert("Veuillez remplir tous les champs obligatoires !");
        return;
      }

      if (editJobId) {
        // Mise à jour d'un job existant
        await axios.put(`http://localhost:3000/admin/jobs/${editJobId}`, newJob);
      } else {
        // Création d'un nouveau job
        await axios.post("http://localhost:3000/admin/jobs", newJob);
      }

      // Réinitialiser les champs du formulaire et recharger la liste des jobs
      resetForm();
      await fetchJobs();
    } catch (error) {
      console.error("Erreur lors de l'enregistrement de l'emploi :", error);
    }
  };

  // Réinitialiser le formulaire
  const resetForm = () => {
    setNewJob({
      job_name: "",
      name_company: "",
      note: "",
      city: "",
      duration: "",
      poste_details: "",
      address: "",
      description_company: "",
      description_poste: "",
      qualifications: "",
      skills: "",
      languages: "",
      additional_expected_domains: "",
      additional_information: "",
    });
    setEditJobId(null);
  };

  // Prépare le formulaire pour la modification
  const handleEditJob = (job) => {
    setNewJob(job);
    setEditJobId(job.id);
  };

  // Supprime un job
  const handleDeleteJob = async (id) => {
    try {
      if (window.confirm("Êtes-vous sûr de vouloir supprimer cet emploi ?")) {
        await axios.delete(`http://localhost:3000/admin/jobs/${id}`);
        await fetchJobs();
      }
    } catch (error) {
      console.error("Erreur lors de la suppression de l'emploi :", error);
    }
  };

  return (
    <div className="admin-container">
      <h1>Admin - Gestion des Offres d'Emploi</h1>

      {/* Formulaire d'ajout ou de modification d'un job */}
      <div className="add-job-form">
        <h2>{editJobId ? "Modifier l'Offre" : "Ajouter une Nouvelle Offre"}</h2>
        <input
          type="text"
          placeholder="Titre du poste *"
          value={newJob.job_name}
          onChange={(e) => setNewJob({ ...newJob, job_name: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Entreprise *"
          value={newJob.name_company}
          onChange={(e) => setNewJob({ ...newJob, name_company: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Note"
          value={newJob.note}
          onChange={(e) => setNewJob({ ...newJob, note: e.target.value })}
        />
        <input
          type="text"
          placeholder="Lieu *"
          value={newJob.city}
          onChange={(e) => setNewJob({ ...newJob, city: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Durée *"
          value={newJob.duration}
          onChange={(e) => setNewJob({ ...newJob, duration: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Détails du poste *"
          value={newJob.poste_details}
          onChange={(e) => setNewJob({ ...newJob, poste_details: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Adresse *"
          value={newJob.address}
          onChange={(e) => setNewJob({ ...newJob, address: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Description de l'entreprise *"
          value={newJob.description_company}
          onChange={(e) => setNewJob({ ...newJob, description_company: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Description du poste *"
          value={newJob.description_poste}
          onChange={(e) => setNewJob({ ...newJob, description_poste: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Qualifications *"
          value={newJob.qualifications}
          onChange={(e) => setNewJob({ ...newJob, qualifications: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Compétences *"
          value={newJob.skills}
          onChange={(e) => setNewJob({ ...newJob, skills: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Langues *"
          value={newJob.languages}
          onChange={(e) => setNewJob({ ...newJob, languages: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Domaines supplémentaires attendus *"
          value={newJob.additional_expected_domains}
          onChange={(e) => setNewJob({ ...newJob, additional_expected_domains: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Informations supplémentaires *"
          value={newJob.additional_information}
          onChange={(e) => setNewJob({ ...newJob, additional_information: e.target.value })}
          required
        />
        <button onClick={handleSaveJob}>
          {editJobId ? "Enregistrer les modifications" : "Ajouter l'Offre"}
        </button>
      </div>

      {/* Liste des jobs */}
      <div className="job-list-section">
        <h2>Liste des Offres</h2>
        <table className="job-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Titre</th>
              <th>Entreprise</th>
              <th>Lieu</th>
              <th>Durée</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job.id}>
                <td>{job.id}</td>
                <td>{job.job_name}</td>
                <td>{job.name_company}</td>
                <td>{job.city}</td>
                <td>{job.duration}</td>
                <td>
                  <button onClick={() => handleEditJob(job)}>Modifier</button>
                  <button onClick={() => handleDeleteJob(job.id)}>Supprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPage;
