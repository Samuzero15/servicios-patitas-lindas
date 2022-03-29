const express = require('express');
const router = express.Router();
const Empleado = require('../../models/empleado');
const mids = require('./middlewares');

// Todo el personal disponible.
router.get("/", async (req, res) => {
    try {
        res.json(await Empleado.find());
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

// Un empleado en especifico
router.get("/:id", mids.getEmpleado, (req,res) => {
    res.send(res.empleado);
});
// Añadir empleado
router.post("/", async (req, res) => {
    datosEmpleado = new Empleado({
        cedula: req.body.cedula,
        nombres: req.body.nombres,
        apellidos: req.body.apellidos,
        cargo: req.body.cargo
    });
    try {
        res.status(201).json(await datosEmpleado.save());
    } catch (error) {
        res.status(400).json({message: error.message});
    }
});
// Editar empleado
router.patch("/:id", mids.getEmpleado, async (req,res) => {
    const cambiosEmpleado = updateEmpleado(res.empleado, req.body);
    try {
        res.status(202).json(await cambiosEmpleado.save());
    } catch (error) {
        res.status(400).json({message: error.message});
    }
});
// Eliminar empleado
router.delete("/:id", mids.getEmpleado, async (req,res) => {
    try {
        if(req.params.id == "*"){
            await Empleado.deleteMany();
            res.json({message: "Empleados eliminados."});
        }else{
            await res.empleado.remove();
        res.json({message: "Empleado eliminado."});
        }
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

function updateEmpleado(actual, cambios){
    actual.cedula       = cambios.cedula ?? actual.cedula; 
    actual.nombres      = cambios.nombres ?? actual.nombres; 
    actual.apellidos    = cambios.apellidos ?? actual.apellidos; 
    actual.cargo        = cambios.cargo ?? actual.cargo; 
    return actual
}

module.exports = router;