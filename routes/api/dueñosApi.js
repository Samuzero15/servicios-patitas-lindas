const express = require('express');
const router = express.Router();
const Dueno = require('../../models/dueño');
const mids = require('./middlewares');

// Obten todas las entradas del todos los duenos.

router.get("/", async (req, res) => {
    try {
        res.json(await Dueno.find());
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

// Todos los posibles dueños de la mascota.
router.get("/:mascota", mids.getMascota, async (req, res) => {
    try {
        res.json(await Dueno.find({mascota: res.mascota}));
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

// Insertar un posible dueño de esta mascota.
router.post("/:mascota", mids.getMascota, async (req, res) => {
    datosDueno = new Dueno({
        cedula: req.body.cedula,
        nombres: req.body.nombres,
        apellidos: req.body.apellidos,
        telefono: req.body.telefono,
        correo: req.body.correo,
        mascota: res.mascota._id
    });
    res.mascota.posiblesDuenos.push(datosDueno._id);
    try {
        await res.mascota.save();
        res.status(201).json(await datosDueno.save());
    } catch (error) {
        res.status(400).json({message: error.message});
    }
});

// Lee los datos del dueño
router.get("/:mascota/:id", mids.getMascota, mids.getDueno, (req, res) => {
    res.send(res.dueno);
});

// Editar los datos del dueño.
router.patch("/:mascota/:id", mids.getMascota, mids.getDueno, async (req, res) => {
    const cambiosDueno = editar(res.dueno, req.body);
    try {
        res.status(202).json(await cambiosDueno.save());
    } catch (error) {
        console.log("sex");
        res.status(400).json({message: error.message});
    }
});

// Eliminar el posible dueño de esta mascota.
router.delete("/:mascota/:id", mids.getMascota, mids.getDueno, async (req, res) => {
    try {
        if(req.params.mascota == "*"){
            await Dueno.deleteMany();
            res.json({message: "Duenos de todos los historiales eliminados."});
        }else{
            let historial_nuevo = res.mascota.historial.filter(v => {
                return !v.equals(res.dueno._id);
            });
            res.mascota.historial = historial_nuevo;
            await res.mascota.save();
            await res.dueno.remove();
            res.json({message: "Dueno eliminado."});
        }
        
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});


function editar(actual, edicion){
    // (Si existe, usa este) ?? (Si es nulo, usa este)
    actual.cedula       = edicion.cedula ?? actual.cedula;
    actual.nombres      = edicion.nombres ?? actual.nombres;
    actual.apellidos    = edicion.apellidos ?? actual.apellidos;
    actual.telefono     = edicion.telefono ?? actual.telefono;
    actual.correo       = edicion.correo ?? actual.correo;
    actual.mascota      = edicion.mascota ?? actual.mascota;
    return actual;
}

module.exports = router;