const express = require('express');
const router = express.Router();
const Adopcion = require('../../models/adopcion');
//const Mascota = require('../../models/mascota')

// Estado de la adopción
router.get("/estado", async (req, res) => {
    try {
        res.json({
            "P": "En prueba",
            "A": "Adoptado",
            "I": "Ignorado",
            "N": "Normal"
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
router.get("/:id", getAdopcion, async (req, res) => {
    try {
        res.json(await Adopcion.find({_id: res.adopcion}));
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

// Insertar un registro de adopción.
router.post("/", async (req, res) => {
    datosAdopcion = new Adopcion({
        mascota:  req.body.mascota,
        cedula: req.body.cedula,
        nombres: req.body.nombres,
        apellidos: req.body.apellidos,
        supervisadoPor: req.body.supervisadoPor,
        estado: req.body.estado
    });
    res.mascota.adopciones.push(datosAdopcion._id);
    try {
        await res.mascota.save();
        res.status(201).json(await datosAdopcion.save());
    } catch (error) {
        res.status(400).json({message: error.message});
    }
});

// Editar el registro de la adopción.
router.patch("/:id", getAdopcion, async (req, res) => {
    const cambios = editar(res.adopcion, req.body);
    try {
        res.status(202).json(await cambios.save());
    } catch (error) {
        res.status(400).json({message: error.message});
    }
});

// Eliminar el registro de adopción
router.delete("/:id", getAdopcion, async (req, res) => {
    try {
        if(req.params.mascota == "*"){
            await Adopcion.deleteMany();
            res.json({message: "Entradas de todos los historiales eliminados."});
        }else{
            let adopciones_nuevo = res.mascota.historial.filter(v =>  !v.equals(res.adopcion._id));
            res.mascota.adopciones = adopciones_nuevo;
            await res.mascota.save();
            await res.adopciones.remove();
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
    actual.supervisadoPor   = edicion.supervisadoPor ?? actual.supervisadoPor;
    actual.estado           = edicion.estado ?? actual.estado;
    return actual;
}


async function getAdopcion(req, res, proceed) {
    let adopcion;
    if(req.params.id == "*") {proceed(); return;}
    try {
        adopcion = await Adopcion.findById(req.params.id);
        if(adopcion == null){
            return res.status(404).json({message: "La adopcion del historial no existe en la base de datos."});
        }
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
    res.adopcion = adopcion;
    proceed();
}

module.exports = router;