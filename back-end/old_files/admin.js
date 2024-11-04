const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

const app = express();
const db = new sqlite3.Database("./users.db");

app.use(cors());
app.use(express.json());

// Récupérer tous les emplois
app.get("/api/jobs", (req, res) => {
  db.all("SELECT * FROM detail_jobs", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Ajouter un nouvel emploi
app.post("/api/jobs", (req, res) => {
  const { job_name, name_company, city, duration, poste_details, address, description_company, qualifications, skills, languages } = req.body;
  const sql = `INSERT INTO detail_jobs (job_name, name_company, city, duration, poste_details, address, description_company, qualifications, skills, languages) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  
  db.run(sql, [job_name, name_company, city, duration, poste_details, address, description_company, qualifications, skills, languages], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ id: this.lastID });
  });
});

// Modifier un emploi
app.put("/api/jobs/:id", (req, res) => {
  const { job_name, name_company, city, duration, poste_details, address, description_company, qualifications, skills, languages } = req.body;
  const sql = `UPDATE detail_jobs SET job_name = ?, name_company = ?, city = ?, duration = ?, poste_details = ?, address = ?, description_company = ?, qualifications = ?, skills = ?, languages = ? WHERE id = ?`;
  
  db.run(sql, [job_name, name_company, city, duration, poste_details, address, description_company, qualifications, skills, languages, req.params.id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ id: req.params.id });
  });
});

// Supprimer un emploi
app.delete("/api/jobs/:id", (req, res) => {
  db.run("DELETE FROM detail_jobs WHERE id = ?", req.params.id, function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ deleted: this.changes });
  });
});

// Démarrer le serveur
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Serveur en cours d'exécution sur http://localhost:${PORT}`);
});
