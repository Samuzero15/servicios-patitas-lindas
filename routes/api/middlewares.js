const Mascota = require('../../models/mascota')
const Empleado = require('../../models/empleado')
const Adopcion = require('../../models/adopcion')
const Entrada = require('../../models/entrada')
const Dueno = require('../../models/dueño')
// Middlewares pa las APIs.

module.exports = {
    getAdopcion: async (req, res, proceed) =>{
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
    },

    getEmpleado: async (req, res, proceed) => {
        let empleado;
        if(req.params.id == "*") {proceed(); return;}
        try {
            empleado = await Empleado.findById(req.params.id);
            if(empleado == null){
                return res.status(404).json({message: "El empleado no existe en la base de datos."});
            }
        } catch (error) {
            return res.status(500).json({message: error.message});
        }
        res.empleado = empleado;
        proceed();
    },
    
    getMascota: async (req, res, proceed) => {
        let mascota;
        let id = req.params.mascota;
        if(!req.params.mascota) id = req.params.id;
        if(id == "*") {proceed(); return;}
        try {
            mascota = await Mascota.findById(id);
            if(mascota == null){
                return res.status(404).json({message: "La mascota no existe en la base de datos."});
            }
        } catch (error) {
            return res.status(500).json({message: error.message});
        }
        res.mascota = mascota;
        proceed();
    },

    getDueno: async (req, res, proceed) => {
        let dueno;
        if(req.params.id == "*") {proceed(); return;}
        try {
            dueno = await Dueno.findById(req.params.id);
            if(dueno == null){
                return res.status(404).json({message: "El dueño no existe en la base de datos."});
            }
        } catch (error) {
            return res.status(500).json({message: error.message});
        }
        res.dueno = dueno;
        proceed();
    },

    getEntrada: async (req, res, proceed) => {
        let entrada;
        if(req.params.id == "*") {proceed(); return;}
        try {
            entrada = await Entrada.findById(req.params.id);
            if(entrada == null){
                return res.status(404).json({message: "La entrada del historial no existe en la base de datos."});
            }
        } catch (error) {
            return res.status(500).json({message: error.message});
        }
        res.entrada = entrada;
        proceed();
    }
}