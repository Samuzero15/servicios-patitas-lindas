require("dotenv").config()

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const axios = require('axios').default;
const cors = require("cors");
const oldInput = require("old-input");
const session = require("express-session");
const flash = require("express-flash");

app.set('view-engine', 'ejs');
app.use('/public', express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cors());
app.use(flash());

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: false
}))
app.use(oldInput);

mongoose.connect(process.env.MONGODB_URL, {useNewUrlParser: true});
const db = mongoose.connection;
db.on('error', (error)=> console.error(error));
db.once('open', () => console.log("Conectado a la base de datos. UwU"));


app.get("/", (req, res) => {res.send("Hello world");});

app.get("/mapa", (req, res)=>{res.render('ejemplo_mapa.ejs')});

//const ctrlMascotas = 
app.use("/mascotas", require('./routes/ctrl/mascotasCtrl'));
app.use("/historiales", require('./routes/ctrl/historialesCtrl'));
app.use("/personal", require('./routes/ctrl/personalCtrl'));

const rutasApiAdopciones = require('./routes/api/adopcionesApi');
app.use("/api/adopciones", rutasApiAdopciones);
const rutasApiHistoriales = require('./routes/api/historialesApi');
app.use("/api/historiales", rutasApiHistoriales);
const rutasApiMascotas = require('./routes/api/mascotasApi');
app.use("/api/mascotas", rutasApiMascotas);
const rutasApiPersonal = require('./routes/api/personalApi');
app.use("/api/personal", rutasApiPersonal);

app.listen(5000, ()=> console.log("Server started bro"));