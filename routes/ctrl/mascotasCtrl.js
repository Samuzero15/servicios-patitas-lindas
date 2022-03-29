const express = require('express');
const mascota = require('../../models/mascota');
const router = express.Router();
const axios = require('axios').default;

const routename = "mascotas/";
// Lista de mascotas
router.get("/", async (req, res)=>{
    let mascotas = null;
    axios.get(process.env.API_MASCOTAS)
    .then((response)=>{
        mascotas = response.data;
        res.render(routename + '/index.ejs', {mascotas: mascotas});
    }).catch((error)=>{
        //req.flash(error);
        res.render(routename + '/index.ejs', {mascotas: null});
    })
});

// Mapa de todas las mascotas rescatadas
router.get("/ubicaciones", (req, res)=>{
    res.render(routename + "/ubicaciones.ejs");
});

// Añadir mascota (GET)
router.get("/add", (req, res)=>{
    console.log(req.session);
    res.render(routename + "/form.ejs", {
        oldInput: req.oldInput,
        modo: "add"
    });
});
// Añadir mascota (POST)
router.post("/add", (req, res)=>{
    datos = req.body;
    if(req.body.ubicacion[0] == 'null'){
        req.flash("error","Debes añadir una ubicacion en el mapa!");
        res.redirect("/mascotas/add");
        return;
    }
    axios.post(process.env.API_MASCOTAS, req.body)
    .then((response)=>{
        if(response.status != 201){
            res.redirect("/mascotas/add");
        }else{
            res.redirect("/mascotas/");
        }
    }).catch((error)=>{
        res.redirect("/mascotas/add");
    })
});

// Editar mascota (GET)
router.get("/edit/:id", (req, res)=>{
    axios.get(process.env.API_MASCOTAS + req.params.id)
    .then((response)=>{
        console.log(response.data);
        if(response.status != 200){
            res.flash("error","Algo salio mal!, codigo: " + response.status);
            res.redirect("/mascotas/");
        }else{
            res.render(routename + "/form.ejs", {
                oldInput: req.oldInput,
                edit: response.data,
                modo: "edit"
            });
        }
    }).catch((error)=>{
        res.flash("error","Algo salio mal!, codigo: " + response.status);
        res.redirect("/mascotas");
    })
    
});

// Editar mascota (POST)
router.post("/edit/:id", (req, res)=>{
    datos = req.body;
    if(req.body.ubicacion[0] == 'null'){
        console.log("Error: " + response.status);
        req.flash("error", "Debes especificar una ubicacion!");
        return res.redirect("/mascotas/edit/" + req.params.id);
    }
    axios.patch(process.env.API_MASCOTAS + req.params.id, datos)
    .then((response)=>{
        if(response.status != 201){
            console.log("Error: " + response.status);
            req.flash("error","Algo salio mal!");
            res.redirect("/mascotas/edit/" + req.params.id);
        }else{
            console.log("editado");
            req.flash("noti","Editado con exito!");
            res.redirect("/mascotas/");
        }
    }).catch((error)=>{
        console.log(error);
        req.flash("error", "Algo salio mal! " + error);
        return res.redirect("/mascotas/edit/" + req.params.id);
    })
});

// Mostrar mascota
router.get("/show/:id", (req, res)=>{
    const reqMascota = axios.get(process.env.API_MASCOTAS + req.params.id);
    const reqAdopciones = axios.get(process.env.API_ADOPCIONES);
    axios.all([reqMascota, reqAdopciones])
    .then(axios.spread((...responses)=>{
        //res.json(response.data);
        console.log(responses[1].data);
        res.render(routename + "/show.ejs", {
            mascota: responses[0].data,
            adopcion: responses[1].data.find(a => a._id == mascota.duenoActual)
        });
    })).catch((error)=>{
        res.redirect("/mascotas");
    })
});

// Eliminar mascota
router.post("/delete/:id", (req, res) => {
    axios.delete(process.env.API_MASCOTAS + req.params.id)
    .then((response)=>{
        //res.json(response.data);
        req.flash("noti",response.data.message);
        res.redirect("/mascotas");
    }).catch((error)=>{
        res.redirect("/mascotas");
    })
});

module.exports = router;