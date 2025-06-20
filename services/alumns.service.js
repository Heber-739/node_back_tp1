const Alumno = require('../models/Alumno.model');

class AlumnsService {

    getAllAlumnsByIds = async (alumns) => {
        try {
            const encontrados = await Alumno.find({
                _id: { $in: alumns }
            });
            return encontrados;
        } catch (error) {
            console.error("Error al buscar alumnos por ID:", error);
            return [];
        }
    }

    getAllAlumns = async () => {
        try {
            const alumnos = await Alumno.find();
            return alumnos;
        } catch (error) {
            console.error("Error leyendo archivo de alumnos:", error);
            return [];
        }
    }

}

const alumnsService = new AlumnsService();

module.exports = {
    alumnsService,
};