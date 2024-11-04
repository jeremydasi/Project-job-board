import React, { createContext, useContext, useState } from "react";

// Créer le contexte
const JobContext = createContext();

// Hook pour utiliser le contexte
export const useJobs = () => {
  return useContext(JobContext);
};

// Provider du contexte
export const JobProvider = ({ children }) => {
  const [jobs, setJobs] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // État d'authentification

  const fetchJobs = async () => {
    // Récupérer les emplois (remplacez par votre logique)
    const response = await fetch("/api/jobs");
    const data = await response.json();
    setJobs(data);
  };

  const addJob = async (newJob) => {
    // Ajouter un nouvel emploi (remplacez par votre logique)
    const response = await fetch("/api/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newJob),
    });
    const data = await response.json();
    setJobs((prevJobs) => [...prevJobs, data]);
  };

  const editJob = async (updatedJob) => {
    // Modifier un emploi (remplacez par votre logique)
    const response = await fetch(`/api/jobs/${updatedJob.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedJob),
    });
    const data = await response.json();
    setJobs((prevJobs) =>
      prevJobs.map((job) => (job.id === data.id ? data : job))
    );
  };

  const deleteJob = async (id) => {
    // Supprimer un emploi (remplacez par votre logique)
    await fetch(`/api/jobs/${id}`, { method: "DELETE" });
    setJobs((prevJobs) => prevJobs.filter((job) => job.id !== id));
  };

  const login = async (username, password) => {
    // Logique de connexion
    // Remplacez ceci par votre logique d'authentification
    if (username === "admin" && password === "password") {
      setIsAuthenticated(true);
    } else {
      throw new Error("Invalid credentials");
    }
  };

  const value = {
    jobs,
    fetchJobs,
    addJob,
    editJob,
    deleteJob,
    isAuthenticated,
    login,
  };

  return <JobContext.Provider value={value}>{children}</JobContext.Provider>;
};
