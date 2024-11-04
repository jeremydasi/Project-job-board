import React, { createContext, useState } from 'react';

const JobContext = createContext();

export const JobProvider = ({ children }) => {
  const [jobs, setJobs] = useState([]);

  const fetchJobs = async () => {
    try {
      const response = await fetch('http://localhost:3000/jobs');
      if (!response.ok) {
        throw new Error(`Erreur HTTP : ${response.status}`);
      }
      const data = await response.json();
      setJobs(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des emplois :", error);
    }
  };

  const addJob = async (newJob) => {
    try {
      const response = await fetch('http://localhost:3000/jobs', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newJob),
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP : ${response.status}`);
      }
      await fetchJobs(); // Mettre à jour la liste des emplois après ajout
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'emploi :", error);
    }
  };

  const editJob = async (updatedJob) => {
    try {
      const response = await fetch(`http://localhost:3000/jobs/${updatedJob.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedJob),
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP : ${response.status}`);
      }
      await fetchJobs(); // Mettre à jour la liste des emplois après modification
    } catch (error) {
      console.error("Erreur lors de la modification de l'emploi :", error);
    }
  };

  const deleteJob = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/jobs/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP : ${response.status}`);
      }
      await fetchJobs(); // Mettre à jour la liste des emplois après suppression
    } catch (error) {
      console.error("Erreur lors de la suppression de l'emploi :", error);
    }
  };

  return (
    <JobContext.Provider value={{ jobs, fetchJobs, addJob, editJob, deleteJob }}>
      {children}
    </JobContext.Provider>
  );
};

export const useJobs = () => React.useContext(JobContext);
