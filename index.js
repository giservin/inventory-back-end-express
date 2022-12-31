import express from "express";
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";
// untuk koneksi DB
import db from "./config/Database.js";
import SequelizeStore from "connect-session-sequelize";
import UserRoute from "./routes/UserRoute.js";
import ProductRoute from "./routes/ProductRoute.js";
import AuthRoute from "./routes/AuthRoute.js";
dotenv.config();

const app = express();

const sessionStore = SequelizeStore(session.Store);

const store = new sessionStore({
    db
});

// sync dgn database, untuk membuat table yg telah di define ke SQL lewat Sequelize (dgn method sync()), koneksinya krn node js maka merupakan asynchronous
(async ()=>{
    await db.sync();
})();

// define session
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store,
    cookie: {
        secure: 'auto',
    }
}))
// cookies , secure nya klo true https, klo false http, cuman bisa nilai 'auto' buat detect protocol nya

app.use(cors(
    {
        credentials: true,
        origin: `${process.env.FRONTEND_URL}:${process.env.FRONTEND_PORT}`
    }
))
// dalam cors, credentials true agar front end dapat mengirimkan request besertakan cookies dgn credential nya
// origin untuk , domain apa yg dibolehkan untuk akses API ini (disini pake domain frontend, klo mau banyak bisa make array)

// Menerima data yg dikirimkan API sebagai json
app.use(express.json());
// apply route
app.use(UserRoute);
app.use(ProductRoute);
app.use(AuthRoute);

// sync untuk membuat table session
store.sync();

// port ambil dri .env
app.listen(process.env.APP_PORT, () => {
    console.log(`Server up and running on port ${process.env.APP_PORT}`);
})