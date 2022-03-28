const express = require('express');
const router = express.Router();
const axios = require('axios').default;

const routename = "historiales/";
const historialesApi_endpoint = process.env.API_HISTORIALES
const mascotasApi_endpoint = process.env.API_MASCOTAS
const personalApi_endpoint = process.env.API_PERSONAL

// Saca el historial de la mascota.
router.get("/:mascota", async (req, res)=>{
    const reqHistorial = axios.get(historialesApi_endpoint + req.params.mascota);
    const reqPersonal = axios.get(personalApi_endpoint);
    const reqMascotas = axios.get(mascotasApi_endpoint + req.params.mascota);
    const reqEventosHistorial = axios.get(historialesApi_endpoint + "eventos");

    axios.all([reqHistorial, reqMascotas, reqPersonal, reqEventosHistorial])
    .then(axios.spread((...responses)=>{
        res.render(routename + '/index.ejs', {
            historial: responses[0].data,
            mascota: responses[1].data,
            personal: responses[2].data,
            eventos: responses[3].data
        });
    })).catch((e) =>{
        req.flash("error", e);
        res.redirect("/");
    });
});


// Añadir al historial (GET)
router.get("/:mascota/add", async (req, res)=>{
    const reqPersonal = axios.get(personalApi_endpoint);
    const reqMascotas = axios.get(mascotasApi_endpoint + req.params.mascota);
    const reqEventosHistorial = axios.get(historialesApi_endpoint + "eventos");

    axios.all([reqMascotas, reqPersonal, reqEventosHistorial])
    .then(axios.spread((...responses)=>{
        res.render(routename + '/form.ejs', {
            mascota: responses[0].data,
            personal: responses[1].data,
            eventos: responses[2].data,
            modo: "add",
            oldInput : req.oldInput
        });
    })).catch((e) =>{
        req.flash("error", e);
        res.redirect("/");
    });
});

// Añadir al historial (POST)
router.post("/:mascota/add", (req, res)=>{
    datos = req.body;
    axios.post(historialesApi_endpoint + req.params.mascota, req.body)
    .then((response)=>{
        if(response.status != 201){
            res.redirect("/historiales/"+ req.params.mascota + "/add");
        }else{
            res.redirect("/historiales/"+ req.params.mascota);
        }
    }).catch((e)=>{
        console.log(e);
        req.flash("error", e);
        res.redirect("/");
    })
});

// Editar entrada (GET)
router.get("/:mascota/edit/:id", (req, res)=>{
    const reqEntrada = axios.get(historialesApi_endpoint + req.params.mascota + "/" + req.params.id);
    const reqPersonal = axios.get(personalApi_endpoint);
    const reqMascotas = axios.get(mascotasApi_endpoint + req.params.mascota);
    const reqEventosHistorial = axios.get(historialesApi_endpoint + "eventos");

    axios.all([reqEntrada, reqMascotas, reqPersonal, reqEventosHistorial])
    .then(axios.spread((...responses)=>{
        res.render(routename + '/form.ejs', {
            edit: responses[0].data,
            mascota: responses[1].data,
            personal: responses[2].data,
            eventos: responses[3].data,
            modo: "edit",
            oldInput: req.oldInput
        });
    })).catch((e) =>{
        req.flash("error", e);
        res.redirect("/");
    });
});

// Editar entrada (POST)
router.post("/:mascota/edit/:id", (req, res)=>{
    datos = req.body;
    axios.patch(historialesApi_endpoint + req.params.mascota + "/" + req.params.id, datos)
    .then((response)=>{
        if(response.status != 202){
            req.flash("error","Algo salio mal! ("+response.status+")");
            res.redirect("/historial/" + req.params.mascota + "/edit/" + req.params.id);
        }else{
            req.flash("noti","Editado con exito!");
            res.redirect("/historial/" + req.params.mascota);
        }
    }).catch((error)=>{
        req.flash("error", error);
        return res.redirect("/");
    })
});

/*
// Eliminar entrada
router.post("/delete/:id", (req, res) => {
    axios.delete(api_endpoint + req.params.id)
    .then((response)=>{
        //res.json(response.data);
        req.flash("noti",response.data.message);
        res.redirect("/personal");
    }).catch((error)=>{
        res.redirect("/personal");
    })
});
*/
module.exports = router;