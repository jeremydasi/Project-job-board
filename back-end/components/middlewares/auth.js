// middlewares/auth.js
import jwt from 'jsonwebtoken';
const SECRET_KEY = 'votre_clef_secrete';

export const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) return res.sendStatus(403);

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

export const isAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') return res.sendStatus(403);
  next();
};
