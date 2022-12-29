// buat konfigurasi Database
import {Sequelize} from "sequelize";

// Sequelize disini dipakai untuk koneksi ke DB, parameter nya berupa (namaDB, username, password)
const db = new Sequelize('auth_db', process.env.DB_USERNAME, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: "mysql"
});

export default db;