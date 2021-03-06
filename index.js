const express = require('express')
const { engine } = require('express-handlebars');
const { getUser, postUser, deleteUser } = require('./base-de-datos');


const app = express()
const PORT = process.env.PORT || 4000

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');

// CONFIGURACIONES 
app.use('/static', express.static('public'))
app.use(express.json())

const helpers = {
    formatear: (fecha) => new Date(fecha).toISOString().split("T")[0]
}

// RUTA RAIZ
app.get('/', async (req, res) => {
    const users = await getUser()
    res.render('index', { users, helpers });
})

// RUTA PARA FORMULARIO DE CREAR USERS
app.get('/user-create', (req, res) => { 
    res.render('crear')
 })

 // RUTA PATA FORMULARIO DE ELIMINAR USERS
app.get('/user-delete/:id', async(req, res) => { 
    const {id} = req.params
    res.render('eliminar', {id})
 })


// API GET
 app.get("/users", async (req, res) => {
     const respuesta = await getUser()
     return res.json(respuesta)
 })
// API POST
app.post("/users",  (req, res) => {
    const {username, email, contrasenia} = req.body

    postUser(username, email, contrasenia)
    .then(row => res.status(201).json(row))
    .catch(err => {
        console.error(err);
        res.sendStatus(500)
    })
})
// API DELETE
app.delete("/users/:id", async(req, res) => {
    const {id} = req.params
    const respuesta = await deleteUser(id)
    if(respuesta.length === 0){
        return res.status(404).json({msg: "id not found"})
    }
    return res.json(respuesta)
})


app.listen(PORT, () => {
    console.log(`escuchando en http://localhost:${PORT}/`);
})