const express = require('express');
const router = express.Router();
const Adopcion = require('../../models/adopcion');
const Mascota = require('../../models/mascota');
const mids = require('./middlewares');

// Estado de la adopción
router.get("/estados", async (req, res) => {
    try {res.json({
            "P": "En prueba",
            "A": "Adoptado",
            "E": "En espera"
        });
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

//Todo el registro de adopciones. 
//Ahora por parametros (id de la mascota, id del empleado supervisado, estado)
router.get("/", async (req, res) => {
    try {
        const queryme = {};
        var busca = false;
        // Arma el objeto de busqueda.
        if(req.query.mascota){ 
            busca = true; queryme.mascota = req.query.mascota;
        } if(req.query.supervisadoPor){
            busca = true; queryme.supervisadoPor = req.query.supervisadoPor;
        } if(req.query.estado){
            busca = true; queryme.estado = req.query.estado;
        }

        if(busca){
            res.json(await Adopcion.find(queryme));
        }else{
            res.json(await Adopcion.find());
        }
        
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});
// Lee los datos de una adopcion.
router.get("/:id", mids.getAdopcion, async (req, res) => {
    res.send(res.adopcion);
});

// Insertar un registro de adopción.
router.post("/", async (req, res) => {
    datosAdopcion = new Adopcion({
        mascota:  req.body.mascota,
        cedula: req.body.cedula,
        nombres: req.body.nombres,
        apellidos: req.body.apellidos,
        responsable: req.body.responsable,
        estado: req.body.estado
    });
    try {
        if(datosAdopcion.estado == "A"){
            var mascota_actualizada = await Mascota.findOneAndUpdate(
                {_id: datosAdopcion.mascota},
                {duenoActual: datosAdopcion._id},
                 {new: true});
                 await mascota_actualizada.save();
            console.log(mascota_actualizada);
        }
        res.status(201).json(await datosAdopcion.save());
    } catch (error) {
        res.status(400).json({message: error.message});
    }
});

// Editar el registro de la adopción.
router.patch("/:id",  mids.getAdopcion, async (req, res) => {
    const cambios = editar(res.adopcion, req.body);
    try {
        res.status(202).json(await cambios.save());
    } catch (error) {
        res.status(400).json({message: error.message});
    }
});

// Eliminar el registro de adopción
router.delete("/:id", mids.getAdopcion, async (req, res) => {
    try {
        if(req.params.id == "*"){
            await Adopcion.deleteMany();
            res.json({message: "Entradas de todos los historiales eliminados."});
        }else{
            let mascota = await Mascota.findOne(res.adopcion.mascota);
            let adopciones_nuevo = mascota.historial.filter(v =>  !v.equals(res.adopcion._id));
            mascota.adopciones = adopciones_nuevo;
            await mascota.save();
            await res.adopcion.remove();
            res.json({message: "Entrada eliminada."});
        }
        
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});


function editar(actual, edicion){
    // (Si existe, usa este) ?? (Si es nulo, usa este)
    actual.cedula           = edicion.cedula ?? actual.cedula;
    actual.nombres          = edicion.nombres ?? actual.nombres;
    actual.apellidos        = edicion.apellidos ?? actual.apellidos;
    actual.responsable      = edicion.responsable  ?? actual.responsable;
    actual.estado           = edicion.estado ?? actual.estado;
    return actual;
}

module.exports = router;