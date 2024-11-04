import express from 'express';
import dbPromise from './database.js';

const router = express.Router();
router.use(express.json()); // Middleware pour parser le JSON des requêtes

// Route pour récupérer tous les jobs
router.get('/jobs', async (req, res) => {
    try {
        const db = await dbPromise; // Attendez que la promesse de base de données soit résolue
        const jobs = await db.all('SELECT * FROM detail_jobs'); // Récupérer tous les jobs
        res.json(jobs); // Retourner les jobs au format JSON
    } catch (err) {
        console.error("Erreur lors de la récupération des offres :", err); // Log l'erreur
        res.status(500).json({ message: "Erreur lors de la récupération des offres." }); // Retourner un message d'erreur
    }
});

// Route pour récupérer tous les jobs
router.get('/admin/jobs', async (req, res) => {
    try {
        const db = await dbPromise;
        const jobs = await db.all('SELECT * FROM detail_jobs'); // Récupérer tous les jobs
        res.json(jobs); // Retourner les jobs au format JSON
    } catch (err) {
        console.error("Erreur lors de la récupération des offres :", err); // Log l'erreur
        res.status(500).json({ message: "Erreur lors de la récupération des offres." }); // Retourner un message d'erreur
    }
});

// Route pour ajouter un job
router.post('/admin/jobs', async (req, res) => {
    const { 
        job_name, 
        name_company, 
        note, // Ajout du champ note
        city, 
        duration, 
        poste_details, 
        address, 
        description_company, 
        description_poste, // Ajout du champ description_poste
        qualifications, 
        skills, 
        languages, 
        additional_expected_domains, // Ajout du champ additional_expected_domains
        additional_information // Ajout du champ additional_information
    } = req.body;

    // Vérifier les champs obligatoires
    if (!job_name || !name_company || !city || !duration || !poste_details || !address ||
        !description_company || !description_poste || !qualifications || !skills || 
        !languages || !additional_expected_domains || !additional_information) {
        return res.status(400).json({ message: "Tous les champs obligatoires doivent être remplis." });
    }

    try {
        const db = await dbPromise;
        const result = await db.run(
            `INSERT INTO detail_jobs (job_name, name_company, note, city, duration, poste_details, address, 
            description_company, description_poste, qualifications, skills, languages, additional_expected_domains, 
            additional_information)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, // Requête SQL pour insérer un nouveau job
            [job_name, name_company, note, city, duration, poste_details, address, 
            description_company, description_poste, qualifications, skills, languages, 
            additional_expected_domains, additional_information] // Paramètres de la requête
        );
        res.status(201).json({ message: "Offre ajoutée avec succès.", id: result.lastID }); // Retourner le nouvel ID
    } catch (err) {
        console.error("Erreur lors de l'ajout de l'offre :", err); // Log l'erreur
        res.status(500).json({ message: "Erreur lors de l'ajout de l'offre." }); // Retourner un message d'erreur
    }
});

// Route pour modifier un job
router.put('/admin/jobs/:id', async (req, res) => {
    const { id } = req.params; // Récupérer l'ID du job à mettre à jour
    const { 
        job_name, 
        name_company, 
        note, // Ajout du champ note
        city, 
        duration, 
        poste_details, 
        address, 
        description_company, 
        description_poste, // Ajout du champ description_poste
        qualifications, 
        skills, 
        languages, 
        additional_expected_domains, // Ajout du champ additional_expected_domains
        additional_information // Ajout du champ additional_information
    } = req.body;

    // Vérifier les champs obligatoires
    if (!job_name || !name_company || !city || !duration || !poste_details || !address ||
        !description_company || !description_poste || !qualifications || !skills || 
        !languages || !additional_expected_domains || !additional_information) {
        return res.status(400).json({ message: "Tous les champs obligatoires doivent être remplis." });
    }

    try {
        const db = await dbPromise;
        const query = `UPDATE detail_jobs SET 
            job_name = ?, 
            name_company = ?, 
            note = ?, 
            city = ?, 
            duration = ?, 
            poste_details = ?, 
            address = ?, 
            description_company = ?, 
            description_poste = ?, 
            qualifications = ?, 
            skills = ?, 
            languages = ?, 
            additional_expected_domains = ?, 
            additional_information = ?
            WHERE id = ?`; // Requête SQL pour mettre à jour un job

        const result = await db.run(query, [
            job_name, 
            name_company, 
            note, 
            city, 
            duration, 
            poste_details, 
            address, 
            description_company, 
            description_poste, 
            qualifications, 
            skills, 
            languages, 
            additional_expected_domains, 
            additional_information, 
            id
        ]); // Exécution de la requête

        if (result.changes === 0) {
            return res.status(404).json({ message: "Offre non trouvée ou déjà mise à jour." }); // Si aucun changement n'est effectué
        }

        res.json({ message: "Offre mise à jour avec succès." }); // Confirmation de la mise à jour
    } catch (err) {
        console.error("Erreur lors de la mise à jour de l'offre :", err); // Log l'erreur
        res.status(500).json({ message: "Erreur lors de la mise à jour de l'offre." }); // Retourner un message d'erreur
    }
});

// Route pour supprimer un job
router.delete('/admin/jobs/:id', async (req, res) => {
    const { id } = req.params; // Récupérer l'ID du job à supprimer

    try {
        const db = await dbPromise;
        const query = `DELETE FROM detail_jobs WHERE id = ?`; // Requête SQL pour supprimer un job
        
        const result = await db.run(query, [id]); // Exécution de la requête

        if (result.changes === 0) {
            return res.status(404).json({ message: "Offre non trouvée ou déjà supprimée." }); // Si aucun changement n'est effectué
        }

        res.json({ message: "Offre supprimée avec succès." }); // Confirmation de la suppression
    } catch (err) {
        console.error("Erreur lors de la suppression de l'offre :", err); // Log l'erreur
        res.status(500).json({ message: "Erreur lors de la suppression de l'offre." }); // Retourner un message d'erreur
    }
});

export default router; // Exporter le routeur
