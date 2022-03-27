require("dotenv").config()
const fs = require("fs")
const {Pool} = require("pg")

const connectionString = process.env.DATABASE_URL

const pool = new Pool({
    connectionString: connectionString,
    ssl: {rejectUnauthorized: false}
})

const postUser = async(username, email, contrasenia) => {
    const text = "INSERT INTO users (username, email, contrasenia) values ($1, $2, $3) RETURNING *"
    const values = [username, email, contrasenia]

    try {
        const respuesta = await pool.query(text, values)
        return respuesta.rows
    } catch (error) {
        console.log(error)
        return error
    }
}

const getUser = async() => {
    try {
        const respuesta = await pool.query("SELECT * FROM users;")
        return respuesta.rows
    } catch (error) {
        console.log(error)
        return error
    } 
}

const deleteUser = async(id) => {
    const text = "DELETE FROM users WHERE id = $1 RETURNING *"
    const values = [id]
    
    try {
        const respuesta = await pool.query(text, values)
        return respuesta.rows
    } catch (error) {
        console.log(error)
        return error
    }
}

const migrar = () => {
    const data = fs.readFileSync("data.sql", {encoding: "utf8"})
    pool.query(data)
    .then(() => console.log("migración lista!"))
    .catch(console.error)
}


const probar = () => {
    pool.query("SELECT * FROM users")
    .then((res) => console.log(res.rows))
    .catch(console.error)
}

module.exports = {
    migrar, probar, postUser, getUser, deleteUser
}