require("dotenv").config()

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
const Api = require('rest-api-handler');/*import { Api } from 'rest-api-handler';*/
const cors = require("cors");

app.set('view-engine', 'ejs');
app.use('/public', express.static('public'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGODB_URL, {useNewUrlParser: true});
const db = mongoose.connection;
db.on('error', (error)=> console.error(error));
db.once('open', () => console.log("Conectado a la base de datos. UwU"));


app.get("/", (req, res)=>{
    const xhttp = new XMLHttpRequest();
    const api_mascotas = new Api("http://localhost:3000/api/mascotas/");
    let mascotas = null;
    api_mascotas.get("/").then(response => {
        console.log(response);
    });
    
    console.log(mascotas);
    res.render('index.ejs', {mascotas: mascotas});
});

const rutasApiMascotas = require('./routes/mascotas');
app.use("/api/mascotas", rutasApiMascotas);

app.listen(3000, ()=> console.log("Server started bro"));