import express from 'express';
import path from 'path';
import { __dirname } from './config.js';

const router = express.Router(); 

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.get('/job', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'register_job.html')); 
});

router.post('/job', (req, res) => {
    console.log("Données reçues :", req.body); // Affiche les données reçues par le backend

    const {
        job_name, 
        name_company, 
        note, 
        city, 
        duree, 
        description_compagnie, 
        localisation_entreprise, 
        description_poste, 
        qualification, 
        competences, 
        languages, 
        additional_expected_domains, 
        additional_information 
    } = req.body;

    const query = `
        INSERT INTO detail_jobs (
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
            additional_information
        ) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    req.app.locals.db.run(query, [
        job_name, 
        name_company, 
        note, 
        city, 
        duree, 
        description_compagnie, 
        localisation_entreprise, 
        description_poste, 
        qualification, 
        competences, 
        languages, 
        additional_expected_domains, 
        additional_information || ''
    ], function(err) {
        if (err) {
            console.error('Erreur lors de l\'insertion des données :', err.message);
            return res.status(500).send('Erreur lors de l\'enregistrement des données.');
        }
        console.log(`Job ajouté avec l'ID ${this.lastID}`);
        res.send('Job enregistré avec succès.');
    });
});


router.put('/job/:id', (req, res) => {
    const {
        job_name, 
        name_company, 
        note, 
        city, 
        duree, 
        description_compagnie, 
        localisation_entreprise, 
        description_poste, 
        qualification, 
        competences, 
        languages, 
        additional_expected_domains, 
        additional_information
    } = req.body;

    const query = `
        UPDATE detail_jobs 
        SET job_name = ?, 
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
        WHERE id = ?
    `;

    req.app.locals.db.run(query, [
        job_name, 
        name_company, 
        note, 
        city, 
        duree, 
        description_compagnie, 
        localisation_entreprise, 
        description_poste, 
        qualification, 
        competences, 
        languages, 
        additional_expected_domains, 
        additional_information || '',
        req.params.id
    ], function(err) {
        if (err) {
            console.error('Erreur lors de la mise à jour des données :', err.message);
            return res.status(500).send('Erreur lors de la mise à jour des données.');
        }
        console.log(`Job avec l'ID ${req.params.id} mis à jour avec succès`);
        res.send('Job mis à jour avec succès.');
    });
});

router.delete('/job/:id', (req, res) => {
    const query = `DELETE FROM detail_jobs WHERE id = ?`;

    req.app.locals.db.run(query, [req.params.id], function(err) {
        if (err) {
            console.error('Erreur lors de la suppression des données :', err.message);
            return res.status(500).send('Erreur lors de la suppression des données.');
        }
        console.log(`Job avec l'ID ${req.params.id} supprimé avec succès`);
        res.send('Job supprimé avec succès.');
    });
});

export default router;
