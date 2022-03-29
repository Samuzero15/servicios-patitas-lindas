const express = require('express');
const router = express.Router();
const Mascota = require('../../models/mascota');
const Entrada = require('../../models/entrada');
const mids = require('./middlewares');

// Todas las mascotas
router.get('/', async (req, res) => {
    try {
        const mascotas = await Mascota.find();
        res.json(mascotas);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

// 1 sola mascota
router.get('/:id', mids.getMascota, (req, res) => {
    res.send(res.mascota);
});
// Añadir mascota
router.post('/', async (req, res) => {
    //console.log(req.body);
    datos = new Mascota({
        tipo: req.body.tipo,
        raza: req.body.raza,
        nombre: req.body.nombre,
        sexo: req.body.sexo,
        estatura: req.body.estatura,
        ubicacion: req.body.ubicacion,
        encontrado_por: req.body.encontrado_por
    });
    try {
        res.status(201).json(await datos.save());
    } catch (error) {
        res.status(400).json({message: error.message});
    }
});
// Editar mascota
router.patch('/:id',  mids.getMascota, async (req, res) => {
    let cambiosMascota = editarMascota(res.mascota, req.body);
    try {
        const mascotaEditada = await cambiosMascota.save();
        res.status(201).json(mascotaEditada);
    } catch (error) {
        res.status(400).json({message: error.message});
    }

});
// Eliminar mascota
router.delete('/:id', mids.getMascota, async (req, res) => {
    try {
        if(req.params.id == "*"){
            await Entrada.deleteMany();
            await Mascota.deleteMany();
            res.json({message: "Mascotas eliminadas."});
        }else{
            await Entrada.deleteMany({mascota: res.mascota.id});
            await res.mascota.remove();
            res.json({message: "Mascota eliminada."});
        }
        
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

function editarMascota(actual, edicion){
    // (Si existe, usa este) ?? (Si es nulo, usa este)
    actual.tipo =           edicion.tipo ?? actual.tipo;
    actual.raza =           edicion.raza ?? actual.raza;
    actual.nombre =         edicion.nombre ?? actual.nombre;
    actual.sexo =           edicion.sexo ?? actual.sexo;
    actual.estatura =       edicion.estatura ?? actual.estatura;
    actual.ubicacion =      edicion.ubicacion ?? actual.ubicacion;
    actual.encontrado_por = edicion.encontrado_por ?? edicion.encontrado_por;
    return actual;
}

module.exports = router;