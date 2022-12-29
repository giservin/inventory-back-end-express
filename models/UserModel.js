import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const {DataTypes} = Sequelize;

// define untuk membuat Schema / Model pada Sequlieze
// objekSequelize.define(namatable, field, option)
// optionnya bisa menggunakan freezeTableName = true
// cth pendeklarasian field di Sequelize, perlu mengambil properti DataTypes dri objek Sequilize:
    // namaField: {type: DataTypes.STRING}
    // defaultValue: DataTypes.UUIDV4 (ntar ID nya digenerate auto oleh Sequelize(klo emg field nya untuk ID))
    // allowNull: false (NOT NULL)
    // validate (bisa validasi di Sequelize untuk data2 yg akan masuk ke DB)
    // isi validate: notEmpty : true (harus ada isi nya), len: [min,max] (len adalah length string cthnya), isEmail: true, dll
// Enforcing the table name to be equal to the model name:
//      You can stop the auto-pluralization performed by Sequelize using the freezeTableName: true option. This way, Sequelize will infer the table name to be equal to the model name, without any modifications:
const Users = db.define('users', {
    uuid: {
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        validate: {
            notEmpty: true
        },
    }, name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [3,100]
        }
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    }
}, {
    freezeTableName: true
});

export default Users;