const express = require('express');
const router = express.Router();
const Mascota = require('../models/mascota');

// Todas las mascotas
router.get('/', async (req, res) => {
    //res.send("Hola mundo");
    try {
        const mascotas = await Mascota.find();
        res.json(mascotas);
        //res.status(201);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

// 1 sola mascota
router.get('/:id', getMascota, (req, res) => {
    res.send(res.mascota);
});
// Añadir mascota
router.post('/', async (req, res) => {
    console.log(req.body);
    datosMascota = new Mascota({
        tipo: req.body.tipo,
        raza: req.body.raza,
        nombre: req.body.nombre,
        sexo: req.body.sexo,
        estatura: req.body.estatura,
        ubicacion: req.body.ubicacion
    });
    console.log(datosMascota);
    try {
        const nuevaMascota = await datosMascota.save();
        res.status(201).json(nuevaMascota);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
});
// Editar mascota
router.patch('/:id',  getMascota, async (req, res) => {
    let cambiosMascota = editarMascota(res.mascota, req.body);
    try {
        const mascotaEditada = await cambiosMascota.save();
        res.status(201).json(mascotaEditada);
    } catch (error) {
        res.status(400).json({message: error.message});
    }

});
// Eliminar mascota
router.delete('/:id', getMascota, async (req, res) => {
    try {
        await res.mascota.remove();
        res.json({message: "Mascota eliminada."});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

function editarMascota(actual, edicion){
    actual.raza =       edicion.raza ?? actual.raza;
    actual.nombre =     edicion.nombre ?? actual.nombre;
    actual.sexo =       edicion.sexo ?? actual.sexo;
    actual.estatura =   edicion.estatura ?? actual.estatura;
    actual.ubicacion =  edicion.raza ?? actual.ubicacion;
    return actual;
}

async function getMascota(req, res, proceed) {
    let mascota;
    try {
        mascota = await Mascota.findById(req.params.id);
        if(mascota == null){
            console.log("Ño");
            return res.status(404).json({message: "La mascota no existe en la base de datos."});
        }
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
    res.mascota = mascota;
    proceed();
}

module.exports = router;