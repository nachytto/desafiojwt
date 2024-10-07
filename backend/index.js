
const jwt = require("jsonwebtoken");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { verificarToken } = require("./middleware");
const { getJobs, verificar, agregarUser } = require("./consultas");

const app = express();
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true 
}));
app.use(express.json());
app.use(cookieParser()); 


app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.code || 500).json({ error: err.message || "Internal Server Error" });
});

const JWT_SECRET_KEY = "6K!U7ñxiYk7T7PQ7pZ$Aa~Y2";


app.listen(3000, () => console.log("SERVER ON"));

app.get("/usuarios", verificarToken, async (req, res) => {
    try {
        const usuarios = await getJobs();
        res.json(usuarios);
    } catch (error) {
        res.status(error.code || 500).send(error);
    }
});

app.post("/usuarios", async (req, res) => {
    const { email, password, rol, lenguage } = req.body;

    if (!email || !password || !rol || !lenguage) {
        return res.status(400).json({ message: "Todos los campos son requeridos." });
    }

    try {
        await agregarUser(req.body);
        res.status(201).json({ message: 'Usuario agregado correctamente' });
    } catch (error) {
        res.status(error.code || 500).send(error);
    }
});

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        await verificar(email, password);
        const token = jwt.sign({ email }, JWT_SECRET_KEY, { expiresIn: '1h' });
        res.json({ token, message: "Autenticado correctamente" });
    } catch (error) {
        console.log(error);
        res.status(error.code || 500).send(error);
    }
});
