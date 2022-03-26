const express = require('express');
const mascota = require('../../models/mascota');
const router = express.Router();
const Mascota = require('../../models/mascota');

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
router.get('/:id', getMascota, (req, res) => {
    res.send(res.mascota);
});
// Añadir mascota
router.post('/', async (req, res) => {
    console.log(req.body);
    datos = new Mascota({
        tipo: req.body.tipo,
        raza: req.body.raza,
        nombre: req.body.nombre,
        sexo: req.body.sexo,
        estatura: req.body.estatura,
        ubicacion: req.body.ubicacion
    });
    try {
        res.status(201).json(await datos.save());
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
        if(req.params.id == "*"){
            await Mascota.deleteMany();
            res.json({message: "Mascotas eliminadas."});
        }else{
            await res.mascota.remove();
            res.json({message: "Mascota eliminada."});
        }
        
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

function editarMascota(actual, edicion){
    // (Si existe, usa este) ?? (Si es nulo, usa este)
    actual.raza =       edicion.raza ?? actual.raza;
    actual.nombre =     edicion.nombre ?? actual.nombre;
    actual.sexo =       edicion.sexo ?? actual.sexo;
    actual.estatura =   edicion.estatura ?? actual.estatura;
    actual.ubicacion =  edicion.ubicacion ?? actual.ubicacion;
    return actual;
}

async function getMascota(req, res, proceed) {
    let mascota;
    if(req.params.id == "*") {proceed(); return;}
    try {
        mascota = await Mascota.findById(req.params.id);
        if(mascota == null){
            return res.status(404).json({message: "La mascota no existe en la base de datos."});
        }
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
    res.mascota = mascota;
    proceed();
}

module.exports = router;