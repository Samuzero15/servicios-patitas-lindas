const express = require('express');
const router = express.Router();
const axios = require('axios').default;

const routename = "mascotas/";
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

router.get("/ubicaciones", (req, res)=>{
    res.render(routename + "/ubicaciones.ejs");
});

router.get("/add", (req, res)=>{
    res.render(routename + "/form.ejs");
});

router.get("/get/:id", (req, res)=>{
    axios.post(process.env.API_MASCOTAS, req.params.id)
    .then((response)=>{
        res.json(response.data);
    }).catch((error)=>{
        res.redirect("/mascotas");
    })
});

router.post("/add", (req, res)=>{
    datos = req.body;
    if(req.body.ubicacion[0] == 'null'){
        res.render(routename + "/form.ejs", {old: req.body});
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

module.exports = router;