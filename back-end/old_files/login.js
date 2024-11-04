import express from "express";
import bcrypt from "bcrypt";
import Database from "better-sqlite3";
import cookieParser from "cookie-parser";
import session from "express-session";

const router = express.Router();
const db = new Database("users.db");

router.use(express.json());
router.use(express.urlencoded({ extended: true }));
router.use(cookieParser());

router.use(
  session({
    secret: process.env.SESSION_SECRET || "votre_secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

const authenticateSession = (req, res, next) => {
  if (req.session.user) return next();
  return res
    .status(401)
    .json({ message: "Accès non autorisé. Veuillez vous connecter." });
};

router.get("/users", authenticateSession, (req, res) => {
  try {
    const stmt = db.prepare("SELECT * FROM users");
    const users = stmt.all();

    if (users.length === 0) {
      return res.status(404).json({ message: "Aucun utilisateur trouvé." });
    }

    res.json(users);
  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs:", error);
    res.status(500).json({ message: "Erreur interne du serveur." });
  }
});

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

router.get("/insert-test-user", async (req, res) => {
  const email = "papa@example.com";
  const password = "ma_fille";
  const saltRounds = 10;

  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    for (let attempts = 0; attempts < 1000; attempts++) {
      try {
        db.prepare(
          "INSERT INTO users (user_firstname, user_lastname, user_email, password, user_place, type_contract) VALUES (?, ?, ?, ?, ?, ?)"
        ).run("Test", "User", email, hashedPassword, 2, 2);

        return res.status(200).json({
          message: "Utilisateur de test inséré avec succès.",
          hashedPassword,
        });
      } catch (err) {
        if (err.code === "SQLITE_BUSY") {
          console.warn("Base de données occupée, nouvel essai dans 100 ms...");
          await sleep(100);
        } else {
          console.error("Erreur lors de l'insertion:", err);
          return res
            .status(500)
            .json({ message: "Erreur lors de l'insertion de l'utilisateur." });
        }
      }
    }

    return res
      .status(500)
      .json({ message: "Base de données occupée après plusieurs essais." });
  } catch (err) {
    console.error("Erreur lors du hachage du mot de passe:", err);
    res.status(500).json({ message: "Erreur interne." });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = db
      .prepare("SELECT * FROM users WHERE user_email = ?")
      .get(email);
    if (!user)
      return res.status(401).json({ message: "Identifiants incorrects." });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
      req.session.user = { id: user.id, email: user.user_email };
      res.json({ message: "Connexion réussie", user: req.session.user });
    } else {
      res.status(401).json({ message: "Identifiants incorrects." });
    }
  } catch (error) {
    console.error("Erreur lors de la connexion:", error);
    res.status(500).json({ message: "Erreur interne du serveur." });
  }
});

router.get("/", authenticateSession, (req, res) => {
  res.send(`<h1>Bienvenue, ${req.session.user.email}!</h1>`);
});

router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err)
      return res
        .status(500)
        .json({ message: "Erreur lors de la déconnexion." });
    res.clearCookie("connect.sid");
    res.status(200).json({ message: "Déconnexion réussie." });
  });
});

router.get("/check-session", (req, res) => {
  if (req.session.user) {
    res.json({ user: req.session.user });
  } else {
    res.status(401).json({ message: "Non connecté" });
  }
});

export default router;
