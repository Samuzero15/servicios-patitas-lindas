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

router.get("/add", (req, res)=>{
    res.render(routename + "/form.ejs");
});

module.exports = router;