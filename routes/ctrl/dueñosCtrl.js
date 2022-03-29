const express = require('express');
const router = express.Router();
const axios = require('axios').default;

const main_route = "/pos_duenos/";
const routename = "dueños/";
const duenosApi = process.env.API_DUENOS
const mascotasApi = process.env.API_MASCOTAS

// Saca el historial de la mascota.
router.get("/:mascota", async (req, res)=>{
    const reqDuenos = axios.get(duenosApi + req.params.mascota);
    const reqMascotas = axios.get(mascotasApi + req.params.mascota);

    axios.all([reqDuenos, reqMascotas])
    .then(axios.spread((...responses)=>{
        res.render(routename + '/index.ejs', {
            posiblesDuenos: responses[0].data,
            mascota: responses[1].data,
        });
    })).catch((e) =>{
        req.flash("error", e);
        res.redirect("/");
    });
});


// Añadir posible dueno (GET)
router.get("/:mascota/add", async (req, res)=>{
    const reqMascotas = axios.get(mascotasApi + req.params.mascota);

    axios.all([reqMascotas])
    .then(axios.spread((...responses)=>{
        res.render(routename + '/form.ejs', {
            mascota: responses[0].data,
            modo: "add",
            oldInput : req.oldInput
        });
    })).catch((e) =>{
        req.flash("error", e);
        res.redirect("/");
    });
});


// Añadir posible dueño (POST)
router.post("/:mascota/add", (req, res)=>{
    datos = req.body;
    axios.post(duenosApi + req.params.mascota, req.body)
    .then((response)=>{
        if(response.status != 201){
            req.flash("error", "Algo salio mal! (" + response.status +")");
            res.redirect(main_route + req.params.mascota + "/add");
        }else{
            req.flash("noti", "Entrada al historial añadida!");
            res.redirect(main_route + req.params.mascota);
        }
    }).catch((e)=>{
        console.log(e);
        req.flash("error", e);
        res.redirect("/");
    })
});

// Editar entrada (GET)
router.get("/:mascota/edit/:id", (req, res)=>{
    const reqDueno = axios.get(duenosApi + req.params.mascota + "/" + req.params.id);
    const reqMascotas = axios.get(mascotasApi + req.params.mascota);
    

    axios.all([reqDueno, reqMascotas])
    .then(axios.spread((...responses)=>{
        res.render(routename + '/form.ejs', {
            edit: responses[0].data,
            mascota: responses[1].data,
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
    axios.patch(duenosApi + req.params.mascota + "/" + req.params.id, datos)
    .then((response)=>{
        if(response.status != 202){
            req.flash("error","Algo salio mal! ("+response.status+")");
            res.redirect(main_route + req.params.mascota + "/edit/" + req.params.id);
        }else{
            req.flash("noti", "Entrada al historial editada!");
            res.redirect(main_route + req.params.mascota);
        }
    }).catch((error)=>{
        //console.log(error);
        req.flash("error", error);
        return res.redirect("/");
    })
});


// Eliminar entrada
router.post("/:mascota/delete/:id", (req, res) => {
    axios.delete(duenosApi + req.params.mascota + "/" + req.params.id)
    .then((response)=>{
        //res.json(response.data);
        req.flash("noti",response.data.message);
        res.redirect(main_route + req.params.mascota);
    }).catch((error)=>{
        req.flash("error", error);
        return res.redirect("/");
    })
});

module.exports = router;