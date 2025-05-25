const { readFile, writeFile } = require("./data.service");

const ALUMNS_FILE = require("path").join(__dirname, "../data/alumnos.json");

class AlumnsService {

    getCourseById = (id) => {
        const data = readFile(ALUMNS_FILE);
        const course = data?.courses?.find((c) => c.id === id);
        if (!course) {
            throw new Error("");
        }
        
        // TODO agregar la logica para obtener el nombre del profesor
        return course;
    };
    
    getAllAlumnsByCourse = (alumns) => {
        const data = readFile(ALUMNS_FILE);
        const response = data.filter((a)=>alumns.includes(a.id))
        return response
    }
    
}

const alumnService = new AlumnsService();

module.exports = alumnService;