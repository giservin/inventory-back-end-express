import Products from "../models/ProductModel.js";
import Users from "../models/UserModel.js";
import {Op} from "sequelize";

export const getProducts = async (req,res) => {
    try {
        let response;
        if(req.role === "admin") {
            // req.role berasal dari middleware
            response = await Products.findAll({
                attributes: ['uuid', 'name', 'price'],
                include:[{
                    model: Users,
                    attributes: ['name', 'email']
                }]
            });
            // findAll disini menyertakan User didalam table Product krn ada relasi nya(nge-JOIN )
        } else {
            response = await Products.findAll({
                attributes: ['uuid', 'name', 'price'],
                where: {
                    userId: req.userId
                },
                include:[{
                    model: Users,
                    attributes: ['name', 'email']
                }]
            });
        }
        res.status(200).json(response);
    } catch(err) {
        res.status(500).json({msg: err.message});
    }
}

export const getProductById = async (req,res) => {
    try {
        const product = await Products.findOne({
            where: {
                uuid: req.params.id
            }
        });
        if(!product) return res.status(404).json({msg: "Produk tidak ditemukan"});
        let response;
        if(req.role === "admin") {
            // req.role berasal dari middleware
            response = await Products.findOne({
                attributes: ['uuid', 'name', 'price'],
                where: {
                    id: product.id
                },
                include:[{
                    model: Users,
                    attributes: ['name', 'email']
                }]
            });
            // findAll disini menyertakan User didalam table Product krn ada relasi nya(nge-JOIN )
        } else {
            response = await Products.findOne({
                attributes: ['uuid', 'name', 'price'],
                where: {
                    [Op.and]:[{id: product.id},{userId: req.userId}]
                },
                include:[{
                    model: Users,
                    attributes: ['name', 'email']
                }]
            });
        }
        if(!response) return res.status(404).json({msg: "Product not found"})
        res.status(200).json(response);
    } catch(err) {
        res.status(500).json({msg: err.message});
    }
}

export const addProduct = async (req,res) => {
    const {name, price} = req.body;
    try {
        await Products.create({
            name,
            price,
            userId: req.userId
        });
        res.status(201).json({msg: "Product berhasil ditambahkan"});
    } catch(err) {
        res.status(500).json({msg: err.message});
    }
}

export const updateProduct = async (req,res) => {
    try {
        const product = await Products.findOne({
            where: {
                uuid: req.params.id
            }
        });
        if(!product) return res.status(404).json({msg: "Produk tidak ditemukan"});

        const {name, price} = req.body;
        if(req.role === "admin") {
            await Products.update({name, price}, {
                where: {
                    id: product.id
                }
            });
        } else {
            if(req.userId !== product.userId) return res.status(403).json({msg: "Forbidden Access"});
            await Products.update({name, price}, {
                where: {
                    [Op.and]:[{id: product.id},{userId: req.userId}]
                }
            });
        }
        res.status(200).json({msg: "Product Successfully Updated!"});
    } catch(err) {
        res.status(500).json({msg: err.message});
    }
}

export const deleteProduct = async (req,res) => {
    try {
        const product = await Products.findOne({
            where: {
                uuid: req.params.id
            }
        });
        if(!product) return res.status(404).json({msg: "Produk tidak ditemukan"});

        if(req.role === "admin") {
            await Products.destroy({
                where: {
                    id: product.id
                }
            });
        } else {
            if(req.userId !== product.userId) return res.status(403).json({msg: "Forbidden Access"});
            await Products.destroy({
                where: {
                    [Op.and]:[{id: product.id},{userId: req.userId}]
                }
            });
        }
        res.status(200).json({msg: "Product Successfully Deleted!"});
    } catch(err) {
        res.status(500).json({msg: err.message});
    }
}