CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    user_firstname VARCHAR(255) NOT NULL,
    user_lastname VARCHAR(255) NOT NULL,
    user_email VARCHAR(255) NOT NULL UNIQUE,
    password TEXT NOT NULL,
    user_place TEXT NOT NULL,
    type_contract VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS detail_jobs (
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    job_name VARCHAR(255) NOT NULL,
    name_company VARCHAR(255) NOT NULL,
    note VARCHAR(255),
    city VARCHAR(255) NOT NULL,
    duration TEXT NOT NULL,
    poste_details TEXT NOT NULL,
    address TEXT NOT NULL,
    description_company TEXT NOT NULL,
    description_poste TEXT NOT NULL,
    qualifications TEXT NOT NULL,
    skills VARCHAR(255) NOT NULL,
    languages VARCHAR(255) NOT NULL,
    additional_expected_domains TEXT NOT NULL,
    additional_information TEXT NOT NULL,
    user_id INTEGER,
    entreprise_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (entreprise_id) REFERENCES entreprise (id)
);

CREATE TABLE IF NOT EXISTS propositions (
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    description_poste TEXT NOT NULL,
    salary VARCHAR(255),
    publication_date VARCHAR(255) NOT NULL,
    administrateur_id INTEGER,
    FOREIGN KEY (administrateur_id) REFERENCES administrateur (id)
);

CREATE TABLE IF NOT EXISTS administrateur (
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    admin_firstname VARCHAR(255) NOT NULL,
    admin_lastname VARCHAR(255) NOT NULL,
    admin_mail VARCHAR(255) NOT NULL,
    admin_password VARCHAR(255) NOT NULL,
    name_company VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS resumes (
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_type VARCHAR(50) NOT NULL,
    file_path TEXT NOT NULL,
    upload_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    user_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES users (id)
);

SELECT
    dj.job_name,
    dj.name_company,
    dj.description_company,
    p.description_poste,
    p.salary,
    p.publication_date,
    a.admin_firstname,
    a.admin_lastname
FROM detail_jobs dj
JOIN propositions p ON dj.entreprise_id = p.administrateur_id
JOIN administrateur a ON p.administrateur_id = a.id;

SELECT 
    dj.job_name,
    dj.name_company,
    dj.city,
    dj.duration,
    dj.poste_details,
    dj.address,
    dj.description_company,
    dj.qualifications,
    dj.skills,
    dj.languages,
    dj.additional_information,
    a.admin_firstname,
    a.admin_lastname,
    a.admin_mail
FROM detail_jobs dj
JOIN administrateur a ON dj.name_company = a.name_company;