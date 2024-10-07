
const jwt = require("jsonwebtoken");
const JWT_SECRET_KEY = "6K!U7ñxiYk7T7PQ7pZ$Aa~Y2";


const verificarToken = (req, res, next) => {

    const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];
    console.log("Token recibido:", token); 

    if (!token) {
        return res.status(403).json({ message: "Token no proporcionado" });
    }

    jwt.verify(token, JWT_SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "Token inválido" });
        }

        req.user = decoded; 
        next(); 
    });
};

module.exports = { verificarToken };
