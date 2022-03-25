const express = require('express');
const router = express.Router();
const axios = require('axios').default;

const routename = "personal/";
router.get("/", async (req, res)=>{
    let datos = null;
    axios.get(process.env.API_PERSONAL)
    .then((response)=>{
        datos = response.data;
        res.render(routename + '/index.ejs', {personal: datos});
    }).catch((error)=>{
        //req.flash(error);
        res.render(routename + 'index.ejs', {personal: null});
    })
});

module.exports = router;