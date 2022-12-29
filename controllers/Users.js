import Users from "../models/UserModel.js";
import argon2 from "argon2";

export const getUsers = async (req,res) => {
    try {
        // findAll untuk SELECT * dari SQL DB
        const response = await Users.findAll({
            attributes: ['uuid', 'name', 'email', 'role']
        });
        res.status(200).json(response);
    } catch(err) {
        res.status(500).json({msg: err.message});
    }
}

export const getUserById = async (req,res) => {
    try {
        const response = await Users.findOne({
            attributes: ['uuid', 'name', 'email', 'role'],
            where: {
                uuid: req.params.id
            }
        });
        res.status(200).json(response);
    } catch(err) {
        res.status(500).json({msg: err.message});
    }
}

export const addUser = async (req,res) => {
    const {name, email, password, confirmPassword, role} = req.body;
    if(password !== confirmPassword) return res.status(400).json({msg: "Konfirmasi Password tidak sesuai"});
    const hashPassword = await argon2.hash(password);
    try {
        await Users.create({
            name,
            email,
            password: hashPassword,
            role
        });
        // 201 adalah status created
        res.status(201).json({msg: "Register Berhasil"});
    } catch(err) {
        res.status(400).json({msg: err.message});
    }
}

export const updateUser = async (req,res) => {
    const user = await Users.findOne({
        where: {
            uuid: req.params.id
        }
    });
    if(!user) return res.status(404).json({msg: "User Not Found!"});
    const {name, email, password, confirmPassword, role} = req.body;
    let hashPassword;
    if(password === "" || password === null) {
        hashPassword = user.password;
    } else {
        hashPassword = await argon2.hash(password);
    }
    if(password !== confirmPassword) return res.status(400).json({msg: "Konfirmasi Password tidak sesuai"});
    try {
        await Users.update({
            name,
            email,
            password: hashPassword,
            role
        }, {
            where: {
                id: user.id
            }
        });
        // 201 adalah status created
        res.status(200).json({msg: "User Updated"});
    } catch(err) {
        res.status(400).json({msg: err.message});
    }
}

export const deleteUser = async (req,res) => {
    const user = await Users.findOne({
        where: {
            uuid: req.params.id
        }
    });
    if(!user) return res.status(404).json({msg: "User Not Found!"});
    try {
        await Users.destroy({
            where: {
                id: user.id
            }
        });
        // 201 adalah status created
        res.status(200).json({msg: "User Deleted"});
    } catch(err) {
        res.status(400).json({msg: err.message});
    }
}