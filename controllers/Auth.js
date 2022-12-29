import Users from "../models/UserModel.js";
import argon2 from "argon2";

// function login
export const Login = async (req, res) => {
    try {
        const user = await Users.findOne({
            where: {
                email: req.body.email
            }
        });
        if(!user) return res.status(404).json({msg: "User Not Found!"});
        // verify password, param pertama adalah password di DB, param kedua adalah yg dikirimkan
        const match = await argon2.verify(user.password, req.body.password);
        if(!match) return res.status(400).json({msg: "Wrong Password"});
        // jika passwod bener maka user akan diberi session
        req.session.userId = user.uuid;
        const { uuid, name, email, role } = user
        res.status(200).json({uuid,name,email,role});
    } catch(err) {
        res.status(400).json({msg: err.message});
    }

}

// ngecek apakah user punya session login
export const Me = async (req, res) => {
    if(!req.session.userId) {
        return res.status(401).json({msg: ""});
    }
    const user = await Users.findOne({
        attributes: ["uuid", "name", "email", "role"],
        where: {
            uuid: req.session.userId
        }
    });
    if(!user) return res.status(404).json({msg: "User Not Found!"});
    res.status(200).json(user);
}

export const Logout = (req,res) => {
    // hapus session, dgn callback parameter error klo gagal hapus session
    req.session.destroy((error)=>{
        if(error) return res.status(400).json({msg: "Can't log out"});
        res.status(200).json({msg: "Successfully Logged out"});
    });
}