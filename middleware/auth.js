const jwt = require("jsonwebtoken");
require("dotenv").config();

function auth(req, res, next) {
  // token qui autentifie une requete (dans le header) pour savoir si il s'agit bien d'un Admin
  const token = req.header("x-auth-token");
  // si il n'ya pas de token
  if (!token) return res.status(401).send("Accès refusé. Non connecté...");
  try {
    const jwtSecretKey = process.env.JWT_SECRET_KEY;
    const decoded = jwt.verify(token, jwtSecretKey);
    req.user = decoded;
    next();
  } catch (ex) {
    // si le token est invalide
    res.status(400).send("Token d'autentification invalide...");
  }
}

const isAdmin = (req, res, next) => {
  auth(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      res.status(403).send("Vous n'avez pas l'autorisation ...");
    }
  });
};

module.exports = { auth, isAdmin };
