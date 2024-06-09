const express = require('express')
const mysql = require('mysql')
const bodyParser = require('body-parser')

const app = express()

app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', '*');
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next()
})

app.use(bodyParser.json())

const PUERTO = 3000

const conexion = mysql.createConnection(
    {
        host:'localhost',
        database: 'pokemon',
        user: 'root',
        password: ''
    }
)

app.listen(PUERTO, () => {
    console.log(`Servidor corriendo en el puerto ${PUERTO}`);
})

conexion.connect(error => {
    if(error) throw error
    console.log('Conexión exitosa a la base de datos');
})

app.get('/', (req, res) => {
    res.send('API')
})

app.get('/Pokemon', (req, res) => {

    const query = 'SELECT * FROM pokes;'
    conexion.query(query, (error, resultado) => {
        if(error) return console.error(error.message)

        const obj = {}
        if(resultado.length > 0) {
            obj.listaPokemons = resultado
            res.json(obj)
        } else {
            res.send('No hay registros')
        }
    })
})

app.get('/Pokemon/:id', (req, res) => {
    const { id } = req.params

    const query = `SELECT * FROM pokes WHERE idpoke =${id};`
    conexion.query(query, (error, resultado) => {
        if(error) return console.error(error.message)

        if(resultado.length > 0){
            res.json(resultado);
        } else {
            res.send('No hay registros');
        }
    })
})

app.post('/Pokemon/add', (req, res) => {
    const Pokemon = {
        nombre: req.body.nombre,
        tipo: req.body.tipo,
        descripcion: req.body.descripcion        
    }

    const query = `INSERT INTO pokes SET ?`
    conexion.query(query, Pokemon, (error) => {
        if(error) return console.error(error.message)

        res.json(`Pokemon Registrado Correctamente en la Pokedex`)
    })
})

app.put('/Pokemon/update/:id', (req, res) => {
    const { id } = req.params
    const { nombre, tipo, descripcion } = req.body

    const query = `UPDATE pokes SET nombre='${nombre}', tipo='${tipo}', descripcion='${descripcion}' WHERE idpoke='${id}';`
    conexion.query(query, (error) => {
        if(error) return console.log(error.message)

        res.json(`Se actualizó Los Datos del Pokemon en la Pokedex`)
    })
})

app.delete('/Pokemon/delete/:id', (req, res) => {
    const { id } = req.params

    const query = `DELETE FROM pokes WHERE idpoke=${id};`
    conexion.query(query, (error) => {
        if(error) return console.log(error.message)

        res.json(`Se elimino al Pokemon de la pokedex`)
    })
})