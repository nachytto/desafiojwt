const { Pool } = require("pg");
const bcrypt = require('bcrypt');

const pool = new Pool({
    host: "localhost",
    user: "postgres",
    password: "123",
    database: "softjobs",
});


const getJobs = async () => {
    const { rows: usuarios } = await pool.query("SELECT * FROM usuarios");
    return usuarios;
};

const agregarUser = async ({ email, password, rol, lenguage }) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = "INSERT INTO usuarios(email, password, rol, lenguage) VALUES ($1, $2, $3, $4) RETURNING *";
    const values = [email, hashedPassword, rol, lenguage];
    const result = await pool.query(query, values);
    return result.rows[0];
};

const verificar = async (email, password) => {
    const query = "SELECT * FROM usuarios WHERE email = $1";
    const { rows, rowCount } = await pool.query(query, [email]);
    
    if (!rowCount) {
        throw {
            code: 404,
            message: "Usuario no encontrado",
        };
    }

    const usuario = rows[0];

    const passwordMatch = await bcrypt.compare(password, usuario.password);
    if (!passwordMatch) {
        throw {
            code: 401,
            message: "Contraseña incorrecta",
        };
    }
};

module.exports = { getJobs, verificar, agregarUser };