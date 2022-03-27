const express = require('express');
const router = express.Router();
const axios = require('axios').default;

const routename = "personal/";
const api_endpoint = process.env.API_PERSONAL

function getCargosNombres() {
    return {
        "vete": "Veterinario",
        "cuid": "Cuidador",
        "vacu": "Vacunador",
        "entr": "Entrenador",
        "admn": "Administrativo",
        "prog": "Programador"
    };
}

// Lista del personal
router.get("/", async (req, res)=>{
    let datos = null;
    axios.get(api_endpoint)
    .then((response)=>{
        datos = response.data;
        res.render(routename + '/index.ejs', {personal: datos, cargos_nombres : getCargosNombres()});
    }).catch((error)=>{
        //req.flash(error);
        res.render(routename + 'index.ejs', {personal: null});
    })
});

// Añadir empleado (GET)
router.get("/add", (req, res)=>{
    res.render(routename + "/form.ejs", {
        oldInput: req.oldInput,
        cargos_nombres : getCargosNombres(),
        modo: "add"
    });
});

// Añadir empleado (POST)
router.post("/add", (req, res)=>{
    datos = req.body;
    axios.post(api_endpoint, req.body)
    .then((response)=>{
        if(response.status != 201){
            res.redirect("/personal/add");
        }else{
            res.redirect("/personal/");
        }
    }).catch((error)=>{
        res.redirect("/personal/add");
    })
});

// Editar empleado (GET)
router.get("/edit/:id", (req, res)=>{

    axios.get(api_endpoint + req.params.id)
    .then((response)=>{
        console.log(response.data);
        if(response.status != 200){
            res.flash("error","Algo salio mal!, codigo: " + response.status);
            res.redirect("/personal/");
        }else{
            res.render(routename + "/form.ejs", {
                oldInput: req.oldInput,
                edit: response.data,
                cargos_nombres: getCargosNombres(),
                modo: "edit"
            });
        }
    }).catch((error)=>{
        res.flash("error","Algo salio mal!, codigo: " + response.status);
        res.redirect("/personal");
    })
    
});

// Editar empleado (POST)
router.post("/edit/:id", (req, res)=>{
    datos = req.body;
    axios.patch(api_endpoint + req.params.id, datos)
    .then((response)=>{
        if(response.status != 202){
            req.flash("error","Algo salio mal! ("+response.status+")");
            res.redirect("/personal/edit/" + req.params.id);
        }else{
            req.flash("noti","Editado con exito!");
            res.redirect("/personal/");
        }
    }).catch((error)=>{
        console.log(error);
        req.flash("error", "Algo salio mal! " + error);
        return res.redirect("/personal/edit/" + req.params.id);
    })
});

// Mostrar empleado
router.get("/show/:id", (req, res)=>{

    axios.get(api_endpoint + req.params.id)
    .then((response)=>{
        //res.json(response.data);
        res.render(routename + "/show.ejs", {
            empleado: response.data,
            cargos_nombres: getCargosNombres()
        });
    }).catch((error)=>{
        res.redirect("/personal");
    })
});

// Eliminar empleado
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
module.exports = router;