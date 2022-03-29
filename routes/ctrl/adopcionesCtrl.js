const express = require('express');
const router = express.Router();
const axios = require('axios').default;

const routename = "adopciones/";
const adopcionesApi = process.env.API_ADOPCIONES;
const mascotasApi = process.env.API_MASCOTAS;
const personalApi = process.env.API_PERSONAL;

// Saca el historial de la mascota.
router.get("/", async (req, res)=>{
    const reqAdopciones = axios.get(adopcionesApi);
    const reqPersonal = axios.get(personalApi);
    const reqMascotas = axios.get(mascotasApi);
    const reqAdopciones_estados = axios.get(adopcionesApi + "estados");

    axios.all([reqAdopciones, reqMascotas, reqPersonal, reqAdopciones_estados])
    .then(axios.spread((...responses)=>{
        res.render(routename + '/index.ejs', {
            adopciones: responses[0].data,
            mascotas: responses[1].data,
            personal: responses[2].data,
            estados: responses[3].data
        });
    })).catch((e) =>{
        console.log(e);
        req.flash("error", e);
        res.redirect("/");
    });
});

router.get("/add", async (req, res)=>{
    const reqPersonal = axios.get(personalApi);
    const reqMascotas = axios.get(mascotasApi);
    const reqAdopciones_estados = axios.get(adopcionesApi + "estados");

    axios.all([reqMascotas, reqPersonal, reqAdopciones_estados])
    .then(axios.spread((...responses)=>{
        var mascotas = responses[0].data;
        var personal = responses[1].data;
        if(mascotas.length < 1){
            req.flash("noti", "No hay mascotas disponibles en la base de datos!");
            return res.redirect("/adopciones/");
        }

        if(personal.length < 1){
            req.flash("noti", "No hay personal disponible en la base de datos!");
            return res.redirect("/adopciones/");
        }

        res.render(routename + '/form.ejs', {
            mascotas: mascotas,
            personal: personal,
            estados: responses[2].data,
            modo: "add",
            oldInput : req.oldInput
        });
    })).catch((e) =>{
        req.flash("error", e);
        res.redirect("/");
    });
});

// Añadir registro de adopcion. (POST)
router.post("/add", (req, res)=>{
    datos = req.body;
    axios.post(adopcionesApi, req.body)
    .then((response)=>{
        if(response.status != 201){
            req.flash("error", "Algo salio mal! (" + response.status +")");
            res.redirect("/adopciones/add");
        }else{
            req.flash("noti", "Registro de adopcion añadido!");
            res.redirect("/adopciones/");
        }
    }).catch((e)=>{
        console.log(e);
        req.flash("error", e);
        res.redirect("/");
    })
});

// Mostrar los datos de la adopción
router.get("/show/:id", (req, res)=>{

    const reqAdopcion = axios.get(adopcionesApi + req.params.id)
    const reqPersonal = axios.get(personalApi);
    const reqMascotas = axios.get(mascotasApi);
    const reqAdopciones_estados = axios.get(adopcionesApi + "estados");
    axios.all([reqAdopcion, reqMascotas, reqPersonal, reqAdopciones_estados])
    .then(axios.spread((...responses)=>{
        //res.json(response.data);
        var adopcion = responses[0].data;
        var mascota = responses[1].data.find(m => m._id == adopcion.mascota);
        res.render(routename + "/show.ejs", {
            adopcion: adopcion,
            mascota: mascota,
            responsable: responses[2].data.find(p => p._id == adopcion.responsable),
            estados: responses[3].data
        });
    })).catch((error)=>{
        res.redirect("/personal");
    })
});


// Editar entrada (GET)
router.get("/edit/:id", (req, res)=>{
    const reqAdopciones = axios.get(adopcionesApi + req.params.id);
    const reqPersonal = axios.get(personalApi);
    const reqMascotas = axios.get(mascotasApi);
    const reqAdopciones_estados = axios.get(adopcionesApi + "estados");

    axios.all([reqAdopciones, reqMascotas, reqPersonal, reqAdopciones_estados])
    .then(axios.spread((...responses)=>{
        var mascotas = responses[1].data;
        var personal = responses[2].data;
        if(mascotas.length < 1){
            req.flash("noti", "No hay mascotas disponibles en la base de datos!");
            return res.redirect("/adopciones/");
        }

        if(personal.length < 1){
            req.flash("noti", "No hay personal disponible en la base de datos!");
            return res.redirect("/adopciones/");
        }

        res.render(routename + '/form.ejs', {
            mascotas: mascotas,
            personal: personal,
            estados: responses[3].data,
            edit: responses[0].data,
            modo: "edit",
            oldInput: req.oldInput
        });
    })).catch((e) =>{
        req.flash("error", e);
        res.redirect("/");
    });
});


// Editar registro de adopción (POST)
router.post("/edit/:id", (req, res)=>{
    datos = req.body;
    axios.patch(adopcionesApi + "/" + req.params.id, datos)
    .then((response)=>{
        if(response.status != 202){
            req.flash("error","Algo salio mal! ("+response.status+")");
            res.redirect("/adopciones/edit/" + req.params.id);
        }else{
            req.flash("noti", "Entrada al historial editada!");
            res.redirect("/adopciones/");
        }
    }).catch((error)=>{
        req.flash("error", error);
        return res.redirect("/");
    })
});


// Eliminar registro de adopcion
router.post("/delete/:id", (req, res) => {
    axios.delete(adopcionesApi + "/" + req.params.id)
    .then((response)=>{
        //res.json(response.data);
        req.flash("noti",response.data.message);
        res.redirect("/adopciones/");
    }).catch((error)=>{
        console.log(error);
        req.flash("error", error);
        return res.redirect("/");
    })
});

module.exports = router;